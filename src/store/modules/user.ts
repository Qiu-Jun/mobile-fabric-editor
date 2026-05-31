import { defineStore } from 'pinia'

interface UserInfo {
  [key: string]: unknown
}

interface UserState {
  userInfo: UserInfo | null
  token: string
}

const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => {
    return {
      userInfo: null,
      token: ''
    }
  },
  actions: {
    setUserInfo(userInfo: UserInfo | null) {
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
