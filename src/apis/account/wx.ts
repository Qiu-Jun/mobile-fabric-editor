import { request } from '@/lib/service'

// 微信小程序授权登录
export function wxAuth() {
  return request({
    url: '/consumer/auth/oauth/weapp/login'
  })
}

// 微信小程序绑定手机号码
export function wxBindMobile() {
  return request({
    url: '/consumer/auth/oauth/weapp/login'
  })
}
