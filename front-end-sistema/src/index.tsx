import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

import App from './pages/App'

import 'modern-normalize/modern-normalize.css'
import './styles/index.css'

const root = document.getElementById('root')

createRoot(root!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
