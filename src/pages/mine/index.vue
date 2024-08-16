<template>
  <wd-navbar title="标题" left-text="返回" right-text="设置" left-arrow>
    <template #capsule>
      <wd-navbar-capsule @back="handleBack" @back-home="handleBackHome" />
    </template>
  </wd-navbar>
  <view>mine</view>
  <Cfooter />
</template>

<script lang="ts" setup>
import Cfooter from '@/components/Footer/index.vue'
import { useAppStore } from '@/store'

const appStore = useAppStore()
console.log(appStore.systemInfo)

function handleBack() {
  uni.navigateBack({})
}

function handleBackHome() {
  uni.switchTab({ url: '/pages/home/index' })
}
</script>
