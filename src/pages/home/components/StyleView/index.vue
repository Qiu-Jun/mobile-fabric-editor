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
          <SvgIcon
            :style="{ width: '48rpx', height: '48rpx' }"
            :color="item.isActive ? '#fff' : '#999'"
            :name="item.icon"
          />
          <text
            class="text-26rpx mt-8rpx"
            :class="[item.isActive ? 'text-#fff' : 'text-#999']"
            >{{ item.name }}</text
          >
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
import { useEditorStore } from '@/store'

const editorStore = useEditorStore()
const activeObj = computed(() => editorStore.canvas.getActiveObject())
const current = ref(0) // 0 加粗   1 斜体   2 下划线
const styleList = ref([
  { icon: 'font_bold', name: '加粗', isActive: false },
  { icon: 'italic', name: '斜体', isActive: false },
  { icon: 'underline', name: '下划线', isActive: false }
])

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
  current.value = index
  switch (index) {
    case 0:
      state.fontWeight = state.fontWeight === 'normal' ? 'bold' : 'normal'
      styleList.value[index].isActive = state.fontWeight === 'bold'
      updateAttr('fontWeight', state.fontWeight)
      break
    case 1:
      state.fontStyle = state.fontStyle === 'normal' ? 'italic' : 'normal'
      styleList.value[index].isActive = state.fontStyle === 'italic'
      updateAttr('fontStyle', state.fontStyle)
      break
    case 2:
      state.underline = !state.underline
      styleList.value[index].isActive = state.underline
      updateAttr('underline', state.underline)
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
    styleList.value[0].isActive = state.fontWeight === 'bold'
    styleList.value[1].isActive = state.fontStyle === 'italic'
    styleList.value[2].isActive = state.underline
  })
}

const close = () => {
  current.value = 0
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
