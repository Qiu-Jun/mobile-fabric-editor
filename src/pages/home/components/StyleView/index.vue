<template>
  <wd-popup
    v-model="show"
    :lock-scroll="true"
    position="bottom"
    :safe-area-inset-bottom="true"
    @close="close"
  >
    <view class="bg-#111 py-30rpx">
      <view class="flex flex-row items-center justify-around">
        <view
          class="f-center flex-col w-120rpx"
          v-for="(item, index) in styleList"
          :key="index"
          @click="handleMenu(index)"
        >
          <image class="w-44rpx h-44rpx" :src="item.icon" />
          <text class="text-#fff text-26rpx mt-8rpx">{{ item.name }}</text>
        </view>
      </view>
      <view class="f-center w-full mb-20rpx w-full box-border p-20rpx">
        <text class="text-26rpx text-#c8c8c8 mr-12rpx w-14vw">字体</text>
        <view class="w-80vw mx-20rpx">
          <wd-slider
            :min="0"
            :max="100"
            hide-label
            hide-min-max
            v-model="state.fontSize"
            @dragmove="onChange"
          />
        </view>
        <view class="10vw text-#fff">{{ state.fontSize }}</view>
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { debounce, throttle } from 'lodash-es'
import bIcon from '@/static/images/b.png'
import bA from '@/static/images/b_a.png'
import xIcon from '@/static/images/x.png'
import xA from '@/static/images/x_a.png'
import uIcon from '@/static/images/u.png'
import uA from '@/static/images/u_a.png'
import { useEditorStore } from '@/store'

const editorStore = useEditorStore()
const activeObj = computed(() => editorStore.canvas.getActiveObject())
const styleList = [
  { icon: bIcon, acIcon: bA, name: '加粗' },
  { icon: xIcon, acIcon: xA, name: '斜体' },
  { icon: uIcon, acIcon: uA, name: '下划线' }
]

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
const state = reactive({
  fontSize: 0,
  fontWeight: 'normal',
  fontStyle: 'normal',
  underline: false
})
const handleMenu = debounce(function (index: number) {
  switch (index) {
    case 0:
      updateAttr(
        'fontWeight',
        state.fontWeight === 'normal' ? 'bold' : 'normal'
      )
      break
    case 1:
      updateAttr(
        'fontStyle',
        state.fontStyle === 'normal' ? 'italic' : 'normal'
      )
      break
    case 2:
      updateAttr('underline', !state.underline)
      break
    default:
      break
  }
}, 250)

const onChange = throttle(function ({ value }: { value: number }) {
  updateAttr('fontSize', value)
}, 250)

const show = ref(false)

const open = () => {
  show.value = true
  nextTick(() => {
    const _activeObj = unref(activeObj)
    state.fontSize = _activeObj.get('fontSize') || 0
    state.fontWeight = _activeObj.get('fontWeight') || 'normal'
    state.fontStyle = _activeObj.get('fontStyle') || 'normal'
    state.underline = _activeObj.get('underline') || false
  })
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
