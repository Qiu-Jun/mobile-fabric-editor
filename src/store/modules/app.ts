import { defineStore } from 'pinia'

interface AppState {
  systemInfo: UniApp.SystemInfo | null
}

const useAppStore = defineStore({
  id: 'app', // id必填，且需要唯一
  state: (): AppState => {
    return {
      systemInfo: null
    }
  },
  actions: {
    setSystemInfo(data: UniApp.SystemInfo) {
      this.systemInfo = data
    }
  }
})

export default useAppStore
