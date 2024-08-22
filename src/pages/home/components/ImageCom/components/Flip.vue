<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-15 20:26:05
 * @LastEditTime: 2024-08-17 21:10:38
 * @LastEditors: June
 * @FilePath: \mine-pro\packages\editor\src\pages\home\components\ImageCom\components\Flip.vue
-->
<template>
  <wd-popup
    v-model="show"
    :lock-scroll="true"
    position="bottom"
    :safe-area-inset-bottom="true"
    @close="close"
  >
    <view class="bg-#111 flex flex-row items-center justify-around py-30rpx">
      <view
        class="f-center flex-col w-140rpx"
        v-for="(item, index) in flipList"
        :key="index"
        @click="flipTap(index)"
      >
        <SvgIcon
          :style="{ width: '48rpx', height: '48rpx' }"
          color="#fff"
          :name="item.icon"
        />
        <text class="text-#fff text-26rpx mt-10rpx">{{ item.name }}</text>
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { useEditorStore } from '@/store'

const editorStore = useEditorStore()
const activeObj = computed(() => editorStore.canvas.getActiveObject())
const flipList = [
  { icon: 'vf', name: '水平翻转' },
  { icon: 'hf', name: '垂直翻转' }
]

const flipTap = debounce(function (index: number) {
  const _activeObj = unref(activeObj)
  switch (index) {
    case 0:
      _activeObj.set({
        flipY: !_activeObj.flipY
      })
      break
    case 1:
      _activeObj.set({
        flipX: !_activeObj.flipX
      })
      break
    default:
      break
  }
  editorStore.canvas.renderAll()
}, 250)
const show = ref(false)

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
