import { Container, Heading, Text, VStack, Image, Box, SimpleGrid, Icon, Flex } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

export default function Sobre() {
  return (
    <Container maxW="container.lg" py={10}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
        
        {/* Coluna da Foto com detalhe visual */}
        <Box position="relative">
          {/* Um quadrado decorativo atrás da foto usando a cor lilás de apoio */}
          <Box 
            position="absolute" 
            top="-15px" 
            left="-15px" 
            w="100%" 
            h="100%" 
            bg="accent.purple" 
            borderRadius="2xl" 
            zIndex={-1} 
          />
          <Image 
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
            alt="Equipe D' Decora" 
            borderRadius="2xl" 
            shadow="xl"
            objectFit="cover"
          />
        </Box>

        {/* Coluna do Texto */}
        <VStack align="start" spacing={6}>
          <Flex align="center" gap={2}>
            <Icon as={StarIcon} color="accent.yellow" w={6} h={6} />
            <Heading color="brand.600" fontFamily="heading">Nossa História</Heading>
          </Flex>
          
          <Text fontSize="lg" color="gray.700" lineHeight="tall">
            A <strong>D' Decora e Diverte</strong> nasceu do sonho de levar alegria para as famílias de forma acessível e prática.
          </Text>
          
          <Text color="gray.600" lineHeight="tall">
            Sabemos que organizar uma festa pode ser cansativo. Por isso, nossa missão é tirar o peso da decoração das suas costas. Trabalhamos com peças de alta qualidade, higienizadas e selecionadas com muito amor.
          </Text>
          
          <Text color="gray.600" lineHeight="tall">
            Seja um "bolinho em casa" ou uma grande celebração, temos o kit perfeito para você.
          </Text>
        </VStack>

      </SimpleGrid>
    </Container>
  );
}