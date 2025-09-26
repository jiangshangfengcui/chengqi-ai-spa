import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // baseUrl: 'http://localhost:3000', // 替换为你的应用地址
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false, // 是否记录视频
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    watchForFileChanges: false,
  },
})
