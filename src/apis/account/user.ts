import { request } from '@/lib/service'

// 获取用户资料
export function getUserData() {
  return request({
    url: '/consumer/account/profile'
  })
}

// 更新用户资料
export function updateUserData(data: any) {
  return request({
    url: '/consumer/account/updateProfile',
    method: 'POST',
    data
  })
}
