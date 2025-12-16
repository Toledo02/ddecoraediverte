import { useContext } from 'react';
import { Box, Container, Flex, Text, Button } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

export default function FloatingBar() {
  const { cart, totalValue } = useContext(CartContext);
  const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const location = useLocation();

  // Não mostra a barra se estiver vazio, no carrinho ou no admin
  if (totalItems === 0) return null;
  if (location.pathname === '/carrinho' || location.pathname === '/admin') return null;

  return (
    <Box position="fixed" bottom="0" left="0" w="100%" bg="white" p={4} shadow="0px -4px 10px rgba(0,0,0,0.1)" zIndex={999} borderTopRadius="xl">
      <Container maxW="container.lg">
        <Flex justify="space-between" align="center">
          <Box>
            <Text fontSize="sm" color="gray.500">Total estimado</Text>
            <Text fontSize="xl" fontWeight="bold" color="brand.600">R$ {totalValue.toFixed(2)}</Text>
          </Box>
          <Button as={Link} to="/carrinho" colorScheme="brand" size="lg" px={8} rounded="full" shadow="lg">
            Ver Carrinho ({totalItems})
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}