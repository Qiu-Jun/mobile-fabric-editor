<!--
 * @Author: June
 * @Description:
 * @Date: 2024-08-16 17:33:20
 * @LastEditTime: 2024-11-23 08:26:18
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
          :key="item.id"
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
import temp1Img from '@/assets/temps/temp1.png'
import temp2Img from '@/assets/temps/temp2.png'
import temp1Data from '@/assets/temps/temp1.json'
import temp2Data from '@/assets/temps/temp2.json'

interface TemplateItem {
  id: string
  img: string
  json?: Record<string, unknown>
}

const emits = defineEmits(['select'])

const show = ref(false)
const list = ref<TemplateItem[]>([])

const open = () => {
  show.value = true
}
const close = () => {
  show.value = false
}

const handleSelectTemp = debounce(function (item: TemplateItem) {
  emits('select', item)
  close()
}, 250)

const initTemplate = () => {
  // 本地预设模板
  const localTemplates: TemplateItem[] = [
    {
      id: 'local_temp1',
      img: temp1Img,
      json: temp1Data as unknown as Record<string, unknown>
    },
    {
      id: 'local_temp2',
      img: temp2Img,
      json: temp2Data as unknown as Record<string, unknown>
    }
  ]

  // 用户保存的模板
  const tplsValue = JSON.parse(localStorage.getItem('tpls') || '{}')
  const tplImgs = JSON.parse(localStorage.getItem('tplImgs') || '{}')
  const userTemplates: TemplateItem[] = Object.keys(tplsValue).map((id) => ({
    id,
    img: tplImgs[id]
  }))

  // 本地模板在前，用户模板在后
  list.value = [...localTemplates, ...userTemplates]
}

watch(
  () => show.value,
  (val) => {
    if (val) {
      initTemplate()
    }
  },
  {
    immediate: true
  }
)

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
