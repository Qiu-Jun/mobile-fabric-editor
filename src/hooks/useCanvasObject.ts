import { useEditorStore } from '@/store'

export type CanvasAttrType =
  | 'fill'
  | 'fontStyle'
  | 'fontWeight'
  | 'opacity'
  | 'fontSize'
  | 'underline'
  | 'fontFamily'
  | 'stroke'
  | 'strokeWidth'
  | 'imgUrl'

export function useCanvasObject() {
  const editorStore = useEditorStore()
  const activeObj = computed(() => editorStore.canvas?.getActiveObject())

  const updateAttr = (type: CanvasAttrType, val: unknown) => {
    const obj = unref(activeObj)
    if (!obj) return
    obj.set({ [type]: val })
    editorStore.canvas?.renderAll()
  }

  return { activeObj, updateAttr }
}
