import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css'
import App from './App.jsx'


  console.log = function () {};
  // console.warn = function () {};
  // console.error = function () {};
  // console.info = function () {};



createRoot(document.getElementById('root')).render(
 
    <App />
 
)
