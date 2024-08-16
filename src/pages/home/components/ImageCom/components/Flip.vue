<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-15 20:26:05
 * @LastEditTime: 2024-08-15 22:17:49
 * @LastEditors: June
 * @FilePath: \editor\src\pages\home\components\ImageCom\components\Flip.vue
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
        <image class="w-44rpx h-44rpx" :src="item.icon" />
        <text class="text-#fff text-26rpx mt-8rpx">{{ item.name }}</text>
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash-es'
import icon5 from '@/static/images/hf.png'
import icon6 from '@/static/images/vf.png'
import { useEditorStore } from '@/store'

const editorStore = useEditorStore()
const activeObj = computed(() => editorStore.canvas.getActiveObject())
const flipList = [
  { icon: icon5, name: '水平翻转' },
  { icon: icon6, name: '垂直翻转' }
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
