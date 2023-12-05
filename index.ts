/* eslint-disable @typescript-eslint/no-unused-vars */
import path, { resolve } from 'path';
import fs from 'fs'
import { ColoringConsole } from './src/coloring-console';
import { Plugin, ResolvedConfig, UserConfig } from 'vite';
import { defaultPluginOption } from './src/default';
import {Entry, MPAHeroPluginOption} from './src/type'
import {genInputConfig} from './src/core'
import {reactMiddleTemplate} from './src/template/middleTemplate'

function mpaHeroPlugin(pluginOption?: MPAHeroPluginOption): Plugin {
  // 合并默认配置
  const mergedPluginOption = {
    ...defaultPluginOption,
    ...pluginOption,
  };
  // 生成input，并且获取entry
  const {inputConfig, entryList} = genInputConfig({
    scanFileDir: mergedPluginOption.scanFileDir,
    scanFileName: mergedPluginOption.scanFileName,
    outputFileDir: mergedPluginOption.outputFileDir,
    templateName: mergedPluginOption.templateName,
    enableDevDirectory: mergedPluginOption.enableDevDirectory
  })
  // 获取所有的虚拟模块 entry.needVirtualTemplate
  const resolvedVirtualModuleIdMap: Map<string, Entry> = new Map()
  const middleTemplateIdList: string[] = []

  return {
    name: 'vite:mpa-hero-plugin',
    enforce: 'pre',
    resolveId: (id) => {
      // 存储需要解析的模块
      for(let item of entryList){
        if(item.virtualTemplateFilePath === id){
          resolvedVirtualModuleIdMap.set(id, item)
          return id
        }
      }
      // 记录需要处理的id
      if(id.endsWith(mergedPluginOption.scanFileName) && id.startsWith('/mpa-hero/')){
        middleTemplateIdList.push(id)
        return id
      }

    },
    load(id) {
      // 生成虚拟HTML模板
      if(resolvedVirtualModuleIdMap.has(id)){
        const entry = resolvedVirtualModuleIdMap.get(id)
        let template = ''
        const templatePath = entry?.templatePath || ''
        // 读取获取到的模板文件
        const templateContent = fs.readFileSync(path.resolve(templatePath, `${mergedPluginOption.templateName}.html`), 'utf-8')
        template = templateContent.replace('</body>', `<script type="module" src="/mpa-hero/${entry?.entryPath}"></script></body>`)

        return template 
      }
      // 生成对应的中间模板
      if(middleTemplateIdList.includes(id)){
        const middleTemplatePath = id.replace('/mpa-hero', '')
        return reactMiddleTemplate(middleTemplatePath)
      }
    },
    config(config, { command }) {
      // 处理 rollupOptions.input原始值,转换成object
      const inputSourceConfig = config.build?.rollupOptions?.input || {}
      let inputFinalConfig = {}
      if(typeof inputSourceConfig === 'string'){
        inputFinalConfig = {
          // TODO: 修改默认input
        }
      }else if(Array.isArray(inputSourceConfig)){
        inputFinalConfig = {
          // TODO: 修改默认input
        }
      }else if(typeof inputSourceConfig === 'object'){
        inputFinalConfig = {
          // TODO: 修改默认input
        }
      }
      Object.entries(inputConfig).forEach(([key, value]) => {
        inputFinalConfig[key] = resolve(__dirname, value)
      })
      
      if (command === 'build') {
        // 在这里修改 build 配置
        config.build = {
          ...config.build,
          rollupOptions: {
            ...config.build?.rollupOptions,
            input: {
              ...inputFinalConfig
            },
          }
        };
      }
    },
  };
}

export default mpaHeroPlugin;
