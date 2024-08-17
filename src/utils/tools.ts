import FontFaceObserver from 'fontfaceobserver'
import { fontsList } from '@/pages/home/constants'
import { intersectionWith, isEqual } from 'lodash-es'
/*
 * @Author: June
 * @Description:
 * @Date: 2024-08-14 23:16:55
 * @LastEditTime: 2024-08-17 14:47:54
 * @LastEditors: June
 * @FilePath: \mobile-fabric-editor\src\utils\tools.ts
 */
export const testUA = (str: string) => {
  return navigator.userAgent.indexOf(str) > -1
}

export const isIPhoneX = () => {
  if (process.env.VUE_APP_PLATFORM === 'h5') {
    return (
      (window.devicePixelRatio &&
        window.devicePixelRatio === 3 &&
        window.screen.width === 375 &&
        testUA('iPhone')) ||
      (window.devicePixelRatio &&
        window.devicePixelRatio === 3 &&
        window.screen.width === 414 &&
        window.screen.height === 896 &&
        testUA('iPhone')) ||
      (window.devicePixelRatio &&
        window.devicePixelRatio === 3 &&
        window.devicePixelRatio &&
        window.devicePixelRatio === 3 &&
        window.screen.height === 844 &&
        testUA('iPhone')) ||
      (window.devicePixelRatio &&
        window.devicePixelRatio === 3 &&
        window.screen.height === 926 &&
        testUA('iPhone')) ||
      (window.devicePixelRatio &&
        window.devicePixelRatio === 3 &&
        window.screen.height === 780 &&
        testUA('iPhone'))
    )
  }
  const { model } = uni.getSystemInfoSync()
  return (
    model.search('iPhone X') != -1 ||
    model.search('11') != -1 ||
    model.search('12') != -1 ||
    model.search('13') != -1 ||
    model.search('14') != -1 ||
    model.search('15') != -1
  )
}

export function getCanvasWH() {
  const infoSys = uni.getSystemInfoSync()
  const { windowWidth } = infoSys
  return [windowWidth * 0.85, windowWidth * 1.4]
}

/**
 * 生成guid
 */
export const guid = () => {
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  )
}

/**
 * Get applied filter instance
 * @param {fabric.Image} sourceImg - Source image to apply filter
 * @param {string} type - Filter type
 * @returns {Object} Fabric object of filter
 * @private
 */
export const getFilter = (sourceImg: any, type: string) => {
  let imgFilter = null

  if (sourceImg) {
    const fabricType = getFabricFilterType(type)
    const { length } = sourceImg.filters
    let item, i

    for (i = 0; i < length; i += 1) {
      item = sourceImg.filters[i]
      if (item.type === fabricType) {
        imgFilter = item
        break
      }
    }
  }

  return imgFilter
}

/**
 * Change filter class name to fabric's, especially capitalizing first letter
 * @param {string} type - Filter type
 * @example
 * 'grayscale' -> 'Grayscale'
 * @returns {string} Fabric filter class name
 */
export const getFabricFilterType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

/**
 * @description: 根据json模板下载字体文件
 * @param {String} str
 * @return {Promise}
 */
export function downFontByJSON(str: any) {
  const objectFamilys = str.objects
    .filter((item: any) => {
      // 为text
      return item.type.includes('text')
    })
    .map((item: any) => item.fontFamily)
  // fontsList
  const fontFamilys = intersectionWith(
    objectFamilys,
    fontsList.map((i) => i.name),
    isEqual
  )
  const fontFamilysAll = fontFamilys.map((fontName: string) => {
    const font = new FontFaceObserver(fontName)
    return font.load(null, 150000)
  })
  return Promise.all(fontFamilysAll)
}
