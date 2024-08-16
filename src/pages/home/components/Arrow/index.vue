<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-15 15:45:58
 * @LastEditTime: 2024-08-16 13:18:35
 * @LastEditors: June
 * @FilePath: \mine-pro\packages\editor\src\pages\home\components\Arrow\index.vue
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
        :key="item.name"
        @click="directionMove(index + 1)"
      >
        <image class="w-44rpx h-44rpx" :src="item.icon" />
        <text class="text-#fff text-26rpx mt-8rpx">{{ item.name }}</text>
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { throttle } from 'lodash-es'
import icon1 from '@/static/images/left.png'
import icon2 from '@/static/images/up.png'
import icon3 from '@/static/images/right.png'
import icon4 from '@/static/images/down.png'
import { useEditorStore } from '@/store'

const editorStore = useEditorStore()
const activeObj = computed(() => editorStore.canvas.getActiveObject())
const list = [
  { icon: icon1, name: '左移' },
  { icon: icon2, name: '上移' },
  { icon: icon3, name: '右移' },
  { icon: icon4, name: '下移' }
]

const directionMove = throttle(function (index: number) {
  const _activeObj = unref(activeObj)
  // 1左 2上 3右 4下
  switch (index) {
    case 1:
      _activeObj.set({
        left: _activeObj.left - 2
      })
      break
    case 2:
      _activeObj.set({
        top: _activeObj.top - 2
      })
      break
    case 3:
      _activeObj.set({
        left: _activeObj.left + 2
      })
      break
    case 4:
      _activeObj.set({
        top: _activeObj.top + 2
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
