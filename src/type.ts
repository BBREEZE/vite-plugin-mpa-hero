export type MPAHeroPluginOption = {
  /**
   * 当调试时，自动生成一个目录页来方便访问
   * @default true
   */
  enableDevDirectory?: boolean
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
   * @default 'main.js'
   */
  scanFileName?: string
  /**
   * 输出前置目录
   * 比如初始打包后为`/a/b/c.html`,配置`/custom/`则变为`/custom/a/b/c.html`
   * @default '/'
   */
  outputFileDir?: string
  /**
   * 是否改为父级目录名称
   * 比如初始打包后为`/a/b/index.html`,配置`true`则变为`/a/b.html`
   * @default true
   */
  enableParentFileName?: boolean
}

export type MakeRequired<T> = {
  [P in keyof T]-?: NonNullable<T[P]>; 
};
