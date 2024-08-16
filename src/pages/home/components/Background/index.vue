<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-15 16:56:00
 * @LastEditTime: 2024-08-15 19:47:16
 * @LastEditors: June
 * @FilePath: \editor\src\pages\home\components\Background\index.vue
-->
<template>
  <view
    class="bg-#111 w-100vw flex items-center flex-row"
    :style="{
      height: _isIPhoneX ? '108px' : '80px',
      paddingBottom: _isIPhoneX ? '28px' : '8px'
    }"
  >
    <scroll-view
      class="w-100vw whitespace-nowrap"
      :show-scrollbar="false"
      scrollX
      scrollWithAnimation
    >
      <view
        class="inline-block h-full py-40rpx"
        v-for="(item, index) in list"
        :key="index"
        @click="handleMenu(index)"
      >
        <view class="f-center flex-col w-120rpx h-full">
          <image class="w-44rpx h-44rpx mb-8rpx" :src="item.icon" />
          <text class="text-26rpx mt-8rpx text-#fff">{{ item.name }}</text>
        </view>
      </view>
    </scroll-view>
  </view>

  <Color typeKey="Bg" ref="colorRef" />
</template>

<script lang="ts" setup>
import Color from '../Color/index.vue'
import icon1 from '@/static/images/bg.png'
import icon2 from '@/static/images/ic.png'
import icon3 from '@/static/images/qc.png'
import { isIPhoneX, getCanvasWH } from '@/utils/tools'
import { useEditorStore } from '@/store'

const editorStore = useEditorStore()
const _isIPhoneX = isIPhoneX()
const size = getCanvasWH()
const colorRef = ref()
const list = [
  { icon: icon1, name: '背景色' },
  { icon: icon2, name: '背景图' },
  { icon: icon3, name: '清除图片' }
]

const handleMenu = (index: number) => {
  switch (index) {
    case 0:
      colorRef.value?.open()
      break
    case 1:
      uni.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
        success: function (res) {
          uni.getImageInfo({
            // 获取图片宽高
            src: res.tempFilePaths[0],
            success: function (resp) {
              const tempFiles: any = res.tempFiles
              if (tempFiles[0]) {
                const reader = new FileReader()
                reader.readAsDataURL(tempFiles[0])
                // 图片文件完全拿到后执行
                reader.onload = () => {
                  // 转换成base64格式
                  const base64Img = reader.result
                  editorStore.canvas.setBackgroundImage(
                    base64Img,
                    editorStore.canvas.renderAll.bind(editorStore.canvas),
                    {
                      // 保证背景图1:1铺满容器
                      scaleX: size[0] / resp.width, //计算出图片要拉伸的宽度
                      scaleY: size[1] / resp.height //计算出图片要拉伸的高度
                    }
                  )
                }
              }
            }
          })
        }
      })
      break
    case 2:
      // 设置为null , 设置为""无效
      editorStore.canvas.setBackgroundImage(
        null,
        editorStore.canvas.renderAll.bind(editorStore.canvas)
      )
      break
    default:
      break
  }
}
</script>
