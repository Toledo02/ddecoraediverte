import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App.jsx'
import theme from './theme'
import { CartProvider } from '../contexts/CartContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <CartProvider> {/* <--- O CartProvider deve ficar AQUI dentro */}
        <App />
      </CartProvider>
    </ChakraProvider>
  </React.StrictMode>,
)