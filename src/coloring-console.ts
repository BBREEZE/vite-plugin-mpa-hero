enum PluginCustomizedErrorLevel {
  fatal = 0,
  warn,
  info,
  debug, // fatal error will be thrown
}
export class PluginCustomizedError extends Error {
  errorLevel: PluginCustomizedErrorLevel;
  constructor(message: string, errorLevel: PluginCustomizedErrorLevel = 0) {
    super(message);

    this.errorLevel = errorLevel;
    this.name = 'VitePluginAutoMpaHTMLError';
    this.message = `[vite-plugin-auto-mpa-html]: ${message}`;
  }
}

// Plugin's custom errors
export class ColoringConsole {
  envErrorLevel: PluginCustomizedErrorLevel = 0;

  constructor(envErrorLevel: PluginCustomizedErrorLevel = 0) {
    if (envErrorLevel) this.envErrorLevel = envErrorLevel;
  }

  /**
   * @see {@link https://sparkle.im/post/node-js%E7%8E%AF%E5%A2%83log%E9%A2%9C%E8%89%B2%E8%A1%A8}
   * default "debug" color is white
   */
  private coloredMsg = (msg: string, colorPrefix: string = '\x1b[37m') => {
    return `${colorPrefix}[vite-plugin-auto-mpa-html]: ${msg}\x1b[0m`;
  };

  debug = (msg: string) => {
    if (this.envErrorLevel >= 3) console.log(this.coloredMsg(msg));
  };

  log = (msg: string) => {
    if (this.envErrorLevel >= 2) console.log(this.coloredMsg(msg, '\x1b[34m'));
  };

  warn = (msg: string) => {
    if (this.envErrorLevel >= 1) console.log(this.coloredMsg(msg, '\x1b[33m'));
  };

  error = (msg: string) => {
    if (this.envErrorLevel >= 0) console.log(this.coloredMsg(msg, '\x1b[31m'));
  };

  fatal = (msg: string) => {
    throw new PluginCustomizedError(msg, 0);
  };
}