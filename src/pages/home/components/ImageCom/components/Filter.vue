<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-15 20:26:05
 * @LastEditTime: 2024-08-18 01:42:57
 * @LastEditors: June
 * @FilePath: \mobile-fabric-editor\src\pages\home\components\ImageCom\components\Filter.vue
-->
<template>
  <wd-popup
    v-model="show"
    :lock-scroll="true"
    position="bottom"
    :safe-area-inset-bottom="true"
    @close="close"
  >
    <view class="w-full bg-#111 py-30rpx">
      <view
        class="f-center w-full mb-20rpx"
        v-for="(item, index) in fitterList"
        :key="index"
      >
        <text class="text-26rpx text-#c8c8c8 mr-12rpx w-12vw">{{
          item.name
        }}</text>
        <view class="w-70vw mx-20rpx">
          <wd-slider
            :min="0"
            :max="100"
            hide-label
            hide-min-max
            v-model="fitterInfo[item.key]"
            @dragmove="onChange($event, index)"
          />
        </view>
        <view class="10vw text-#fff">{{ fitterInfo[item.key] }}</view>
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { throttle } from 'lodash-es'
import { fabric } from 'fabric'
import { getFilter, getFabricFilterType } from '@/utils/tools'
import { fitterList } from '../../../constants'
import { useEditorStore } from '@/store'

const editorStore = useEditorStore()
const activeObj = computed(() => editorStore.canvas.getActiveObject())
const fitterInfo = reactive<Record<string, number>>({
  blur: 0,
  grayscale: 0,
  brightness: 0,
  contrast: 0,
  saturation: 0
})

const createFilter = (sourceImg: any, type: string, options = null) => {
  let filterObj
  // capitalize first letter for matching with fabric image filter name
  const fabricType = getFabricFilterType(type)
  // @ts-ignore
  const ImageFilter = fabric.Image.filters[fabricType]
  if (ImageFilter) {
    filterObj = new ImageFilter(options)
    filterObj.options = options
    sourceImg.filters.push(filterObj)
  }
  sourceImg.applyFilters()
  editorStore.canvas.renderAll()
  return filterObj
}
const applyFilterChange = (value: number, type: string, key: string) => {
  const _activeObject = unref(activeObj)
  let itemFilter: any = getFilter(_activeObject, type)
  if (itemFilter) {
    itemFilter[key] = value
    if (value == 0) {
      const { length } = _activeObject.filters
      let item, i
      for (i = 0; i < length; i += 1) {
        item = _activeObject.filters[i]
        if (item.type === type) {
          _activeObject.filters.splice(i, 1)
          break
        }
      }
    }
  } else {
    const imgFilter = createFilter(_activeObject, type)
    imgFilter[key] = value
  }
  _activeObject.applyFilters()
  editorStore.canvas.renderAll()
}

const changeFitter = (value: number, index: number) => {
  const v = (value / 100).toFixed(2)
  switch (index) {
    case 0:
      applyFilterChange(parseFloat(v), 'Blur', 'blur')
      break
    case 1:
      applyFilterChange(parseFloat(v), 'Grayscale', 'grayscale')
      break
    case 2:
      applyFilterChange(parseFloat(v), 'Brightness', 'brightness')
      break
    case 3:
      applyFilterChange(parseFloat(v), 'Contrast', 'contrast')
      break
    case 4:
      applyFilterChange(parseFloat(v), 'Saturation', 'saturation')
      break
    default:
      break
  }
}

const onChange = throttle(function (
  { value }: { value: number },
  index: number
) {
  changeFitter(value, index)
}, 250)

const getFilterData = () => {
  const _activeObj = unref(activeObj)
  let obj: any = {}
  fitterList.forEach((item) => {
    let itemFilter: any = getFilter(_activeObj, item.type)
    if (itemFilter) {
      let v = itemFilter[item.key]
      let v1 = (v * 100).toFixed(0)
      obj[item.key] = v1
    }
  })
  fitterInfo.blur = ~~(obj?.blur ?? 0)
  fitterInfo.grayscale = ~~(obj?.grayscale ?? 0)
  fitterInfo.brightness = ~~(obj?.brightness ?? 0)
  fitterInfo.contrast = ~~(obj?.contrast ?? 0)
  fitterInfo.saturation = ~~(obj?.saturation ?? 0)
}

const show = ref(false)

const open = () => {
  show.value = true
  nextTick(getFilterData)
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
