<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-04-24 09:32:13
 * @LastEditTime: 2024-08-16 10:54:00
 * @LastEditors: June
 * @FilePath: \mine-pro\packages\editor\src\pages\home\index.vue
-->
<template>
  <view class="bg-#222 w-100vw h-100vh relative f-center flex-col">
    <!-- 顶部操作栏  -->
    <view
      class="bg-#373b4a h-90rpx absolute left-0 top-0 w-100vw flex flex-row justify-between items-center"
    >
      <view class="w-10rpx h-10rpx"></view>
      <view class="flex flex-row items-center justify-end px-10px">
        <image
          class="w-40rpx h-40rpx mx-10rpx"
          :src="stateIndexRef > 0 ? alIcon : alnIcon"
          @click="handlePre"
        />
        <image
          class="w-40rpx h-40rpx mx-10rpx"
          :src="stateIndexRef < canvasStateRef.length - 1 ? arIcon : arnIcon"
          @click="handleNext"
        />
        <wd-button class="mx-20rpx" size="small" @click="handlePreview">
          预览
        </wd-button>
        <wd-button size="small" type="error" @click="handleSave">
          保存
        </wd-button>
      </view>
    </view>

    <!-- 编辑器 -->
    <view
      class="w-100vw h-80vh f-center flex-col"
      id="workspace"
      :style="{
        marginBottom: _isIPhoneX ? '10vh' : '6vh'
      }"
    ></view>

    <!-- 底部操作栏 -->
    <view
      class="absolute left-0 right-0 bottom-0 w-100vw flex flex-row items-center justify-around"
      :style="{
        height: _isIPhoneX ? '108px' : '80px',
        paddingBottom: _isIPhoneX ? '28px' : '8px'
      }"
    >
      <view
        class="f-center flex-col"
        v-for="(item, index) in bottomList"
        :key="index"
        @click="handleOperate(index)"
      >
        <image class="w-48rpx h-48rpx" :src="item.icon" />
        <text class="mt-10rpx text-#fff text-26rpx">{{ item.name }}</text>
      </view>
    </view>

    <!-- 底部组件 -->
    <view
      class="w-100vw absolute left-0 right-0 bottom-0 z-10"
      v-if="currentCom?.showPop && currentCom?.firstIndex !== 0"
    >
      <FontCom v-if="currentCom.firstIndex === 1" />
      <ImageCom v-else-if="currentCom.firstIndex === 2" />
      <Background v-else-if="currentCom.firstIndex === 3" />
    </view>
  </view>

  <Templates ref="tempRef" @select="onSelectTemp" />

  <!-- 预览 -->
  <wd-overlay class="f-center" :show="imgUrlInfo.showImg">
    <view class="relative">
      <view
        class="absolute left-50% -top-20rpx -translate-x-50% bg-#fff w-48rpx h-48rpx rounded-50% f-center"
        @click="handleClosePreview"
      >
        <wd-icon name="close" />
      </view>
      <image class="w-710rpx" mode="widthFix" :src="imgUrlInfo.imgUrl" />
    </view>
  </wd-overlay>
</template>

<script lang="ts" setup>
import Templates from './components/Templates/index.vue'
import FontCom from './components/FontCom/index.vue'
import ImageCom from './components/ImageCom/index.vue'
import Background from './components/Background/index.vue'
import alIcon from '@/static/images/al.png'
import arIcon from '@/static/images/ar.png'
import alnIcon from '@/static/images/al_normal.png'
import arnIcon from '@/static/images/ar_normal.png'
import initControls from '@/core/initControls'
import initAligningGuidelines from '@/core/initAligningGuidelines'
import { fitterList, bottomList } from './constants'
import { fabric } from 'fabric'
import { debounce } from 'lodash-es'
import {
  isIPhoneX,
  guid,
  downFontByJSON,
  getFilter,
  getCanvasWH
} from '@/utils/tools'
import { useEditorStore } from '@/store'

const editorStore = useEditorStore()
type ElementType = 'IText' | 'Image' | 'Textbox'

const baseShapeConfig = {
  Textbox: {
    text: '双击输入文字',
    fill: '#06c',
    width: 150,
    fontSize: 20,
    fontFamily: '华康金刚黑'
  },
  Image: {}
}
const _isIPhoneX = isIPhoneX()
const canvasStateRef = ref<any[]>([])

const workspace = ref<fabric.Rect | null>()
const size = getCanvasWH()
const option = reactive({
  width: size[0],
  height: size[1]
})

const workspaceEl = ref<HTMLElement | null>(null)
let canvasRef: any = null

type ICurrentCom = {
  showPop: boolean
  firstIndex: number
}

const currentCom = reactive<ICurrentCom>({
  showPop: true,
  firstIndex: 0
})
const setCurrentCom = (ops: ICurrentCom) => {
  currentCom.showPop = ops.showPop
  currentCom.firstIndex = ops.firstIndex
}

const getImgUrl = () => {
  const img = document.getElementById('editor')
  const src = (img as HTMLCanvasElement).toDataURL('image/png')
  return src
}

// 撤销 重做 start
const stateIndexRef = ref<number>(0)
const historyState = (index: number) => {
  // console.log("dd", index, canvasStateRef.current, stateIndexRef.current);
  canvasRef.loadFromJSON(JSON.parse(canvasStateRef.value[index]), () => {
    canvasRef.renderAll()
    stateIndexRef.value = index
  })
}
const handlePre = debounce(function () {
  if (stateIndexRef.value === 0) return
  historyState(stateIndexRef.value - 1)
}, 250)
const handleNext = debounce(function () {
  if (stateIndexRef.value === canvasStateRef.value.length - 1) return
  historyState(stateIndexRef.value + 1)
}, 250)
// 撤销 重做 end

// 预览
const imgUrlInfo = reactive({
  imgUrl: '',
  showImg: false
})
const handlePreview = debounce(function () {
  canvasRef.discardActiveObject()
  canvasRef.renderAll()
  imgUrlInfo.showImg = true
  imgUrlInfo.imgUrl = getImgUrl()
}, 250)
const handleClosePreview = debounce(function () {
  imgUrlInfo.showImg = false
  imgUrlInfo.imgUrl = ''
}, 250)

// 保存
const handleSave = debounce(function () {
  const val = '模板:' + guid() // 模板名字
  const id = guid()
  const json = canvasRef.toDatalessJSON(['id', 'selectable', 'hasControls'])
  // 存json
  const tplsV = JSON.parse(localStorage.getItem('tpls') || '{}')
  tplsV[id] = { json, t: val }
  localStorage.setItem('tpls', JSON.stringify(tplsV))
  // 存图片
  canvasRef.discardActiveObject()
  canvasRef.renderAll()
  const imgUrls = getImgUrl()
  const tplImgs = JSON.parse(localStorage.getItem('tplImgs') || '{}')
  // 后面接上传接口
  tplImgs[id] = imgUrls
  localStorage.setItem('tplImgs', JSON.stringify(tplImgs))
  // setTpls((prev: any) => [...prev, { id, t: val }])
  uni.showToast({ title: '模板保存成功！', icon: 'success' })
}, 250)

// 模板相关 start
const tempRef = ref()
const onSelectTemp = (item: any) => {
  console.log(item)
}
// 模板相关 end

// 字体相关 start
const currentFont = ref('')
// 当先选中object 文字
const currentTextBox = ref({
  familyValue: '',
  color: '',
  fontSize: 20,
  isBold: '',
  isXieTi: '',
  underline: false,
  opacity: '1'
}) // 当前选中文字

// 字体相关 end

const handleOperate = debounce(function (index: number) {
  switch (index) {
    case 0:
      tempRef.value?.open()
      setCurrentCom({ showPop: true, firstIndex: index })
      break
    case 1:
      insertElement('Textbox')
      setCurrentCom({ showPop: true, firstIndex: index })
      console.log(currentCom)
      break
    case 2:
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          // 方式一
          // 上面的实现方式，如果是在纯前端的环境下，保存时背景图是地址是本地地址( 'blob:http://192.168.1.4:10086/3b64aab5-df0e-4ed2-affc-791f8a52c346' )。
          // 这样不是很好，如果在别的电脑想通过 反序列化 渲染出来的时候，可能会出现问题
          // const tempFilePaths = res.tempFilePaths;
          // insertElement("Image", tempFilePaths[0]);

          // 方式二 可以将file 图片转成 base64 再生成背景图。
          const tempFiles: any = res.tempFiles
          if (tempFiles[0]) {
            const reader = new FileReader()
            reader.readAsDataURL(tempFiles[0])
            // 图片文件完全拿到后执行
            reader.onload = () => {
              // 转换成base64格式
              const base64Img = reader.result
              insertElement('Image', base64Img)
            }
          }
        }
      })
      break
    case 3:
      setCurrentCom({ showPop: true, firstIndex: index })
      break
    default:
      break
  }
}, 250)

/**
 * 设置画布中心到指定对象中心点上
 * @param {Object} obj 指定的对象
 */
const setCenterFromObject = (obj: fabric.Rect, canvas: any) => {
  const objCenter = obj.getCenterPoint()
  const viewportTransform = canvas.viewportTransform
  if (
    canvas.width === undefined ||
    canvas.height === undefined ||
    !viewportTransform
  )
    return
  viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0]
  viewportTransform[5] = canvas.height / 2 - objCenter.y * viewportTransform[3]
  canvas.setViewportTransform(viewportTransform)
  canvas.renderAll()
}

const setZoomAuto = (
  scale: number,
  cb?: (left?: number, top?: number) => void
) => {
  const center = canvasRef.getCenter()
  canvasRef.setViewportTransform(fabric.iMatrix.concat())
  canvasRef.zoomToPoint(new fabric.Point(center.left, center.top), scale)
  if (!workspace.value) return
  setCenterFromObject(workspace.value, canvasRef)

  // 超出画布不展示
  workspace.value.clone((cloned: fabric.Rect) => {
    cloned.id = 'workspace'
    canvasRef.clipPath = cloned
    canvasRef?.requestRenderAll()
  })
  if (cb) cb(workspace.value.left, workspace.value.top)
}

// 初始化画布
const initWorkspace = (canvas: any) => {
  const { width, height } = option
  const workspace1 = new fabric.Rect({
    fill: 'transparent',
    width,
    height,
    id: 'workspace'
  })
  workspace1.set('selectable', false)
  workspace1.set('hasControls', false)
  workspace1.hoverCursor = ''
  canvas.add(workspace1)
  canvas.renderAll()
  workspace.value = workspace1
  // const scale = _getScale();
  // setZoomAuto(scale);
  setZoomAuto(1)
}

// 初始化背景
const initBackground = (canvas: any) => {
  canvasRef.setBackgroundColor('#fff', canvas.renderAll.bind(canvas))
  canvasRef.setWidth(workspaceEl.value!.offsetWidth)
  canvasRef.setHeight(workspaceEl.value!.offsetHeight)
}

onMounted(() => {
  workspaceEl.value = document.getElementById('workspace') as HTMLElement
  if (!workspaceEl.value) {
    throw new Error('element #workspace is missing, plz check!')
  }
  // 直接使用使用canvas标签会有问题，查看控制台就知道这个cnavas是uni-canvas并非web原生的canvas
  const canvasEl = document.createElement('canvas')
  canvasEl.setAttribute('id', 'editor')
  workspaceEl.value.appendChild(canvasEl)
  canvasRef = new fabric.Canvas('editor', {
    preserveObjectStacking: true, // 禁止被选中的元素跑到视图的最顶层，保留原层级
    selection: false,
    includeDefaultValues: false, // 精简json
    controlsAboveOverlay: true // 超出clipPath后仍然展示控制条
  })
  editorStore.setCanvas(canvasRef)
  workspace.value = null
  // 选择器样式
  initControls(canvasRef)
  // 辅助线
  initAligningGuidelines(canvasRef)
  initBackground(canvasRef)
  initWorkspace(canvasRef)

  canvasRef.on({
    'mouse:down': mouseDown,
    'mouse:up': mouseUp,
    'object:modified': updateCanvasState,
    'object:added': updateCanvasState
  })
})

function mouseDown() {
  const activeObj = canvasRef?.getActiveObject()
  if (activeObj) {
    // 如果是文字
    if (activeObj.get('type') == 'textbox') {
      currentFont.value = activeObj.fontFamily
      currentTextBox.value = {
        ...unref(currentTextBox),
        familyValue: activeObj.fontFamily,
        color: activeObj.fill,
        fontSize: activeObj.fontSize,
        isBold: activeObj.fontWeight,
        isXieTi: activeObj.fontStyle,
        underline: activeObj.underline,
        opacity: activeObj.opacity
      }

      setCurrentCom({ showPop: true, firstIndex: 1 })
    } else if (['image', 'clipImage'].includes(activeObj.get('type'))) {
      // setCurrentImageBox({ ...currentImageBox, opacity: activeObj.opacity })
      // setSliderFitterValue()
      setCurrentCom({ showPop: true, firstIndex: 2 })
    }
  } else {
    setCurrentCom({ firstIndex: -1, showPop: false })
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function mouseUp(opt: any) {
  // console.log(opt)
}
function updateCanvasState() {
  const canvasAsJson = JSON.stringify(
    canvasRef.toJSON(['id', 'selectable', 'hasControls'])
  )
  canvasStateRef.value.splice(stateIndexRef.value + 1)
  canvasStateRef.value.push(canvasAsJson)
  stateIndexRef.value = canvasStateRef.value.length - 1
}

// 插入原色
function insertElement(type: ElementType, url?: any) {
  let shape: any = null
  if (type === 'Textbox') {
    shape = new fabric[type](guid(), {
      ...baseShapeConfig[type],
      left: size[0] / 2 - 75,
      top: size[1] / 2 - 20
    })
    currentFont.value = shape.fontFamily
    currentTextBox.value = {
      ...unref(currentTextBox),
      familyValue: shape.fontFamily,
      color: shape.fill,
      fontSize: shape.fontSize,
      isBold: shape.fontWeight,
      isXieTi: shape.fontStyle,
      underline: shape.underline,
      opacity: shape.opacity
    }
  } else if (type === 'Image') {
    fabric.Image.fromURL(url, function (oImg: any) {
      oImg.scale(1).set({
        ...baseShapeConfig[type],
        left: (size[0] - oImg.width * (size[0] / (2 * oImg.width))) / 2,
        top: (size[1] - oImg.height * (size[0] / (2 * oImg.width))) / 2,
        angle: 0,
        scaleX: size[0] / (2 * oImg.width), //按照默认的尺寸宽度为200的尺寸处理图片添加，所以此处计算原图宽和200的比例，进行缩放
        scaleY: size[0] / (2 * oImg.width) //纵向缩放比以横向比例为主
      })
      canvasRef.add(oImg).setActiveObject(oImg)
    })
    setCurrentCom({ showPop: true, firstIndex: 2 })
    return
  }
  canvasRef.add(shape).setActiveObject(shape) // 添加并设置激活
}
</script>
