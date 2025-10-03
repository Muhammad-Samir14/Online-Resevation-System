import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Bootstrap JS (for navbar toggling, dropdowns, etc.)

// import 'bootstrap-sicons/font/bootstrap-icons.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// import '<bootstrap/dist/js/bootstrap.js's

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
