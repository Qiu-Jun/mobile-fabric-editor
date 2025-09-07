<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-15 15:55:40
 * @LastEditTime: 2024-08-20 04:28:19
 * @LastEditors: June
 * @FilePath: \mine-pro\packages\editor\src\pages\home\components\Color\index.vue
-->
<template>
  <wd-popup
    v-model="show"
    :lock-scroll="true"
    position="bottom"
    :safe-area-inset-bottom="true"
  >
    <view
      class="w-full bg-#333 flex justify-start items-center flex-wrap box-border p-20rpx"
    >
      <view
        class="f-center flex-col mx-5rpx"
        v-for="(item, index) in colors"
        :key="index"
        @click="handleSetColor(item)"
      >
        <view
          class="color-dot-view f-center flex-col w-70rpx h-70rpx rounded-40rpx ml-10rpx mb-10rpx"
          :style="{
            borderColor:
              props.typeKey === 'TextBox'
                ? item == curColor
                  ? '#fff'
                  : 'transparent'
                : curColor == item
                ? '#fff'
                : 'transparent'
          }"
        >
          <template v-if="index === 0">
            <SvgIcon
              class="w-60rpx h-60rpx rounded-30rpx"
              :style="{ width: '60rpx', height: '60rpx' }"
              name="transparent"
            />
          </template>
          <template v-else>
            <view
              class="w-60rpx h-60rpx rounded-30rpx"
              :style="{ backgroundColor: item }"
            ></view>
          </template>
        </view>
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { colors } from '@/constants/editor'
import { useEditorStore } from '@/store'

const editorStore = useEditorStore()
const props = defineProps({
  typeKey: {
    type: String as PropType<'TextBox' | 'Bg'>,
    required: true
  }
})

const activeObj = computed(() => editorStore.canvas.getActiveObject())
const curColor = ref('')
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

const handleSetColor = debounce(function (color: string) {
  if (props.typeKey === 'Bg') {
    editorStore.canvas.setBackgroundColor(color)
    editorStore.canvas.renderAll()
    curColor.value = color
  } else {
    updateAttr('fill', color)
  }
}, 250)

const show = ref(false)
const open = () => {
  show.value = true
}
const close = () => {
  curColor.value = ''
  show.value = false
}

onMounted(() => {
  if (props.typeKey === 'Bg') {
    curColor.value = editorStore.canvas.get('backgroundColor')
  } else {
    const _activeObj = unref(activeObj)
    curColor.value = _activeObj.get('fill')
  }
})

defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.color-dot-view {
  border-style: solid;
  border-width: 3px;
}
</style>
