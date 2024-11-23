/*
 * @Author: June
 * @Description:
 * @Date: 2024-08-22 18:18:34
 * @LastEditTime: 2024-11-23 08:24:46
 * @LastEditors: June
 * @FilePath: \mobile-fabric-editor\src\store\modules\editor.ts
 */
import { defineStore } from 'pinia'

const useEditorStore: any = defineStore({
  id: 'editor', // id必填，且需要唯一
  state: () => {
    return {
      currentFont: '',
      canvas: null,
      editor: null
    }
  },
  actions: {
    setCanvas(canvas: any) {
      this.canvas = canvas
    },
    setEditor(editor: any) {
      this.editor = editor
    },
    setCurrentFont(font: string) {
      this.currentFont = font
    }
  }
})

export default useEditorStore

export function useEditorStoreSide() {
  return useEditorStore()
}
