import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './connection'   // initialises AppKit (side-effect only)
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
