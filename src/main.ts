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

export function createApp() {
  const app = createSSRApp(App)
  app.component('SvgIcon', SvgIcon)
  setupStore(app)
  return {
    app
  }
}
