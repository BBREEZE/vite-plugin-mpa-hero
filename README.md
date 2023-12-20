# vite-plugin-mpa-hero
vite多页面构建插件，基于文件目录，可按规则输出打包文件。

## 已有功能

* [x] 基于文件树打包

* [x] 可配置多目录

* [x] 支持输出目录配置

* [x] dev环境存在默认页_index，可查看所有打包页面

* [x] 可配置html模板

* [x] html模板就近选择

* [x] 支持react

* [ ] 支持vue

* [ ] 支持原生js


## 快速使用

``` npm i vite-plugin-mpa-hero -D ```

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

## 注意事项

1. 请至少在根目录存在`[templateName].html`
2. 请在`[templateName].html`包含`id`为`root`的节点，打包后的内容会挂载在此节点
3. 请严格按照配置项填写

## 案例

假设目录结构：
```
vite-template/
├── src/
│   ├── merchants/
│   │   ├── index.html
│   │   ├── shopList/
│   │   │   ├── component/
│   │   │   │   └── list.tsx
│   │   │   ├── index.tsx
│   │   │   └── index.html
│   │   └── merchantList/
│   │       └── index.tsx
│   ├── marketing/
│   │   ├── index.tsx
│   │   └── rate/
│   │       ├── index.tsx
│   │       ├── first/
│   │       │   └── index.tsx
│   │       └── second/
│   │           └── index.tsx
│   └── index.html
├── test/
│   ├── merchants/
│   │   ├── index.html
│   │   └── shopList/
│   │       └── index.tsx
│   └── index.html
├── index.html 
└── vite.config.ts
```
vite.config.ts的配置如下
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mpaHeroPlugin from 'vite-plugin-mpa-hero'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mpaHeroPlugin({
    scanFileDir: ['./src'],
    scanFileName: 'index.tsx',
    templateName: 'index',
  })]
})

```

打包结果应该是
```
dist/
└── merchants/
    ├── shopList/
    │   └── index.html
    ├── merchantList/
    │   └── index.html
    └── marketing/
        ├── index.html
        └── rate/
            ├── index.html
            ├── first/
            │   └── index.html
            └── second/
                └── index.html
```


## Plugin Options

```javascript
export type MPAHeroPluginOption = {
  /**
   * 模板html的文件名称，会自动向上取
   * 假设当前目录不存在`[templateName].html`则查找父目录，直到根目录,根目录必须存在
   * @default 'template'
   */
  templateName?: string;
  /**
   * 要扫描的文件夹
   * 输出目录会从当前传递目录下一级开始
   * @default ['./src/pages/']
   */
  scanFileDir?: string[];
  /**
   * 入口文件名,需要扫描获取作为入口的文件名
   * @default 'main.js'
   */
  scanFileName?: string;
  /**
   * 输出前置目录
   * 比如初始打包后为`a/b/c.html`,配置`custom`则变为`custom/a/b/c.html`
   * @default '.'
   */
  outputFileDir?: string;
  /**
   * 使用的框架
   * @description 选择对应的框架或者自己编写挂载的入口
   * @default 'react18'
   */
  framework?: 'vue2' | 'vue3' | 'react16' | 'react18' | 'esm' | 'direct';
};
```

### MPAHeroPluginOption.framework

#### esm
使用`esm`模式时需要导出一个默认方法。例如：
```javascript
export default () => document.getElementById('root').innerHTML = 'tests/o2o/index/index.js'
```

#### direct
使用`direct`模式时需自行设置`#root`内容。例如：
```javascript
document.getElementById('root').innerHTML = 'tests/o2o/index/index.js'
```


## 关于

这个插件是因相关需求而开发的，第一次进行Vite插件开发，如有问题请大佬提出issue，如有新功能需要支持也可以提issue，我会尽力而为。
以下是在开发过程中参考的相关功能优秀插件的源码！
* [vite-plugin-auto-mpa-html](https://github.com/iamspark1e/vite-plugin-auto-mpa-html)
