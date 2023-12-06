import path from 'path';
import fs from 'fs';
import { DirectoryTree, Entry, EntryList, MPAHeroPluginOption, MakeRequired } from './type';

/**
 * Checks if a file exists in the specified directory.
 *
 * @param {string} fileDir - The directory where the file is located.
 * @param {string} scanFileName - The name of the file to check.
 * @return {boolean} Returns true if the file exists, false otherwise.
 */
export const checkFileExists = (fileDir: string, scanFileName: string) => {
  const file = path.join(process.cwd(), fileDir, scanFileName);
  return fs.existsSync(file);
};

// 递归获取所有文件
export const getAllFile = (dir: string) => {
  let results: string[] = [];
  const list = fs.readdirSync(path.resolve(process.cwd(), dir));
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFile(file));
    } else {
      results.push(file);
    }
  });
  return results;
};

// 筛选列表存在某些文件
export const filterList = (list: string[], fileName: string[]) => {
  return list.filter(item => {
    return fileName.some(name => item.indexOf(name) !== -1);
  });
};

// 获取最近的模板
export const getNearestTemplate = (
  templateList: string[],
  searchName: string,
  defaultName: string
) => {
  let currentDirectory = searchName;
  let parentDirectory = searchName.replace(/\/[^/]*$/, '');
  while (parentDirectory !== currentDirectory) {
    if (templateList.includes(currentDirectory)) {
      return currentDirectory;
    }
    currentDirectory = parentDirectory;
    parentDirectory = parentDirectory.replace(/\/[^/]*$/, '');
  }
  return defaultName;
};

export const getEntryList = (scanFileDir: string[], scanFileName: string, templateName: string) => {
  const entryList: EntryList = [];
  // 获取目录下所有文件
  const fileList: string[] = [];
  scanFileDir.forEach(item => {
    fileList.push(...getAllFile(item));
  });

  // 筛选后的所有文件
  const filteredList = filterList(fileList, [scanFileName, templateName + '.html']);
  const entryMap = new Map();
  const templateDirectoryList: string[] = [];
  filteredList.forEach(item => {
    const id = item.replace(/\.\w+$/, '');
    const isTemplate = item.indexOf('html') !== -1;
    if (isTemplate) {
      let templateNameTemp = item.replace(`${templateName}.html`, '');

      if (templateNameTemp.endsWith('/')) {
        templateNameTemp = templateNameTemp.slice(0, -1);
      }
      templateDirectoryList.push(templateNameTemp);
    } else {
      entryMap.set(id, {
        id,
        entryPath: item,
        templatePath: `${templateName}.html`,
      });
    }
  });
  // 生成entry
  entryMap.forEach(item => {
    const idParentDir = item.id.replace(/\/\w+$/, '');

    const nearestTemplatePath = getNearestTemplate(templateDirectoryList, idParentDir, '.');
    entryList.push({
      id: item.id,
      entryPath: item.entryPath,
      templatePath: nearestTemplatePath,
      virtualTemplatePath: idParentDir,
      virtualTemplateFilePath: '.',
      virtualTemplateFileRelativePath: '.',
    });
  });
  return entryList;
};

export const genInputConfig = ({
  scanFileDir,
  scanFileName,
  outputFileDir,
  templateName,
}: MakeRequired<MPAHeroPluginOption>) => {
  const entryList = getEntryList(scanFileDir, scanFileName, templateName);
  const inputConfig: Record<string, string> = {};
  entryList.forEach(item => {
    // 更新虚拟模板路径
    let virtualTemplatePathTemp = item.virtualTemplatePath;
    // 虚拟模板路径=>删除scanFileDir目录
    for (let index = 0; index < scanFileDir.length; index++) {
      let dir = scanFileDir[index];
      if (dir.startsWith('./')) {
        dir = dir.replace('./', '');
      }
      if (item.virtualTemplatePath.startsWith(dir)) {
        virtualTemplatePathTemp = item.virtualTemplatePath.replace(dir, '');
        break;
      }
    }
    // 虚拟模板路径=>增加outputFile目录
    virtualTemplatePathTemp = path.join(outputFileDir, virtualTemplatePathTemp);
    // 存储虚拟模板相对路径
    item.virtualTemplateFileRelativePath = virtualTemplatePathTemp;
    // 不管templateName是什么，最后都是生成index.html
    const tempPath = path.resolve(virtualTemplatePathTemp, `index.html`);
    item.virtualTemplateFilePath = tempPath;
    let id = item.id.replace(/\//, '-');
    while (id.indexOf('/') !== -1) {
      id = id.replace(/\//, '-');
    }
    inputConfig[id] = tempPath;
  });
  return { inputConfig, entryList };
};

export const buildDirectoryTree = (paths: { entryPath: string; info: Entry }[]): DirectoryTree => {
  const root: DirectoryTree = {};
  paths.forEach(({ entryPath, info }) => {
    const parts = entryPath.split('/');
    let currentLevel = root;
    parts.forEach((part, index) => {
      if (!currentLevel[part]) {
        if (index === parts.length - 1) {
          currentLevel[part] = info.virtualTemplateFileRelativePath;
        } else {
          currentLevel[part] = {};
        }
      }
      currentLevel = currentLevel[part];
    });
  });
  return root;
};

export const genATag = (str: string, href: string) => {
  return `<a target="_blank" href="${href}">${str}</a>`;
};

export const renderDirectoryTree = (data: DirectoryTree, fileName: string): string => {
  let html = `<ul>`;
  for (const key in data) {
    html += `<li>${key === fileName ? genATag(key, data[key] + '/') : key}`;
    const value = data[key];
    if (typeof value === 'object') {
      html += renderDirectoryTree(value as DirectoryTree, fileName);
    }
    html += `</li>`;
  }
  return html + `</ul>`;
};
