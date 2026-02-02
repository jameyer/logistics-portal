import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ShipmentDataProvider } from './context/ShipmentDataProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ShipmentDataProvider>
      <App />
    </ShipmentDataProvider>
  </StrictMode>,
)
