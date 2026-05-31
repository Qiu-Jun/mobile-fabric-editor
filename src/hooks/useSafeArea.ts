import { isIPhoneX } from '@/utils/tools'

export function useSafeArea() {
  const isX = isIPhoneX()
  return {
    toolbarHeight: isX ? '108px' : '80px',
    toolbarPaddingBottom: isX ? '28px' : '8px',
    workspaceMarginBottom: isX ? '10vh' : '6vh'
  }
}
