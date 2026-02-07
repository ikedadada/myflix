import { RouterProvider } from '@tanstack/react-router'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppProviders } from './app/providers/AppProviders'
import { router } from './app/router/routes'
import './assets/styles/globals.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find root element')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </React.StrictMode>,
)
