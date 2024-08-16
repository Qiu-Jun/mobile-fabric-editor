<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-15 14:31:27
 * @LastEditTime: 2024-08-16 14:06:25
 * @LastEditors: June
 * @FilePath: \mine-pro\packages\editor\src\pages\home\components\FontCom\index.vue
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
      class="w-100vw whitespace-nowrap"
      :show-scrollbar="false"
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

  <Color typeKey="TextBox" ref="colorRef" />
  <Opacity ref="opacityRef" />
  <Layer ref="layerRef" />
  <Arrow ref="arrowRef" />
  <StyleView ref="styleviewRef" />
  <FontView ref="fontviewRef" />
</template>

<script lang="ts" setup>
import Color from '../Color/index.vue'
import Opacity from '../Opacity/index.vue'
import Layer from '../Layer/index.vue'
import Arrow from '../Arrow/index.vue'
import StyleView from '../StyleView/index.vue'
import FontView from '../FontView/index.vue'
import { debounce } from 'lodash-es'
import icon1 from '@/static/images/1.png'
import icon2 from '@/static/images/text.png'
import icon3 from '@/static/images/3.png'
import icon4 from '@/static/images/4.png'
import icon5 from '@/static/images/5.png'
import icon6 from '@/static/images/dis.png'
import icon9 from '@/static/images/copy.png'
import icon10 from '@/static/images/mul.png'
import { isIPhoneX } from '@/utils/tools'
import { useEditorStore } from '@/store'

const editorStore = useEditorStore()
const activeObj = computed(() => editorStore.canvas.getActiveObject())
const _isIPhoneX = isIPhoneX()

const colorRef = ref()
const opacityRef = ref()
const layerRef = ref()
const arrowRef = ref()
const styleviewRef = ref()
const fontviewRef = ref()

const list = [
  { icon: icon9, name: '复制' },
  { icon: icon1, name: '改字' },
  { icon: icon2, name: '字体' },
  { icon: icon3, name: '颜色' },
  { icon: icon4, name: '样式' },
  { icon: icon5, name: '透明度' },
  { icon: icon6, name: '微调' },
  { icon: icon10, name: '图层' }
]
const paste = (_clipboard: any) => {
  _clipboard.clone(function (clonedObj: any) {
    editorStore.canvas?.discardActiveObject()
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
      if (_activeObj) {
        _activeObj.editable = true
        _activeObj.enterEditing()
        _activeObj.selectAll()
      }
      break
    case 2:
      fontviewRef.value?.open()
      break
    case 3:
      colorRef.value?.open()
      break
    case 4:
      styleviewRef.value?.open()
      break
    case 5:
      opacityRef.value?.open()
      break
    case 6:
      arrowRef.value?.open()
      break
    case 7:
      layerRef.value?.open()
      break
    default:
      break
  }
}, 250)
</script>
