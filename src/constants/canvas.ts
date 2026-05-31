/** 控件图标尺寸 */
export const CONTROL_SIZE = {
  /** 竖向中间控件 */
  VERTICAL_WIDTH: 20,
  VERTICAL_HEIGHT: 25,
  /** 横向中间控件 */
  HORIZONTAL_WIDTH: 25,
  HORIZONTAL_HEIGHT: 20,
  /** 四角控件 */
  CORNER_SIZE: 25,
  /** 旋转控件 */
  ROTATE_SIZE: 40,
  /** 删除控件 */
  DELETE_SIZE: 20
} as const

/** 对齐辅助线参数 */
export const ALIGNING = {
  LINE_OFFSET: 5,
  LINE_MARGIN: 4,
  LINE_WIDTH: 1,
  LINE_COLOR: 'rgb(0,255,0)'
} as const

/** 工作区参数 */
export const WORKSPACE = {
  DEFAULT_ZOOM_RATIO: 0.85,
  DEFAULT_ASPECT_RATIO: 1.4
} as const
