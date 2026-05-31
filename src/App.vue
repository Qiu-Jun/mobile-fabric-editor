<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { updateMpWx } from '@/utils/update'
import { useAppStore } from '@/store'

const appStore = useAppStore()

onLaunch(async () => {
  const systemInfo = uni.getSystemInfoSync()
  appStore.setSystemInfo(systemInfo)
  // #ifdef MP-WEIXIN
  // 第三方时使用
  // const extJson = await uni.getExtConfigSync()
  // #endif
})
onShow(() => {
  // #ifdef MP-WEIXIN
  updateMpWx()
  // #endif
})
onHide(() => {
  // App hidden
})
</script>
<style></style>
