# vite-plugin-mpa-hero
vite多页面构建插件，基于文件目录，可按规则输出打包文件。

## 已有功能

 基于文件树打包

:white_check_mark: 可配置多目录

:white_check_mark: 支持输出目录配置

:white_check_mark: 可配置html模板

:white_check_mark: html模板就近选择

:white_check_mark: 支持react

:ballot_box_with_check: 支持vue

:ballot_box_with_check: 支持原生js


## 快速使用

`npm i vite-plugin-mpa-hero -D`

安装插件后，在`vite.config.[jt]s`里配置插件

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mpaHeroPlugin from 'vite-plugin-mpa-hero'

export default defineConfig({
  plugins: [react(), mpaHeroPlugin({
    scanFileDir: ['./src'],
    scanFileName: 'index.tsx',
    templateName: 'index',
  })]
})
```

## Plugin Options

```javascript
{
  /**
   * 模板html的文件名称，会自动向上取
   * 假设当前目录不存在`[templateName].html`则查找父目录，直到根目录,根目录必须存在
   * @default 'template'
   */
  templateName?: string
  /**
   * 要扫描的文件夹
   * 输出目录会从当前传递目录下一级开始
   * @default ['/src/pages/']
   */
  scanFileDir?: string[]
  /**
   * 入口文件名,需要扫描获取作为入口的文件名
   * @default 'index.js'
   */
  scanFileName?: string
  /**
   * 输出前置目录
   * 比如初始打包后为`/a/b/c.html`,配置`/custom/`则变为`/custom/a/b/c.html`
   * @default '/'
   */
  outputFileDir?: string
}
```

## 关于

这个插件是因相关需求而开发的，第一次进行Vite插件开发，如有问题请大佬提出issue，如有新功能需要支持也可以提issue，我会尽力而为。
以下是在开发过程中参考的相关功能优秀插件的源码！
* [vite-plugin-auto-mpa-html](https://github.com/iamspark1e/vite-plugin-auto-mpa-html)
