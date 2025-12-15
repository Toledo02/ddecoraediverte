import { Box, Heading, Text, Button, Container, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Container maxW="container.md" centerContent py={20}>
      <VStack spacing={8} textAlign="center">
        <Heading size="2xl" color="purple.700">Festas Inesquecíveis</Heading>
        <Text fontSize="xl" color="gray.600">
          Transformamos seu evento em um momento mágico com a decoração perfeita.
        </Text>
        <Button as={Link} to="/decoracoes" colorScheme="green" size="lg" px={10}>
          Ver Decorações Disponíveis
        </Button>
      </VStack>
    </Container>
  );
}