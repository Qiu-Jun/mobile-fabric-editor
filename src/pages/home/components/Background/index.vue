<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-15 16:56:00
 * @LastEditTime: 2024-08-20 03:56:54
 * @LastEditors: June
 * @FilePath: \mine-pro\packages\editor\src\pages\home\components\Background\index.vue
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
        v-for="item in BgTabList"
        :key="item.type"
        @click="handleMenu(item.type)"
      >
        <view class="f-center flex-col w-120rpx h-full">
          <SvgIcon
            :style="{ width: '48rpx', height: '48rpx' }"
            color="#fff"
            :name="item.icon"
          />
          <text class="text-26rpx mt-8rpx text-#fff">{{ item.name }}</text>
        </view>
      </view>
    </scroll-view>
  </view>

  <Color typeKey="Bg" ref="colorRef" />
</template>

<script lang="ts" setup>
import Color from '../Color/index.vue'
import { isIPhoneX } from '@/utils/tools'
import { useEditorStore } from '@/store'
import { BgTabItem } from '@/enums'
import { BgTabList } from '@/constants/tabs'

const editorStore = useEditorStore()
const _isIPhoneX = isIPhoneX()
const size = editorStore.editor.workspacePlugin.workspaceSize
const colorRef = ref()

const handleMenu = (type: string) => {
  switch (type) {
    case BgTabItem.color:
      colorRef.value?.open()
      break
    case BgTabItem.image:
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
                      scaleX: size.width / resp.width, //计算出图片要拉伸的宽度
                      scaleY: size.height / resp.height //计算出图片要拉伸的高度
                    }
                  )
                }
              }
            }
          })
        }
      })
      break
    case BgTabItem.clear:
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
