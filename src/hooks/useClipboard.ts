import { useEditorStore } from '@/store'

export function useClipboard() {
  const editorStore = useEditorStore()

  const paste = (_clipboard: fabric.Object) => {
    _clipboard.clone(function (clonedObj: fabric.Object) {
      editorStore.canvas?.discardActiveObject()
      clonedObj.set({
        left: (clonedObj as any).left + 20,
        top: (clonedObj as any).top + 20,
        evented: true
      })
      if ((clonedObj as any).type === 'activeSelection') {
        ;(clonedObj as any).canvas = editorStore.canvas
        ;(clonedObj as any).forEachObject(function (obj: fabric.Object) {
          editorStore.canvas?.add(obj)
        })
        ;(clonedObj as any).setCoords()
      } else {
        editorStore.canvas?.add(clonedObj)
      }
      ;(_clipboard as any).top += 20
      ;(_clipboard as any).left += 20
      editorStore.canvas?.setActiveObject(clonedObj)
    })
  }

  return { paste }
}
