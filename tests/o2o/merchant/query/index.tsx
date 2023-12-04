import React from 'react'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementsByTagName('body')[0]!).render(
  <div>222</div>
)

interface QueryProps {
  
}

const Query: React.FC<QueryProps> = () => {
  return ( <div>多级目录测试</div> );
}
 
export default Query;