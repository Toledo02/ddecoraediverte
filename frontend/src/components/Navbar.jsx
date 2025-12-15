import { Box, Flex, Button, Container, Link, Image } from '@chakra-ui/react'; // Adicionei Image
import { Link as RouterLink } from 'react-router-dom';

export default function Navbar() {
  return (
    // Mudamos bg="purple.600" para bg="brand.500" (nossa cor personalizada)
    <Box bg="white" borderBottom="4px solid" borderColor="brand.500" py={2} shadow="sm" mb={6}>
      <Container maxW="container.lg">
        <Flex justify="space-between" align="center" direction={["column", "row"]} gap={4}>
          
          {/* LOGO DA MARCA */}
          <RouterLink to="/">
            {/* Ajuste o height (h) conforme o tamanho do seu logo */}
            <Image src="/logo.png" alt="D' Decora e Diverte" h="60px" objectFit="contain" />
          </RouterLink>

          {/* Links de Navegação */}
          <Flex gap={6} align="center">
            {/* Usamos color="brand.600" para combinar com a identidade */}
            <Link as={RouterLink} to="/" fontWeight="bold" color="gray.600" _hover={{ color: 'brand.500' }}>
              Home
            </Link>
            <Link as={RouterLink} to="/decoracoes" fontWeight="bold" color="gray.600" _hover={{ color: 'brand.500' }}>
              Decorações
            </Link>
            <Link as={RouterLink} to="/sobre" fontWeight="bold" color="gray.600" _hover={{ color: 'brand.500' }}>
              Sobre
            </Link>
            
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