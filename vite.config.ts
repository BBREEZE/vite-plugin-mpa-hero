import { defineConfig } from 'vite'
import mpaHeroPlugin from './index'
import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [Inspect(),react(),
    mpaHeroPlugin({
      scanFileDir: ['./tests'],
      scanFileName: 'index.js',
      templateName: 'index',
      outputFileDir: 'wjl',
      framework: 'direct'
    })
  ],
  // build: {
  //   rollupOptions: {
  //     input: {
  //       'mainxxx': 'index.html'
  //     }
  //   }
  // }
})
