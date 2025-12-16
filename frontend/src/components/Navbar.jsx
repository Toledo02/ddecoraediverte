import { useContext } from 'react';
import { Box, Flex, Button, Container, Link, Image, Badge, Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

const CartIcon = (props) => (
  <Icon viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.25,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.59 17.3,11.97L21.16,4.96L19.42,4H19.41L18.31,6L15.55,11H8.53L8.4,10.73L6.16,6L5.21,4L4.27,2H1M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z" />
  </Icon>
);

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <Box bg="white" borderBottom="4px solid" borderColor="brand.500" py={2} shadow="sm" mb={6} position="sticky" top={0} zIndex={100}>
      <Container maxW="container.lg">
        <Flex justify="space-between" align="center" direction={["column", "row"]} gap={4}>
          
          {/* LOGO */}
          <RouterLink to="/">
            <Image src="/logo.png" alt="D' Decora e Diverte" h="60px" objectFit="contain" />
          </RouterLink>

          {/* NAVEGAÇÃO */}
          <Flex gap={4} align="center" wrap="wrap" justify="center">
            <Link as={RouterLink} to="/" fontWeight="bold" color="gray.600" _hover={{ color: 'brand.500' }}>
              Home
            </Link>
            <Link as={RouterLink} to="/decoracoes" fontWeight="bold" color="gray.600" _hover={{ color: 'brand.500' }}>
              Decorações
            </Link>
            <Link as={RouterLink} to="/sobre" fontWeight="bold" color="gray.600" _hover={{ color: 'brand.500' }}>
              Sobre
            </Link>
            
            {/* BOTÃO DO CARRINHO (Escondido no mobile "base: none", visível no PC "md: flex") */}
            <Button 
              display={{ base: 'none', md: 'flex' }}
              as={RouterLink} 
              to="/carrinho" 
              variant="outline" 
              colorScheme="brand" 
              size="sm"
              leftIcon={<CartIcon boxSize={5} />}
            >
              Carrinho
              {totalItems > 0 && (
                <Badge ml={2} colorScheme="green" variant="solid" borderRadius="full">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* BOTÃO ADMIN */}
            <Button 
              as={RouterLink} 
              to="/admin" 
              bg="brand.500" 
              color="white" 
              size="sm"
              _hover={{ bg: 'brand.600' }}
            >
              Admin
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}