import { createContext, useState, useContext } from 'react';

const CartContext = createContext({});

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Adicionar item ao carrinho
  function addToCart(produto) {
    setCart(prev => {
      // Verifica se o item já está no carrinho
      const itemExists = prev.find(item => item.id === produto.id);

      if (itemExists) {
        // Se já existe, aumenta a quantidade
        return prev.map(item => 
          item.id === produto.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }

      // Se não existe, adiciona com quantidade 1
      return [...prev, { ...produto, quantity: 1 }];
    });
  }

  // Remover item (diminuir quantidade)
  function removeFromCart(produtoId) {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === produtoId);
      
      if (existingItem?.quantity > 1) {
        return prev.map(item => 
          item.id === produtoId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      }
      
      // Se quantidade for 1, remove do array
      return prev.filter(item => item.id !== produtoId);
    });
  }

  // Calcular total (R$)
  const totalValue = cart.reduce((acc, item) => {
    return acc + (item.preco * item.quantity);
  }, 0);

  // Gerar mensagem do WhatsApp
  function generateWhatsAppMessage(clienteNome, dataFesta) {
    let message = `Olá! Me chamo *${clienteNome}*.\n`;
    message += `Gostaria de um orçamento para o dia: *${dataFesta}*.\n\n`;
    message += `*Itens Selecionados:* \n`;

    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.nome} (R$ ${item.preco * item.quantity})\n`;
    });

    message += `\n*Valor Total Estimado: R$ ${totalValue.toFixed(2)}*`;
    message += `\n\nAguardo confirmação da disponibilidade!`;

    return encodeURIComponent(message);
  }

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      totalValue,
      generateWhatsAppMessage 
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado para facilitar o uso
export function useCart() {
  return useContext(CartContext);
}