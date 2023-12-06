import { defineConfig } from 'vite'
import mpaHeroPlugin from './index'
import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [Inspect(),react(),
    mpaHeroPlugin({
      scanFileDir: ['./tests'],
      scanFileName: 'index.tsx',
      templateName: 'index',
      outputFileDir: 'wjl',
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
