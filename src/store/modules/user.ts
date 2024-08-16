import { defineStore } from 'pinia'

const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      userInfo: null,
      token: ''
    }
  },
  actions: {
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo
    },
    setToken(token: string) {
      this.token = token
    },
    resetUser() {
      this.userInfo = null
      this.token = ''
    }
  }
})

export default useUserStore
