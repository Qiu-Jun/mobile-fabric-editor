/*
 * @Author: June
 * @Description:
 * @Date: 2024-08-17 19:18:03
 * @LastEditTime: 2024-08-17 20:00:11
 * @LastEditors: June
 * @FilePath: \mine-pro\packages\editor\src\main.ts
 */
import { createSSRApp } from 'vue'
import App from './App.vue'
import setupStore from './store'
import SvgIcon from './components/SvgIcon'
import 'virtual:uno.css'
import 'virtual:svg-icons-register'

// 修复 Fabric.js 5.4.0 的 CanvasTextBaseline bug
// Fabric.js 错误地使用了 'alphabetical'，正确的 Canvas API 值应为 'alphabetic'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const origTextBaseline = Object.getOwnPropertyDescriptor(
  CanvasRenderingContext2D.prototype,
  'textBaseline'
)
if (origTextBaseline && origTextBaseline.set) {
  Object.defineProperty(CanvasRenderingContext2D.prototype, 'textBaseline', {
    ...origTextBaseline,
    set(value: string) {
      origTextBaseline.set!.call(
        this,
        value === 'alphabetical' ? 'alphabetic' : value
      )
    }
  })
}

export function createApp() {
  const app = createSSRApp(App)
  app.component('SvgIcon', SvgIcon)
  setupStore(app)
  return {
    app
  }
}
