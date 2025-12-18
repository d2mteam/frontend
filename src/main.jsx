import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('main.jsx loaded')

const rootElement = document.getElementById('root')
console.log('Root element:', rootElement)

if (rootElement) {
  try {
    console.log('Creating React root...')
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
    console.log('React app rendered successfully')
  } catch (error) {
    console.error('Error rendering React app:', error)
    rootElement.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
      <h1>React Rendering Error</h1>
      <p>${error.message}</p>
      <pre>${error.stack}</pre>
    </div>`
  }
} else {
  console.error('Root element not found!')
}
