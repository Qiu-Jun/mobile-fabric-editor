/**
 * @desc 获取存储的本地数据(同步)
 * @param { keyName }
 * @return { storageVal }
 */
export function getStorageSync<T = unknown>(key: string): T | null {
  try {
    const val = uni.getStorageSync(key) || null
    return val ? JSON.parse(val) : null
  } catch {
    return null
  }
}

/**
 * @desc 设置本地存储数据(同步)
 * @param { String } key
 * @param { any } val
 */
export function setStorageSync(key: string, val: unknown) {
  const value = JSON.stringify(val)
  return uni.setStorageSync(key, value)
}

/**
 * @desc 设置本地存储数据(异步))
 * @param { String } key
 * @param { any } val
 */
export function setStorage(key: string, val: unknown) {
  const value = JSON.stringify(val)
  uni.setStorage({
    key,
    data: value,
    fail: (err) => {
      console.error(`存储失败 [${key}]:`, err)
    }
  })
}

/**
 * @desc 移除本地存储数据
 * @param { String } key
 */
export function removeStorageSync(key: string) {
  try {
    return uni.removeStorageSync(key)
  } catch (e) {
    console.error(`移除失败 [${key}]:`, e)
  }
}

// 清空所有缓存 同步
export function clearStorage() {
  return uni.clearStorageSync()
}
