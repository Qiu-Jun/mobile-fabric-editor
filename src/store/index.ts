import { createPinia } from 'pinia'
import type { App } from 'vue'

const store = createPinia()
const setupStore = (app: App<Element>) => app.use(store)

export { default as useUserStore } from './modules/user'
export { default as useAppStore } from './modules/app'
export { default as useEditorStore } from './modules/editor'

export default setupStore
