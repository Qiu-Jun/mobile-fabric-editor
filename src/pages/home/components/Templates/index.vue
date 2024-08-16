<template>
  <wd-popup
    v-model="show"
    :lock-scroll="true"
    position="bottom"
    :safe-area-inset-bottom="true"
    custom-style="height: 68vh;"
  >
    <view
      class="h-full w-full p-15rpx flex flex-row flex-wrap overflow-y-scroll"
    >
      <template v-if="list.length > 0">
        <image
          class="w-31.3vw h-48vw mb-10rpx mr-8rpx img"
          v-for="item in list"
          :key="item"
          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
          @click="handleSelectTemp(item)"
        />
      </template>
      <template v-else>
        <view class="mt-20vh w-full text-28rpx text-#c7c7c7 text-center">
          暂无模板...
        </view>
      </template>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash-es'

const emits = defineEmits(['select'])

const show = ref(false)

const list = []

const handleSelectTemp = debounce(function (item) {
  emits('select', item)
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
.img {
  &:nth-child(3n) {
    margin-right: 0;
  }
}
</style>
