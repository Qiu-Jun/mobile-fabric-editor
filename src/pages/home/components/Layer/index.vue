<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-15 16:24:07
 * @LastEditTime: 2024-08-18 12:15:18
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
const list = [
  { icon: 'tot', name: '置顶层' },
  { icon: 'layer_pre', name: '上一层' },
  { icon: 'layer_next', name: '下一层' },
  { icon: 'tob', name: '置底层' }
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
