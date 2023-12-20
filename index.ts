import path, { resolve } from 'path';
import fs from 'fs';
import { Plugin } from 'vite';
import { defaultPluginOption } from './src/default';
import { Entry, MPAHeroPluginOption } from './src/type';
import { genHTMLTemplate, genInputConfig } from './src/core';
import { customMiddleTemplate, directMiddleTemplate, react16MiddleTemplate, reactMiddleTemplate, vue2MiddleTemplate, vue3MiddleTemplate } from './src/template/middleTemplate';
import { devServerMiddleware } from './src/dev-middleware';

function mpaHeroPlugin(pluginOption?: MPAHeroPluginOption): Plugin {
  // 合并默认配置
  const mergedPluginOption = {
    ...defaultPluginOption,
    ...(pluginOption ? pluginOption : {}),
  };
  // 生成input，并且获取entry
  const { inputConfig, entryList } = genInputConfig({
    scanFileDir: mergedPluginOption.scanFileDir,
    scanFileName: mergedPluginOption.scanFileName,
    outputFileDir: mergedPluginOption.outputFileDir,
    templateName: mergedPluginOption.templateName,
    framework: mergedPluginOption.framework,
  });
  // 获取所有的虚拟模块 entry.needVirtualTemplate
  const resolvedVirtualModuleIdMap: Map<string, Entry> = new Map();
  const middleTemplateIdList: string[] = [];

  return {
    name: 'vite:mpa-hero-plugin',
    enforce: 'pre',
    resolveId: id => {
      // 存储需要解析的模块
      for (let item of entryList) {
        if (item.virtualTemplateFilePath === id) {
          resolvedVirtualModuleIdMap.set(id, item);
          return id;
        }
      }
      // 记录需要处理的id（mpa-hero是虚拟html模块请求的前缀）
      if (id.endsWith(mergedPluginOption.scanFileName) && id.startsWith('/mpa-hero/')) {
        middleTemplateIdList.push(id);
        return id;
      }
    },
    load(id) {
      // 生成虚拟HTML模板
      if (resolvedVirtualModuleIdMap.has(id)) {
        const entry = resolvedVirtualModuleIdMap.get(id)!;
        return genHTMLTemplate(mergedPluginOption, entry);
      }
      // 生成对应的中间模板
      if (middleTemplateIdList.includes(id)) {
        const middleTemplatePath = id.replace('/mpa-hero', '');
        switch(mergedPluginOption.framework) {
          case 'react18':
            return reactMiddleTemplate(middleTemplatePath);
          case 'react16':
            return react16MiddleTemplate(middleTemplatePath);
          case 'vue2':
            return vue2MiddleTemplate(middleTemplatePath);
          case 'vue3':
            return vue3MiddleTemplate(middleTemplatePath);
          case 'direct': 
            return directMiddleTemplate(middleTemplatePath);
          case 'esm':
            return customMiddleTemplate(middleTemplatePath);
          default: 
            throw new Error('需要配置正确的framework');
        }
      }
    },
    configureServer(server) {
      server.middlewares.use(devServerMiddleware(entryList, mergedPluginOption, server));
    },
    config(config) {
      // 处理 rollupOptions.input原始值,转换成object
      const inputSourceConfig = config.build?.rollupOptions?.input || {};
      let inputFinalConfig: Record<string, string> = {};
      if (typeof inputSourceConfig === 'string') {
      } else if (Array.isArray(inputSourceConfig)) {
        inputSourceConfig.forEach((item, index) => {
          inputFinalConfig['_sourceConfig' + index] = item;
        });
      } else if (typeof inputSourceConfig === 'object') {
        inputFinalConfig = inputSourceConfig;
      }
      Object.entries(inputConfig).forEach(([key, value]) => {
        inputFinalConfig[key] = resolve('./', value);
      });
      const newConfig = { ...config };
      newConfig.build = {
        ...config.build,
        rollupOptions: {
          ...config.build?.rollupOptions,
          input: {
            ...inputFinalConfig,
          },
        },
      };
      return newConfig;
    },
  };
}

export default mpaHeroPlugin;
