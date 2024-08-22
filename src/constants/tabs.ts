import { TabItem, BgTabItem, ImgTab, TextTab } from '@/enums'

export const HomeTabList = [
  { icon: 'template', name: '换模板', type: TabItem.template },
  { icon: 'text', name: '换文字', type: TabItem.text },
  { icon: 'img', name: '换图片', type: TabItem.image },
  { icon: 'add', name: '添加', type: TabItem.bg }
]

export const BgTabList = [
  { icon: 'bg', name: '背景色', type: BgTabItem.color },
  { icon: 'img', name: '背景图', type: BgTabItem.image },
  { icon: 'clear', name: '清除图片', type: BgTabItem.clear }
]

export const ImageTabList = [
  { icon: 'copy', name: '复制', type: ImgTab.copy },
  { icon: 'editor', name: '换图', type: ImgTab.image },
  { icon: 'filter', name: '滤镜', type: ImgTab.filters },
  { icon: 'layer', name: '图层', type: ImgTab.layer },
  { icon: 'flip', name: '翻转', type: ImgTab.flip },
  { icon: 'opacity', name: '透明度', type: ImgTab.opacity },
  { icon: 'small', name: '微调', type: ImgTab.tuning }
]

export const TextTabList = [
  { icon: 'copy', name: '复制', type: TextTab.copy },
  { icon: 'editor', name: '改字', type: TextTab.text },
  { icon: 'font', name: '字体', type: TextTab.font },
  { icon: 'color', name: '颜色', type: TextTab.color },
  { icon: 'style', name: '样式', type: TextTab.style },
  { icon: 'opacity', name: '透明度', type: TextTab.opacity },
  { icon: 'small', name: '微调', type: TextTab.tuning },
  { icon: 'layer', name: '图层', type: TextTab.layer }
]
