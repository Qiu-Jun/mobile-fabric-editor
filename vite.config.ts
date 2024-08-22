/*
 * @Author: June
 * @Description:
 * @Date: 2024-08-14 22:12:49
 * @LastEditTime: 2024-08-23 01:13:56
 * @LastEditors: June
 * @FilePath: \mobile-fabric-editor\vite.config.ts
 */
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
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
    Unocss(),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/assets/svgs')], // icon存放的目录
      symbolId: 'icon-[name]', // symbol的id
      inject: 'body-last', // 插入的位置
      customDomId: '__svg__icons__dom__' // svg的id
    })
  ],
  server: {
    port: 8080
  },
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
