import { Box, Flex, Button, Heading, Container, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <Box bg="purple.600" color="white" py={4} shadow="md" mb={6}>
      <Container maxW="container.lg">
        <Flex justify="space-between" align="center" direction={["column", "row"]} gap={4}>
          {/* Logo / Título */}
          <Heading size="md" as={RouterLink} to="/">
            D' Decora e Diverte
          </Heading>

          {/* Links de Navegação */}
          <Flex gap={4} align="center">
            <Link as={RouterLink} to="/" fontWeight="bold">Home</Link>
            <Link as={RouterLink} to="/decoracoes" fontWeight="bold">Decorações</Link>
            <Link as={RouterLink} to="/sobre" fontWeight="bold">Sobre</Link>
            
            {/* Botão Admin destacado */}
            <Button as={RouterLink} to="/admin" colorScheme="purple" bg="white" color="purple.600" size="sm">
              Admin
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}