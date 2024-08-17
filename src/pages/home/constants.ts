/*
 * @Author: June
 * @Description:
 * @Date: 2024-08-14 23:03:07
 * @LastEditTime: 2024-08-17 12:06:31
 * @LastEditors: June
 * @FilePath: \mobile-fabric-editor\src\pages\home\constants.ts
 */
import oneIcon from '@/static/images/ex.png'
import twoIcon from '@/static/images/text.png'
import threeIcon from '@/static/images/ic.png'
import fourIcon from '@/static/images/add.png'
import font1 from '@/static/font/华康金刚黑.ttf'
import font2 from '@/static/font/汉体.ttf'
import font3 from '@/static/font/造字工房云川体.ttf'
import font4 from '@/static/font/锐字潮牌真言.ttf'

export const bottomList = [
  { icon: oneIcon, name: '换模板' },
  { icon: twoIcon, name: '换文字' },
  { icon: threeIcon, name: '换图片' },
  { icon: fourIcon, name: '添加' }
]

export const colors = [
  'transparent',
  '#000',
  '#fff',
  '#F12',
  '#06c',
  '#27d',
  '#35a',
  '#D22',
  '#ea4',
  '#bf4',
  '#ac9',
  '#de2',
  '#d99',
  '#b2b',
  '#c4c',
  '#a1a',
  '#d9d',
  '#efe',
  '#bbb',
  '#ccc',
  '#abc'
]
// 字体
export const fontsList = [
  {
    name: '华康金刚黑',
    file: font1
  },
  {
    name: '汉体',
    file: font2
  },
  {
    name: '造字工房云川体',
    file: font3
  },
  {
    name: '锐字潮牌真言',
    file: font4
  }
]

// 滤镜
export const fitterList = [
  { name: '模糊', key: 'blur', type: 'Blur' },
  { name: '灰度', key: 'grayscale', type: 'Grayscale' },
  { name: '亮度', key: 'brightness', type: 'Brightness' },
  { name: '对比度', key: 'contrast', type: 'Contrast' },
  { name: '饱和度', key: 'saturation', type: 'Saturation' }
]

export interface CommonCanvasChildrenType {
  show: boolean
  canvasRef: any
  onClose: () => void
}
