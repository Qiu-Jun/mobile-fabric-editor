<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-16 17:33:20
 * @LastEditTime: 2024-08-17 14:39:56
 * @LastEditors: June
 * @FilePath: \mobile-fabric-editor\src\pages\home\components\Templates\index.vue
-->
<template>
  <wd-popup
    v-model="show"
    :lock-scroll="true"
    position="bottom"
    :safe-area-inset-bottom="true"
    custom-style="height: 68vh;"
  >
    <view
      class="bg-#111 h-full w-full p-15rpx flex flex-row flex-wrap overflow-y-scroll"
    >
      <template v-if="list.length > 0">
        <image
          class="w-31.3vw h-48vw mb-10rpx mr-8rpx img"
          v-for="item in list"
          :key="item"
          :src="item.img"
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

const list: any = ref([])

const open = () => {
  show.value = true
}
const close = () => {
  show.value = false
}

const handleSelectTemp = debounce(function (item) {
  emits('select', item)
  close()
}, 250)

onMounted(() => {
  const tplsValue = JSON.parse(localStorage.getItem('tpls') || '{}')
  const tplImgs = JSON.parse(localStorage.getItem('tplImgs') || '{}')
  const _list = Object.keys(tplsValue).map((item) => ({
    t: tplsValue[item].t,
    id: item
  }))
  if (_list.length === 0) return
  list.value = _list.map((i) => ({
    ...i,
    img: tplImgs[i.id]
  }))
})

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
