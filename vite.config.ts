/*
 * @Author: June
 * @Description:
 * @Date: 2024-08-14 22:12:49
 * @LastEditTime: 2024-08-21 14:15:57
 * @LastEditors: June
 * @FilePath: \mobile-fabric-editor\vite.config.ts
 */
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'

export default defineConfig({
  base: './',
  plugins: [
    AutoImport({
      imports: ['vue', 'uni-app'],
      dts: './src/dts/auto-imports.d.ts',
      eslintrc: {
        enabled: true
      }
    }),
    uni(),
    Unocss()
  ],
  resolve: {
    alias: {
      '@': `${resolve(__dirname)}/`
    }
  },
  build: {
    // uno报错处理
    watch: {
      exclude: ['node_modules/**', '/__uno.css']
    }
  }
})
