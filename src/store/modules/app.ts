import { defineStore } from 'pinia'

const useAppStore = defineStore({
  id: 'app', // id必填，且需要唯一
  state: () => {
    return {
      systemInfo: null
    }
  },
  actions: {
    setSystemInfo(data: any) {
      this.systemInfo = data
    }
  }
})

export default useAppStore
