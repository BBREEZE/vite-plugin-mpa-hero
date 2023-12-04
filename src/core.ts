import path from "path";
import fs from 'fs'
import { MPAHeroPluginOption, MakeRequired } from "./type";

export type Entry = {
  /** id */
  id: string;
  /** 入口的路径 */
  entryPath: string;
  /** 模板文件的路径 */
  templatePath: string;
  /** 虚拟模块的路径 */
  virtualTemplatePath: string;
  /** 虚拟html文件的路径 */
  virtualTemplateFilePath: string;
  /** 是否需要虚拟模块 */
  needVirtualTemplate: boolean;
}


export type EntryList = Entry[]
/**
 * Checks if a file exists in the specified directory.
 *
 * @param {string} fileDir - The directory where the file is located.
 * @param {string} scanFileName - The name of the file to check.
 * @return {boolean} Returns true if the file exists, false otherwise.
 */
export const checkFileExists = (fileDir: string, scanFileName: string) => {
  const file = path.join(process.cwd(), fileDir, scanFileName);
  return fs.existsSync(file)
}

// 递归获取所有文件
export const getAllFile = (dir: string) => {
  
  let results: string[] = [];
  const list = fs.readdirSync(path.resolve(process.cwd(), dir));
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFile(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

// 筛选列表存在某些文件
export const filterList = (list: string[], fileName: string[]) => {
  return list.filter((item) => {
    return fileName.some((name) => item.indexOf(name) !== -1);
  })
}

// 获取最近的模板
export const getNearestTemplate = (templateList: string[], searchName: string, defaultName: string) => {
  let currentDirectory = searchName
  let parentDirectory = searchName.replace(/\/[^/]*$/, '')
  while(parentDirectory !== currentDirectory){
    if(templateList.includes(currentDirectory)){
      return currentDirectory
    }
    currentDirectory = parentDirectory
    parentDirectory = parentDirectory.replace(/\/[^/]*$/, '')
  }
  return defaultName
}

export const getEntryList = (scanFileDir: string[], scanFileName: string, templateName: string) => {
  const entryList: EntryList = [];
  // 获取目录下所有文件
  const fileList: string[] = []
  scanFileDir.forEach((item)=>{
    fileList.push(...getAllFile(item))
  })
  
  // 筛选后的所有文件
  const filteredList = filterList(fileList, [scanFileName, templateName+'.html'])
  const entryMap = new Map()
  const templateDirectoryList: string[] = []
  filteredList.forEach((item) => {
    const id = item.replace(/\.\w+$/, '')
    const isTemplate = item.indexOf('html') !== -1
    if(isTemplate){
      let templateNameTemp = item.replace(`${templateName}.html`, '')
      
      if(templateNameTemp.endsWith('/')){
        templateNameTemp = templateNameTemp.slice(0, -1)
      }
      templateDirectoryList.push(templateNameTemp)
    }else {
      entryMap.set(id, {
        id,
        entryPath: item,
        templatePath: `${templateName}.html`
      })
    }
  })
  // 生成entry
  entryMap.forEach((item)=>{
    const idParentDir = item.id.replace(/\/\w+$/, '')
    
    const nearestTemplatePath = getNearestTemplate(templateDirectoryList, idParentDir, '.')
    entryList.push({
      id: item.id,
      entryPath: item.entryPath,
      templatePath: nearestTemplatePath,
      needVirtualTemplate: idParentDir !== nearestTemplatePath,
      virtualTemplatePath: idParentDir,
      virtualTemplateFilePath: '.'
    })
  })
  return entryList
}

export const genInputConfig = ({
  scanFileDir,
  scanFileName,
  outputFileDir,
  enableParentFileName,
  templateName,
}: MakeRequired<MPAHeroPluginOption>) => {
  console.log({
    scanFileDir,
    scanFileName,
    outputFileDir,
    enableParentFileName,
    templateName,
  });
  const entryList = getEntryList(scanFileDir, scanFileName, templateName)
  const inputConfig: Record<string, string> = {}
  entryList.forEach((item)=>{
    const tempPath = path.resolve(item.virtualTemplatePath, `${templateName}.html`)
    item.virtualTemplateFilePath = tempPath
    let id = item.id.replace(/\//, '-')
    while (id.indexOf('/') !== -1) {
      id = id.replace(/\//, '-')
    }
    inputConfig[id] = tempPath
  })
  // console.log('entryList', entryList);
  // console.log('inputConfig', inputConfig);
  
  return {inputConfig, entryList}
};

