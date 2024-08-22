<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-17 19:18:03
 * @LastEditTime: 2024-08-23 02:39:47
 * @LastEditors: June
 * @FilePath: \mobile-fabric-editor\src\pages\home\index.vue
-->
<template>
  <view class="bg-#222 w-100vw h-100vh relative f-center flex-col">
    <!-- 顶部操作栏  -->
    <view
      class="bg-#373b4a h-90rpx absolute left-0 top-0 w-100vw flex flex-row justify-between items-center"
    >
      <view class="flex flex-row items-center justify-start px-10px">
        <wd-button class="mx-10rpx" size="small" @click="handleMaterial">
          素材
        </wd-button>
      </view>
      <view class="flex flex-row items-center justify-end px-10px">
        <SvgIcon
          class="mr-10rpx"
          :style="{ width: '40rpx', height: '40rpx' }"
          :color="stateIndexRef > 0 ? '#fff' : '#999'"
          name="undo"
          @click="handlePre"
        />
        <SvgIcon
          :style="{ width: '40rpx', height: '40rpx' }"
          :color="stateIndexRef < canvasStateRef.length - 1 ? '#fff' : '#999'"
          name="redo"
          @click="handleNext"
        />
        <wd-button class="mx-10rpx" size="small" @click="handlePreview">
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
        v-for="item in HomeTabList"
        :key="item.type"
        @click="handleOperate(item.type)"
      >
        <SvgIcon
          :style="{ width: '48rpx', height: '48rpx' }"
          color="#fff"
          :name="item.icon"
        />
        <text class="mt-10rpx text-#fff text-26rpx">{{ item.name }}</text>
      </view>
    </view>

    <!-- 底部组件 -->
    <view
      class="w-100vw absolute left-0 right-0 bottom-0 z-10"
      v-if="currentCom?.showPop && currentCom?.comType !== TabItem.template"
    >
      <FontCom v-if="currentCom.comType === TabItem.text" />
      <ImageCom v-else-if="currentCom.comType === TabItem.image" />
      <Background v-else-if="currentCom.comType === TabItem.bg" />
    </view>
  </view>

  <Templates ref="tempRef" @select="onSelectTemp" />
  <Material ref="materialRef" @select="onMaterial" />
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
import Material from './components/Material/index.vue'
import FontCom from './components/FontCom/index.vue'
import ImageCom from './components/ImageCom/index.vue'
import Background from './components/Background/index.vue'
import { fabric } from 'fabric'
import { debounce } from 'lodash-es'
import { isIPhoneX, guid, downFontByJSON } from '@/utils/tools'
import { Editor } from '@/core/editor'
import { TabItem } from '@/enums'
import { HomeTabList } from '@/constants/tabs'
import { useEditorStore } from '@/store'
import { LinePoolItem } from '@/constants/lines'
import { useHandleCreate } from '@/hooks/useHandleCreate'

const editorStore = useEditorStore()

type ElementType = 'IText' | 'Image' | 'Textbox'
type TabType = TabItem.template | TabItem.text | TabItem.image | TabItem.bg
type ICurrentCom = {
  showPop: boolean
  comType: TabType
}

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

let canvasRef: any = null
let editor: any = null

const currentCom = reactive<ICurrentCom>({
  showPop: true,
  comType: TabItem.template
})
const setCurrentCom = (ops: ICurrentCom) => {
  currentCom.showPop = ops.showPop
  currentCom.comType = ops.comType
}

const getImgUrl = () => {
  const img = document.getElementById('editor')
  const src = (img as HTMLCanvasElement).toDataURL('image/png')
  return src
}

// 撤销 重做 start
const stateIndexRef = ref<number>(0)
const historyState = (index: number) => {
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
  item.id && renderJson(item.id)
}
// 模板相关 end

// 素材相关 start
const materialRef = ref()
const { createLineElement } = useHandleCreate()
const handleMaterial = debounce(function () {
  materialRef.value?.open()
}, 250)
const drawLine = (line: LinePoolItem) => {
  const strokeDashArray: [number, number] | undefined =
    line.style === 'dashed' ? [6, 6] : undefined
  const element = createLineElement(
    line.data,
    line.points[0],
    line.points[1],
    strokeDashArray
  )
  canvasRef.add(element)
  canvasRef.setActiveObject(element)
  canvasRef.renderAll()
  updateCanvasState()
}
const onMaterial = (item: LinePoolItem) => {
  drawLine(item)
}
// 素材相关end

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

const handleOperate = debounce(function (type: TabType) {
  switch (type) {
    case TabItem.template:
      tempRef.value?.open()
      setCurrentCom({ showPop: true, comType: type })
      break
    case TabItem.text:
      insertElement('Textbox')
      setCurrentCom({ showPop: true, comType: type })
      break
    case TabItem.image:
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
    case TabItem.bg:
      setCurrentCom({ showPop: true, comType: type })
      break
    default:
      break
  }
}, 250)

onMounted(() => {
  editor = new Editor()
  canvasRef = editor.canvas
  editorStore.setEditor(editor)
  canvasRef.on({
    'mouse:down': mouseDown,
    'mouse:up': mouseUp,
    'object:modified': updateCanvasState,
    'object:added': updateCanvasState
  })

  // 初始化组件选择
  uni.$on('initCurrentCom', () =>
    setCurrentCom({ showPop: false, comType: TabItem.template })
  )
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

      setCurrentCom({ showPop: true, comType: TabItem.text })
    } else if (['image', 'clipImage'].includes(activeObj.get('type'))) {
      // setCurrentImageBox({ ...currentImageBox, opacity: activeObj.opacity })
      // setSliderFitterValue()
      setCurrentCom({ showPop: true, comType: TabItem.image })
    }
  } else {
    setCurrentCom({ comType: TabItem.template, showPop: false })
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
  const size = editor.workspacePlugin?.workspaceSize
  let shape: any = null
  if (type === 'Textbox') {
    shape = new fabric[type](guid(), {
      ...baseShapeConfig[type],
      left: size.width / 2 - 75,
      top: size.height / 2 - 20
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
        left: (size.width - oImg.width * (size.width / (2 * oImg.width))) / 2,
        top: (size.height - oImg.height * (size.width / (2 * oImg.width))) / 2,
        angle: 0,
        scaleX: size.width / (2 * oImg.width), //按照默认的尺寸宽度为200的尺寸处理图片添加，所以此处计算原图宽和200的比例，进行缩放
        scaleY: size.width / (2 * oImg.width) //纵向缩放比以横向比例为主
      })
      canvasRef.add(oImg).setActiveObject(oImg)
    })
    setCurrentCom({ showPop: true, comType: TabItem.image })
    return
  }
  canvasRef.add(shape).setActiveObject(shape) // 添加并设置激活
}

// 读取模板 json
function renderJson(id: string) {
  const tplsV = JSON.parse(localStorage.getItem('tpls') || '{}')
  clear()
  // 加载字体后导入
  downFontByJSON(tplsV[id].json).then(() => {
    canvasRef.loadFromJSON(tplsV[id].json, () => {
      canvasRef.renderAll.bind(canvasRef)
      editor.workspacePlugin?.resetWorkspace()
    })
  })
}

// 清空画布
function clear() {
  canvasRef.clear()
}
</script>
