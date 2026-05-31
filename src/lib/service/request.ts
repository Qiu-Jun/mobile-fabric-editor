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
          if (curPages && curPages.route === 'pages/login/index') {
            reject({ code: statusCode, message: 'Unauthorized', data: null })
            return
          }
          clearStorage()
          reject({ code: statusCode, message: 'Unauthorized', data: null })
        } else {
          uni.showToast({
            icon: 'none',
            title: errTips[statusCode] || '请求失败'
          })
          reject({
            code: statusCode,
            message: errTips[statusCode] || '请求失败',
            data: null
          })
        }
      },
      fail: (err) => {
        uni.showToast({
          icon: 'none',
          title: '请求失败，请检查您的网络是否正常'
        })
        reject({ code: -1, message: err.errMsg || '网络请求失败', data: null })
      },
      complete: () => {
        config.showLoading && uni.hideLoading()
      }
    })
  })
}
