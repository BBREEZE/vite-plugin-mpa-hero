/* eslint-disable @typescript-eslint/no-unused-vars */
import path, { resolve } from 'path';
import fs from 'fs'
import { ColoringConsole } from './src/coloring-console';
import { Plugin, ResolvedConfig, UserConfig } from 'vite';
import { defaultPluginOption } from './src/default';
import {MPAHeroPluginOption} from './src/type'
import {Entry, genInputConfig} from './src/core'

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
    enableParentFileName: mergedPluginOption.enableParentFileName,
    templateName: mergedPluginOption.templateName,
    enableDevDirectory: mergedPluginOption.enableDevDirectory
  })
  // 获取所有的虚拟模块 entry.needVirtualTemplate
  const resolvedVirtualModuleIdMap: Map<string, Entry> = new Map()
  const virtualModuleId = 'virtual:mpa-hero'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'vite:mpa-hero-plugin',
    enforce: 'pre',
    resolveId: (id) => {
      // console.log('id', id);
      
      for(let item of entryList){
        if(item.virtualTemplateFilePath === id){
          const temp = id
          resolvedVirtualModuleIdMap.set(temp, item)
          // console.log('temp', temp);
          return temp
        }
      }
    },
    async load(id) {
      
      if(resolvedVirtualModuleIdMap.has(id)){
        const entry = resolvedVirtualModuleIdMap.get(id)
        // console.log('entry', entry);
        let template = ''
        const templatePath = entry?.templatePath || ''
        
        const templateContent = fs.readFileSync(path.resolve(templatePath, `${mergedPluginOption.templateName}.html`), 'utf-8')
        template = templateContent.replace('</body>', `<script type="module" src="/${entry?.entryPath}"></script></body>`)

        // console.log('---templatePath---', template);
        return template 
      }
    },
    config(config, { command }) {
      // 处理 rollupOptions.input原始值,转换成object
      const inputSourceConfig = config.build?.rollupOptions?.input
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
      console.log('inputFinalConfig', inputFinalConfig);
      
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
