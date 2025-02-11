import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./assets/css/custom.css"
import "./assets/css/bootstrap-style.css"
import "./assets/css/newcss.css"
import { BrowserRouter } from 'react-router-dom';
// import { WebSocketProvider } from '../context/WebSocketContext'; 

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
     {/* <WebSocketProvider> */}
      <App />
      {/* </WebSocketProvider> */}
    </BrowserRouter>  
)
