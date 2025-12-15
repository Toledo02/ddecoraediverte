import { Container, Heading, Text, VStack, Image, Box, SimpleGrid } from '@chakra-ui/react';

export default function Sobre() {
  return (
    <Container maxW="container.lg" py={10}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
        
        {/* Coluna da Foto (Pode colocar uma foto dela depois) */}
        <Box>
          <Image 
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
            alt="Equipe D' Decora" 
            borderRadius="lg" 
            shadow="xl"
          />
        </Box>

        {/* Coluna do Texto */}
        <VStack align="start" spacing={5}>
          <Heading color="purple.600">Nossa História</Heading>
          <Text fontSize="lg" color="gray.700">
            A <strong>D' Decora e Diverte</strong> nasceu do sonho de levar alegria para as famílias de forma acessível e prática.
          </Text>
          <Text color="gray.600">
            Sabemos que organizar uma festa pode ser cansativo. Por isso, nossa missão é tirar o peso da decoração das suas costas. Trabalhamos com peças de alta qualidade, higienizadas e selecionadas com muito amor.
          </Text>
          <Text color="gray.600">
            Seja um "bolinho em casa" ou uma grande celebração, temos o kit perfeito para você.
          </Text>
        </VStack>

      </SimpleGrid>
    </Container>
  );
}