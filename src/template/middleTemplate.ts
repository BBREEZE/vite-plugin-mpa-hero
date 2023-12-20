export const reactMiddleTemplate = (middleTemplatePath: string) => {
  return  `
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import App from '${middleTemplatePath}'
    
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  `
}
export const react16MiddleTemplate = (middleTemplatePath: string) => {
  return  `
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import App from '${middleTemplatePath}'
    
    ReactDOM.render(
      <App />,
      document.getElementById('root')
    )
  `
}

export const vue2MiddleTemplate = (middleTemplatePath: string) => {
  return  `
    import Vue from 'vue'
    import App from '${middleTemplatePath}'
    new Vue({
      el: '#app',
      render: h => h(App)
    })
  `
}

export const vue3MiddleTemplate = (middleTemplatePath: string) => {
  return  `
    import { createApp } from 'vue'
    import App from '${middleTemplatePath}'

    createApp(App).mount('#root')
  `
}

export const customMiddleTemplate = (middleTemplatePath: string) => {
  return  `import App from '${middleTemplatePath}';
    App()
  `
}

export const directMiddleTemplate = (middleTemplatePath: string) => {
  return  `import App from '${middleTemplatePath}';
    App()
  `
}