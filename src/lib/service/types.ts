export interface IRes<T = unknown> {
  code: number
  message: string
  data: T
}

export interface Irequest extends UniApp.RequestOptions {
  url: string
  showLoading?: boolean
  header?: Record<string, string>
  data?: Record<string, unknown>
  contentType?: string
}
