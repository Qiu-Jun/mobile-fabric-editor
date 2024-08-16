import { baseUrl } from '@/constants/app'
import { useUserStore } from '@/store'
import type { Irequest } from '../types'

const userStore = useUserStore()
export function mergeOps(ops: Irequest) {
  if (!ops || !ops.url) return null
  const configs = {
    url: `${baseUrl + ops.url}`,
    header: {
      'content-type': ops.contentType || 'application/x-www-form-urlencoded',
      token: userStore.token || ''
    },
    data: ops.data || null,
    method: ops.method ? ops.method.toUpperCase() : 'GET',
    showLoading: ops.showLoading || false
  }
  ops.header &&
    (configs.header = {
      ...configs.header,
      ...ops.header
    })
  return configs
}
