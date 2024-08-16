<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-15 13:59:45
 * @LastEditTime: 2024-08-16 12:20:44
 * @LastEditors: June
 * @FilePath: \mine-pro\packages\editor\src\pages\home\components\ImageCom\index.vue
-->
<template>
  <view
    class="bg-#111 w-100vw flex flex-row items-center"
    :style="{
      height: _isIPhoneX ? '108px' : '80px',
      paddingBottom: _isIPhoneX ? '28px' : '8px'
    }"
  >
    <scroll-view
      class="w-100vw whitespace-nowrap py-30rpx"
      scrollX
      scrollWithAnimation
    >
      <view
        class="inline-block h-full py-40rpx"
        v-for="(item, index) in list"
        :key="index"
        @click="handleMenu(index)"
      >
        <view class="f-center flex-col w-120rpx h-full">
          <image class="w-44rpx h-44rpx mb-8rpx" :src="item.icon" />
          <text class="text-26rpx mt-8rpx text-#fff">{{ item.name }}</text>
        </view>
      </view>
    </scroll-view>
  </view>

  <Flip ref="flipRef" />
  <Filter ref="filterRef" />
  <Arrow ref="arrowRef" />
  <Layer ref="layerRef" />
  <Opacity ref="opacityRef" />
  <!-- <component :ref="setItemRef" :is="comMap[comKey]" /> -->
</template>

<script lang="ts" setup>
import Flip from './components/Flip.vue'
import Filter from './components/Filter.vue'
import Arrow from '../Arrow/index.vue'
import Layer from '../Layer/index.vue'
import Opacity from '../Opacity/index.vue'
import { debounce } from 'lodash-es'
import icon1 from '@/static/images/1.png'
import icon2 from '@/static/images/dis.png'
import icon3 from '@/static/images/5.png'
import icon4 from '@/static/images/fz1.png'
import icon7 from '@/static/images/copy.png'
import icon8 from '@/static/images/mul.png'
import icon9 from '@/static/images/jian.png'
import icon10 from '@/static/images/lvj.png'
import { isIPhoneX } from '@/utils/tools'

import { useEditorStore } from '@/store'

const flipRef = ref()
const filterRef = ref()
const arrowRef = ref()
const layerRef = ref()
const opacityRef = ref()
const editorStore = useEditorStore()
const activeObj = computed(() => editorStore.canvas.getActiveObject())
const _isIPhoneX = isIPhoneX()
const list = [
  { icon: icon7, name: '复制' },
  { icon: icon1, name: '换图' },
  { icon: icon10, name: '滤镜' },
  { icon: icon8, name: '图层' },
  { icon: icon4, name: '翻转' },
  { icon: icon3, name: '透明度' },
  { icon: icon2, name: '微调' }
]

// type IComKey = 'flip' | 'filter' | 'arrow' | 'layer' | 'opacity' | 'default'
// const comKey = ref<IComKey>('default')
// const comMap: Record<IComKey, any> = {
//   flip: Flip,
//   filter: Filter,
//   arrow: Arrow,
//   layer: Layer,
//   opacity: Opacity,
//   default: null
// }
// const refMap: Record<IComKey, any> = {}
// const setItemRef = (el: any) => {
//   if (el && !refMap[comKey.value]) {
//     refMap[comKey.value] = el
//   }
// }
const paste = (_clipboard: any) => {
  _clipboard.clone(function (clonedObj: any) {
    editorStore.canvas.discardActiveObject()
    clonedObj.set({
      left: clonedObj.left + 20,
      top: clonedObj.top + 20,
      evented: true
    })
    if (clonedObj.type === 'activeSelection') {
      clonedObj.canvas = editorStore.canvas
      clonedObj.forEachObject(function (obj: any) {
        editorStore.canvas.add(obj)
      })
      clonedObj.setCoords()
    } else {
      editorStore.canvas.add(clonedObj)
    }
    _clipboard.top += 20
    _clipboard.left += 20
    editorStore.canvas.setActiveObject(clonedObj)
  })
}

const handleMenu = debounce(function (index: number) {
  const _activeObj = unref(activeObj)
  switch (index) {
    case 0:
      _activeObj.clone(function (cloned: any) {
        paste(cloned)
      })
      editorStore.canvas.renderAll()
      break
    case 1:
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          const tempFiles: any = res.tempFiles
          if (tempFiles[0]) {
            const reader = new FileReader()
            reader.readAsDataURL(tempFiles[0])
            // 图片文件完全拿到后执行
            reader.onload = () => {
              // 转换成base64格式
              const base64Img = reader.result
              _activeObj.setSrc(base64Img, () => {
                editorStore.canvas.renderAll()
              })
            }
          }
        }
      })
      break
    case 2:
      // 滤镜
      filterRef.value?.open()
      break
    case 3:
      layerRef.value?.open()
      break
    case 4:
      flipRef.value?.open()
      break
    case 5:
      opacityRef.value?.open()
      break
    case 6:
      arrowRef.value?.open()
      break
    default:
      break
  }
}, 250)
</script>
