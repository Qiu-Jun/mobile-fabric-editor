import { fabric } from 'fabric'
import { ElementNames } from '@/enums'
import { guid } from '@/utils/tools'
import type { LinePoint } from '@/constants/lines'

export type { LinePoint }

export function useHandleCreate() {
  const createLineElement = (
    path: any[],
    startStyle: LinePoint,
    endStyle: LinePoint,
    strokeDashArray?: [number, number]
  ) => {
    return new fabric.Polyline(path, {
      // @ts-ignore
      id: guid(),
      left: 10,
      top: 10,
      strokeWidth: 4,
      stroke: '#333',
      fill: '',
      scaleX: 1,
      scaleY: 1,
      originX: 'left',
      originY: 'top',
      startStyle,
      endStyle,
      hasBorders: true,
      objectCaching: false,
      transparentCorners: false,
      strokeDashArray,
      name: ElementNames.LINE
    })
  }

  return {
    createLineElement
  }
}
