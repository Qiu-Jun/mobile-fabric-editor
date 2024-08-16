export interface IRes<T = any> {
  code: number
  message: string
  data: T
  [key: string]: any
}

export interface Irequest extends UniApp.RequestOptions {
  url: string
  showLoading?: boolean
  header?: any
  data?: any
  [key: string]: any
}
