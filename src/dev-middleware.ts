import { IncomingMessage, ServerResponse } from 'http';
import { Connect, ViteDevServer } from 'vite';
import { EntryList, MPAHeroPluginOption, MakeRequired } from './type';
import { renderDirectoryTree, buildDirectoryTree } from './core';
import { devIndexTemplate } from './template/devIndexTemplate';
import fs from 'fs';
import path from 'path';

export const devServerMiddleware = (
  entries: EntryList,
  opt: MakeRequired<MPAHeroPluginOption>,
  server: ViteDevServer
) => {
  return async (
    req: Connect.IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    next: Connect.NextFunction
  ) => {
    // dev内置的主页
    if (req.url === '/_index') {
      let htmlTemplate = devIndexTemplate(
        renderDirectoryTree(
          buildDirectoryTree(
            entries.map((item: any) => ({ entryPath: item.entryPath, info: item }))
          ),
          opt.scanFileName
        )
      );
      res.end(htmlTemplate);
      return;
    }
    // dev模式下的页面处理
    let url = req.url || '';
    url.startsWith('/') && (url = url.substring(1));
    url.endsWith('/index.html') && (url = url.substring(0, url.length - 11));
    url.endsWith('/') && (url = url.substring(0, url.length - 1));
    // 如果是首页则指定为当前目录
    if(url === ''){
      url = '.'
    }
    for (let index = 0; index < entries.length; index++) {
      // 如果对应虚拟模板存在
      if (entries[index].virtualTemplateFileRelativePath === url) {
        const templateContent = fs.readFileSync(
          path.resolve(entries[index].templatePath, `${opt.templateName}.html`),
          'utf-8'
        );
        const template = templateContent.replace(
          '</body>',
          `<script type="module" src="/mpa-hero/${entries[index].entryPath}"></script></body>`
        );
        const generatedHtml = await server.transformIndexHtml(url || '', template);
        res.end(generatedHtml);
        return;
      }
    }
    // 默认的处理
    return next();
  };
};
