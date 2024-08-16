import { defineStore } from 'pinia'

const useEditorStore: any = defineStore({
  id: 'editor', // id必填，且需要唯一
  state: () => {
    return {
      currentFont: '',
      canvas: null
    }
  },
  actions: {
    setCanvas(canvas: any) {
      this.canvas = canvas
    },
    setCurrentFont(font: string) {
      this.currentFont = font
    }
  }
})

export default useEditorStore
