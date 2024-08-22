/*
 * @Author: June
 * @Description:
 * @Date: 2024-08-18 01:50:52
 * @LastEditTime: 2024-08-23 02:48:07
 * @LastEditors: June
 * @FilePath: \mobile-fabric-editor\src\core\editor.ts
 */
import { fabric } from 'fabric'
import initControls from '@/core/initControls'
import initAligningGuidelines from '@/core/initAligningGuidelines'
import { Workspace } from '@/core/Workspace'
import { fontsList } from '@/constants/editor'
import { createFontCSS } from './utils/font'
import { useEditorStoreSide } from '@/store/modules/editor'

// interface ICanvas extends fabric.Canvas {
//   selectionColor?: string
//   selectionBorderColor?: string
//   selectionLineWidth?: number
// }

const editorStore = useEditorStoreSide()

export class Editor {
  public canvas: any = null
  public workspacePlugin: any = null
  private workspaceEl: HTMLElement | null = null
  constructor() {
    this.init()
  }

  init() {
    this.workspaceEl = document.getElementById('workspace') as HTMLElement
    if (!this.workspaceEl) {
      throw new Error('element #workspace is missing, plz check!')
    }
    const canvasEl = document.createElement('canvas')
    canvasEl.setAttribute('id', 'editor')
    this.workspaceEl.appendChild(canvasEl)
    this.canvas = new fabric.Canvas('editor', {
      preserveObjectStacking: true, // 禁止被选中的元素跑到视图的最顶层，保留原层级
      selection: false,
      includeDefaultValues: false, // 精简json
      controlsAboveOverlay: true // 超出clipPath后仍然展示控制条
    })
    if (this.canvas) {
      editorStore.setCanvas(this.canvas)
      // 选择器样式
      initControls(this.canvas)
      // 辅助线
      initAligningGuidelines(this.canvas)
      this.workspacePlugin = new Workspace(this.canvas, this.workspaceEl)
      // 初始化字体
      createFontCSS(fontsList)
    }
  }

  getWorkspace() {
    return this.canvas
      .getObjects()
      .find((item: any) => item.id === 'workspace') as fabric.Rect
  }

  destroy() {
    this.canvas = null
    this.workspacePlugin.destroy()
    this.workspaceEl = null
    editorStore.setCanvas(null)
    editorStore.setEditor(null)
  }
}
