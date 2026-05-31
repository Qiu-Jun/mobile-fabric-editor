<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-15 14:31:27
 * @LastEditTime: 2024-08-18 14:11:18
 * @LastEditors: June
 * @FilePath: \mine-pro\packages\editor\src\pages\home\components\FontCom\index.vue
-->
<template>
  <view
    class="bg-#111 w-100vw flex flex-row items-center"
    :style="{
      height: toolbarHeight,
      paddingBottom: toolbarPaddingBottom
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
        v-for="item in TextTabList"
        :key="item.type"
        @click="handleMenu(item.type)"
      >
        <view class="f-center flex-col w-120rpx h-full">
          <SvgIcon
            :style="{ width: '48rpx', height: '48rpx' }"
            color="#fff"
            :name="item.icon"
          />
          <text class="text-26rpx mt-10rpx text-#fff">{{ item.name }}</text>
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
import { useEditorStore } from '@/store'
import { useClipboard } from '@/hooks/useClipboard'
import { useSafeArea } from '@/hooks/useSafeArea'
import { TextTab } from '@/enums'
import { TextTabList } from '@/constants/tabs'

const editorStore = useEditorStore()
const activeObj = computed(() => editorStore.canvas?.getActiveObject())
const { paste } = useClipboard()
const { toolbarHeight, toolbarPaddingBottom } = useSafeArea()

const colorRef = ref()
const opacityRef = ref()
const layerRef = ref()
const arrowRef = ref()
const styleviewRef = ref()
const fontviewRef = ref()

const handleMenu = debounce(function (type: string) {
  const _activeObj = unref(activeObj)
  switch (type) {
    case TextTab.copy:
      _activeObj.clone(function (cloned: any) {
        paste(cloned)
      })
      editorStore.canvas.renderAll()
      break
    case TextTab.text:
      if (_activeObj) {
        _activeObj.editable = true
        _activeObj.enterEditing()
        _activeObj.selectAll()
      }
      break
    case TextTab.font:
      fontviewRef.value?.open()
      break
    case TextTab.color:
      colorRef.value?.open()
      break
    case TextTab.style:
      styleviewRef.value?.open()
      break
    case TextTab.opacity:
      opacityRef.value?.open()
      break
    case TextTab.tuning:
      arrowRef.value?.open()
      break
    case TextTab.layer:
      layerRef.value?.open()
      break
    default:
      break
  }
}, 250)
</script>
