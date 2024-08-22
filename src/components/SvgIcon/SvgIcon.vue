<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-17 19:34:52
 * @LastEditTime: 2024-08-17 19:34:56
 * @LastEditors: June
 * @FilePath: \mine-pro\packages\editor\src\components\SvgIcon\index.vue
-->
<template>
  <svg class="svg-icon" :style="iconStyle" aria-hidden="true">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup lang="ts" name="SvgIcon">
import { computed, CSSProperties } from 'vue'

interface SvgProps {
  name: string // 图标的名称 ==> 必传
  prefix?: string // 图标的前缀 ==> 非必传（默认为"icon"）
  iconStyle?: CSSProperties // 图标的样式 ==> 非必传
  color?: string // 填充颜色
}

const props = withDefaults(defineProps<SvgProps>(), {
  prefix: 'icon',
  color: ''
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  overflow: hidden;
  vertical-align: -0.15em; /* 因icon大小被设置为和字体大小一致，而span等标签的下边缘会和字体的基线对齐，故需设置一个往下的偏移比例，来纠正视觉上的未对齐效果 */
  outline: none;
  fill: currentcolor; /* 定义元素的颜色，currentColor是一个变量，这个变量的值就表示当前元素的color值，如果当前元素未设置color值，则从父元素继承 */
}
</style>
