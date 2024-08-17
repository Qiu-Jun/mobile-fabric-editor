<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-15 20:26:05
 * @LastEditTime: 2024-08-17 22:43:05
 * @LastEditors: June
 * @FilePath: \mobile-fabric-editor\src\pages\home\components\Opacity\index.vue
-->
<template>
  <wd-popup
    v-model="show"
    :lock-scroll="true"
    position="bottom"
    :safe-area-inset-bottom="true"
    @close="close"
  >
    <view class="w-full bg-#111 py-30rpx">
      <view class="f-center w-full mb-20rpx">
        <text class="text-26rpx text-#c8c8c8 mr-12rpx w-14vw">不透明度</text>
        <view class="w-70vw mx-20rpx">
          <wd-slider
            :min="0"
            :max="100"
            hide-label
            hide-min-max
            v-model="curOpacity"
            @dragmove="onChange"
          />
        </view>
        <view class="10vw text-#fff">{{ curOpacity }}</view>
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { throttle } from 'lodash-es'
import { useEditorStore } from '@/store'

const editorStore = useEditorStore()

const activeObj = computed(() => editorStore.canvas.getActiveObject())
const show = ref(false)

const updateAttr = (
  type:
    | 'fill'
    | 'fontStyle'
    | 'fontWeight'
    | 'opacity'
    | 'fontSize'
    | 'underline'
    | 'fontFamily'
    | 'stroke'
    | 'strokeWidth'
    | 'imgUrl',
  val: any
) => {
  const obj = unref(activeObj)
  obj.set({ [type]: val })
  editorStore.canvas.renderAll()
}
const curOpacity = ref(100)
const onChange = throttle(function ({ value }: { value: number }) {
  updateAttr('opacity', value / 100)
}, 250)

const open = () => {
  show.value = true
  nextTick(() => {
    const _activeObject = unref(activeObj)
    const _opacity = _activeObject.get('opacity')
    curOpacity.value = _opacity * 100
  })
}

const close = () => {
  curOpacity.value = 1
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
