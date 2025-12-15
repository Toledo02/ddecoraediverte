import { Container, Heading, Text, Box } from '@chakra-ui/react';

export default function Sobre() {
  return (
    <Container maxW="container.md" py={10}>
      <Heading mb={4} color="purple.600">Sobre a D' Decora</Heading>
      <Box bg="white" p={6} borderRadius="md" shadow="sm">
        <Text mb={4}>
          Somos especialistas em levar alegria e beleza para sua festa. 
          Trabalhamos com aluguel de peças, montagem completa e kits pegue-e-monte.
        </Text>
        <Text>
          Nossa missão é facilitar sua vida para que você possa aproveitar o momento sem preocupações.
        </Text>
      </Box>
    </Container>
  );
}