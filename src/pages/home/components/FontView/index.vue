<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-16 12:40:31
 * @LastEditTime: 2024-08-16 18:34:49
 * @LastEditors: June
 * @FilePath: \mobile-fabric-editor\src\pages\home\components\FontView\index.vue
-->
<template>
  <wd-popup
    v-model="show"
    :lock-scroll="true"
    position="bottom"
    :safe-area-inset-bottom="true"
    @close="close"
    custom-style="height: 50vh;"
  >
    <view class="bg-#111 w-full h-full relative overflow-hidden pt-80rpx">
      <view
        class="box-border px-20rpx absolute left-0 right-0 top-0 text-#fff flex justify-between items-center h-80rpx z-1"
      >
        <text class="text-28rpx" @click="handleCancel">取消</text>
        <view class="flex-1 text-32rpx text-center font-bold">字体</view>
        <text class="text-28rpx" @click="handleConfirm">确认</text>
      </view>
      <view
        class="my-20rpx text-center text-#6a6a6a"
        :class="{
          'text-48rpx text-#fff': curIndex === index
        }"
        v-for="(font, index) in fontsList"
        :key="index"
        @click="handleFont(index)"
      >
        {{ font.name }}
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash-es'
import FontFaceObserver from 'fontfaceobserver'
import { fontsList } from '../../constants'
import { useEditorStore } from '@/store'

const editorStore = useEditorStore()
const activeObj = computed(() => editorStore.canvas.getActiveObject())
const show = ref(false)
const curIndex = ref(0)

const updateAttr = (
  type:
    | 'fill'
    | 'fontStyle'
    | 'fontWeight'
    | 'opacity'
    | 'underline'
    | 'fontFamily'
    | 'stroke'
    | 'strokeWidth'
    | 'imgUrl',
  val: string | undefined
) => {
  const obj = unref(activeObj)
  obj.set({ [type]: val })
  editorStore.canvas.renderAll()
}

const open = () => {
  show.value = true
}

const close = () => {
  curIndex.value = 0
  show.value = false
}

const handleCancel = debounce(close, 250)
const handleFont = debounce(function (index: number) {
  curIndex.value = index
}, 250)
const handleConfirm = debounce(function () {
  const _curIndex = unref(curIndex)
  const fontName = fontsList[_curIndex].name
  const font = new FontFaceObserver(fontName)
  font
    .load(null, 150000)
    .then(() => {
      updateAttr('fontFamily', fontName)
      close()
    })
    .catch((err) => {
      alert(err)
    })
}, 250)

defineExpose({
  open,
  close
})
</script>
