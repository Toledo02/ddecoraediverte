import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App.jsx'
import { CartProvider } from './contexts/CartContext.jsx' // Importe aqui

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <CartProvider> {/* Envolvemos o App aqui */}
        <App />
      </CartProvider>
    </ChakraProvider>
  </React.StrictMode>,
)