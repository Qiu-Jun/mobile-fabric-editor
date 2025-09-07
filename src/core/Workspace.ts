/*
 * @Author: June
 * @Description:
 * @Date: 2024-08-20 01:55:39
 * @LastEditTime: 2024-08-22 18:29:39
 * @LastEditors: June
 * @FilePath: \mobile-fabric-editor\src\core\Workspace.ts
 */
import { fabric } from 'fabric'
import { useAppStoreSide } from '@/store/modules/app'

const appStore = useAppStoreSide()

export interface IWorkspaceSize {
  width: number
  height: number
}

export class Workspace {
  private workspace: fabric.Rect | null = null
  public workspaceEl: HTMLElement | null = null
  private canvas: fabric.Canvas | null = null
  private workspaceSize: IWorkspaceSize = {
    width: 400,
    height: 300
  }
  zoomRatio: number
  constructor(ctx: fabric.Canvas, workspaceEl: HTMLElement) {
    this.workspaceEl = workspaceEl
    this.canvas = ctx
    const infoSys = appStore.systemInfo as unknown as UniApp.SystemInfo
    const { windowWidth } = infoSys
    this.zoomRatio = 0.85
    this.workspaceSize = {
      width: windowWidth * this.zoomRatio,
      height: windowWidth * 1.4
    }

    this.initBackground()
    this.initWorkspace()
  }

  initBackground() {
    const canvas = this.canvas
    if (!canvas) return
    canvas.setBackgroundColor('#fff', canvas.renderAll.bind(canvas))
    canvas.setWidth(this.workspaceEl!.offsetWidth)
    canvas.setHeight(this.workspaceEl!.offsetHeight)
  }

  initWorkspace() {
    if (!this.canvas) return
    const { width, height } = this.workspaceSize
    const workspace = new fabric.Rect({
      fill: 'transparent',
      width,
      height,
      // @ts-ignore
      id: 'workspace',
      strokeWidth: 0
    })
    workspace.set('selectable', false)
    workspace.set('hasControls', false)
    workspace.hoverCursor = 'default'
    this.canvas.add(workspace)
    this.canvas.renderAll()
    this.workspace = workspace
    this.setZoomAuto(1)
  }

  getSize() {
    return this.workspaceSize
  }

  setZoomAuto(scale: number, cb?: (left?: number, top?: number) => void) {
    const canvas = this.canvas
    const workspace = this.workspace
    if (!canvas) return
    const center = canvas.getCenter()
    canvas.setViewportTransform(fabric.iMatrix.concat())
    canvas.zoomToPoint(new fabric.Point(center.left, center.top), scale)
    if (!workspace) return
    this.setCenterFromObject(workspace, canvas)

    // 超出画布不展示
    workspace.clone((cloned: fabric.Rect) => {
      // @ts-ignore
      cloned.id = 'workspace'
      canvas.clipPath = cloned
      canvas.requestRenderAll()
    })
    if (cb) cb(workspace.left, workspace.top)
  }

  /**
   * 设置画布中心到指定对象中心点上
   * @param {Object} obj 指定的对象
   */
  setCenterFromObject(obj: fabric.Rect, canvas: fabric.Canvas) {
    const objCenter = obj.getCenterPoint()
    const viewportTransform = canvas.viewportTransform
    if (
      canvas.width === undefined ||
      canvas.height === undefined ||
      !viewportTransform
    )
      return
    viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0]
    viewportTransform[5] =
      canvas.height / 2 - objCenter.y * viewportTransform[3]
    canvas.setViewportTransform(viewportTransform)
    canvas.renderAll()
  }

  setSize(width: number, height: number) {
    const canvas = this.canvas!
    this.initBackground()
    this.workspaceSize.width = width
    this.workspaceSize.height = height
    // 重新设置workspace
    this.workspace = canvas
      .getObjects()
      .find((item: any) => item.id === 'workspace') as fabric.Rect
    this.workspace.set('width', width)
    this.workspace.set('height', height)
    this.auto()
  }

  getScale() {
    if (!this.workspaceEl)
      return {
        width: 0,
        height: 0
      }
    // @ts-ignore
    return fabric.util.findScaleToFit(this.workspace, {
      width: this.workspaceEl.offsetWidth,
      height: this.workspaceEl.offsetHeight
    })
  }

  // 1:1 放大
  one() {
    this.setZoomAuto(1 * this.zoomRatio)
    this.canvas!.requestRenderAll()
  }

  // 放大
  big() {
    let zoomRatio = this.canvas?.getZoom() ?? 0
    zoomRatio += 0.05
    const center = this.canvas?.getCenter()
    if (!center) return
    this.canvas?.zoomToPoint(
      new fabric.Point(center.left, center.top),
      zoomRatio
    )
  }

  // 缩小
  small() {
    let zoomRatio = this.canvas?.getZoom() ?? 0
    zoomRatio -= 0.05
    const center = this.canvas?.getCenter()
    if (!center) return
    this.canvas?.zoomToPoint(
      new fabric.Point(center.left, center.top),
      zoomRatio < 0 ? 0.01 : zoomRatio
    )
  }

  // 自动缩放
  auto() {
    const scale = this.getScale()
    this.setZoomAuto(scale * this.zoomRatio)
  }

  // 重新设置workspace
  resetWorkspace() {
    const canvas = this.canvas
    if (!canvas) return
    this.workspace = canvas
      .getObjects()
      .find((item: any) => item.id === 'workspace') as fabric.Rect
    if (this.workspace) {
      this.workspaceSize.width = this.workspace.width as number
      this.workspaceSize.height = this.workspace.height as number
      this.workspace.set('width', this.workspace.width)
      this.workspace.set('height', this.workspace.height)
    }
    this.setZoomAuto(1)
  }

  destroy() {
    this.canvas = null
    this.workspace = null
    this.workspaceEl = null
  }
}
