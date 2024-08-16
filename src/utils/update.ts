export function updateMpWx() {
  if (uni.canIUse('getUpdateManager')) {
    const updateManager = uni.getUpdateManager()
    // 请求完新版本信息的回调
    updateManager.onCheckForUpdate((res) => {
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(() => {
      uni.showModal({
        title: '是否更新',
        content: '新版本已经准备好，是否重启应用？',
        success: (res: any) => {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
    // updateManager.applyUpdate()
    updateManager.onUpdateFailed(() => {
      uni.showToast({
        title: '更新失败,请检查您的网络是否正常',
        icon: 'none'
      })
    })
  }
}
