<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-23 14:58:37
 * @LastEditTime: 2024-08-23 16:01:58
 * @LastEditors: June
 * @FilePath: \mine-pro\packages\editor\src\pages\home\components\Size\index.vue
-->
<template>
  <wd-popup
    v-model="show"
    position="center"
    :safe-area-inset-bottom="true"
    @close="close"
  >
    <view class="w-710rpx bg-#fff rounded-24rpx">
      <view class="box-border p-20rpx mb-20rpx">
        <view class="flex justify-betwwen items-center">
          <view class="flex-1 mr-20rpx flex justify-start items-center">
            <view>宽度：</view>
            <wd-input-number v-model="state.width" />
          </view>
          <view class="flex-1 flex justify-start items-center">
            <view>高度：</view>
            <wd-input-number v-model="state.height" />
          </view>
        </view>

        <view
          v-for="size in sizeList"
          :key="size.name"
          class="flex justify-between items-center mt-20rpx"
          @click="handleSelect(size)"
        >
          <view>{{ size.name }}</view>
          <view>{{ size.width }}x{{ size.height }}</view>
        </view>
      </view>

      <view class="w-full f-center border-t-#ccc border-t-solid border-t-1rpx">
        <view
          class="h-72rpx flex-1 f-center border-r-#ccc border-r-solid border-r-1rpx"
          @click="close"
          >取消</view
        >
        <view class="h-72rpx flex-1 f-center" @click="handleConfirm"
          >确认
        </view>
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { useEditorStore } from '@/store'
import { sizeList } from '@/constants/editor'

const editorStore = useEditorStore()
const show = defineModel<boolean>('show')

const state = reactive({
  width: 0,
  height: 0
})

const handleSelect = debounce(function (size: {
  name: string
  width: number
  height: number
}) {
  state.width = size.width
  state.height = size.height
}, 250)

const handleConfirm = debounce(function () {
  editorStore.editor.workspacePlugin?.setSize(state.width, state.height)
  close()
}, 250)

const open = () => {
  show.value = true
}
const close = () => {
  show.value = false
}

defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
:deep(.wd-slider__label-max) {
  color: #fff;
}
</style>
