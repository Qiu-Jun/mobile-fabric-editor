/*
 * @Author: June
 * @Description:
 * @Date: 2024-08-22 18:18:34
 * @LastEditTime: 2024-11-23 08:24:46
 * @LastEditors: June
 * @FilePath: \mobile-fabric-editor\src\store\modules\editor.ts
 */
import { defineStore } from 'pinia'
import type { Editor } from '@/core/editor'

interface EditorState {
  currentFont: string
  canvas: fabric.Canvas | null
  editor: Editor | null
}

const useEditorStore = defineStore({
  id: 'editor', // id必填，且需要唯一
  state: (): EditorState => {
    return {
      currentFont: '',
      canvas: null,
      editor: null
    }
  },
  actions: {
    setCanvas(canvas: fabric.Canvas | null) {
      this.canvas = canvas
    },
    setEditor(editor: Editor | null) {
      this.editor = editor
    },
    setCurrentFont(font: string) {
      this.currentFont = font
    }
  }
})

export default useEditorStore
