import React from 'react'
import ReactDOM from 'react-dom/client'


interface QueryProps {
  
}

const App: React.FC<QueryProps> = () => {
  return ( <div>tests/overseas/index.tsx</div> );
}

ReactDOM.createRoot(document.getElementsByTagName('body')[0]!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

export default App;