<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-15 16:24:07
 * @LastEditTime: 2024-08-16 13:30:48
 * @LastEditors: June
 * @FilePath: \mine-pro\packages\editor\src\pages\home\components\Layer\index.vue
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
        class="f-center flex-col w-120rpx"
        v-for="(item, index) in list"
        :key="index"
        @click="layerTap(index)"
      >
        <image class="w-44rpx h-44rpx" :src="item.icon" />
        <text class="text-#fff text-26rpx mt-8rpx">{{ item.name }}</text>
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash-es'
import icon1 from '@/static/images/top.png'
import icon2 from '@/static/images/front.png'
import icon3 from '@/static/images/back1.png'
import icon4 from '@/static/images/bo.png'
import { useEditorStore } from '@/store'

const editorStore = useEditorStore()
const activeObj = computed(() => editorStore.canvas.getActiveObject())
const list = [
  { icon: icon1, name: '置顶层' },
  { icon: icon2, name: '上一层' },
  { icon: icon3, name: '下一层' },
  { icon: icon4, name: '置底层' }
]

const layerTap = debounce(function (index: number) {
  const _activeObj = unref(activeObj)
  switch (index) {
    case 0:
      _activeObj.bringToFront()
      break
    case 1:
      _activeObj.bringForward()
      break
    case 2:
      _activeObj.sendBackwards()
      break
    case 3:
      _activeObj.sendToBack()
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
