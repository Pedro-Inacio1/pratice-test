import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Pages from "./routes"
import { AuthProvider } from './Contexts/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Pages />
    </AuthProvider>
  </StrictMode>
)
