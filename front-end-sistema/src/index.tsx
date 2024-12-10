import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'modern-normalize/modern-normalize.css'
import './styles/index.css'

import Login from './pages/Login'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Login />
  </StrictMode>
)
