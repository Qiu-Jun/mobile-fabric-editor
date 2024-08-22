<template>
  <wd-popup
    v-model="show"
    :lock-scroll="true"
    position="bottom"
    :safe-area-inset-bottom="true"
    @close="close"
  >
    <div class="w-full box-border p-20rpx">
      <div class="category" v-for="(item, i) in PathLineLibs" :key="item.type">
        <div
          class="w-full text-28rpx mb-20rpx border-l-8rpx border-l-solid border-l-#aaa py-4rpx pl-20rpx"
        >
          {{ item.type }}
        </div>
        <div class="flex justify-start items-center mb-20rpx">
          <div
            class="relative w-72rpx"
            v-for="(line, j) in item.children"
            :key="j"
          >
            <div class="f-center text-#999" @click="selectLine(line)">
              <svg overflow="visible" width="20" height="20">
                <defs>
                  <LinePointMarker
                    class="line-marker"
                    v-if="line.points[0]"
                    :id="`preset-line-${i}-${j}`"
                    position="start"
                    :type="line.points[0]"
                    color="currentColor"
                    :baseSize="2"
                  />
                  <LinePointMarker
                    class="line-marker"
                    v-if="line.points[1]"
                    :id="`preset-line-${i}-${j}`"
                    position="end"
                    :type="line.points[1]"
                    color="currentColor"
                    :baseSize="2"
                  />
                </defs>
                <path
                  class="line-path"
                  :d="line.path"
                  stroke="currentColor"
                  fill="none"
                  stroke-width="2"
                  :stroke-dasharray="line.style === 'solid' ? '0, 0' : '4, 1'"
                  :marker-start="
                    line.points[0]
                      ? `url(#${`preset-line-${i}-${j}`}-${
                          line.points[0]
                        }-start)`
                      : ''
                  "
                  :marker-end="
                    line.points[1]
                      ? `url(#${`preset-line-${i}-${j}`}-${line.points[1]}-end)`
                      : ''
                  "
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </wd-popup>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash-es'
import LinePointMarker from '@/components/LinePointMarker/index.vue'
import { PathLineLibs, LinePoolItem } from '@/constants/lines'

const show = ref(false)
const emit = defineEmits<{
  (event: 'select', payload: LinePoolItem): void
}>()

const selectLine = debounce(function (line: LinePoolItem) {
  emit('select', line)
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
:deep(.wd-slider__label-max) {
  color: #fff;
}
</style>
