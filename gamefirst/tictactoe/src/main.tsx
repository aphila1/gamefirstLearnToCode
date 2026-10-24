import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { StudioProvider } from './context/StudioContext'
import './index.css'
// Add the PWA registration import line here
import { registerSW } from 'virtual:pwa-register'

// Execute the service worker registration
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StudioProvider>
      <App />
    </StudioProvider>
  </StrictMode>
)