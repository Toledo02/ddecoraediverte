import { Box, Container, Text } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box bg="brand.800" color="white" py={10} mt={10}>
      <Container maxW="container.lg" textAlign="center">
        <Text>&copy; {new Date().getFullYear()} D' Decora e Diverte. Feito com carinho.</Text>
      </Container>
    </Box>
  );
}