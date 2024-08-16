import { mergeOps } from './helper/utils'
import errTips from '@/constants/httpErrCode'
import { clearStorage } from '../storage'
import type { Irequest } from './types'

export default function request(options: Irequest) {
  const config = mergeOps(options) as Irequest
  return new Promise((resolve, reject) => {
    if (config.showLoading) {
      uni.showLoading({
        title: '加载中...',
        mask: true
      })
    }
    uni.request({
      ...config,
      success: (res) => {
        const { statusCode, data: resData } = res
        if (statusCode === 200) {
          const { data, code, message } = resData as any
          if (code === 10000) {
            resolve({ data, code, message })
          } else {
            uni.showToast({
              icon: 'none',
              title: message
            })
            reject({ code, message, data: null })
          }
        } else if (statusCode === 401) {
          const pages = getCurrentPages()
          const curPages = pages[pages.length - 1]
          if (curPages && curPages.route === 'pages/login/index') return false
          clearStorage()
        } else {
          uni.showToast({
            icon: 'none',
            title: errTips[statusCode] || '请求失败'
          })
        }
      },
      fail: (err) => {
        console.log(err)
        uni.showToast({
          icon: 'none',
          title: '请求失败，请检查您的网络是否正常'
        })
      },
      complete: () => {
        config.showLoading && uni.hideLoading()
      }
    })
  })
}
