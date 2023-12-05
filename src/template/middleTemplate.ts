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