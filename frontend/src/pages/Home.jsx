import { Box, Button, Container, Heading, Text, Stack, SimpleGrid, Icon, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { StarIcon, TimeIcon, CheckCircleIcon } from '@chakra-ui/icons';

export default function Home() {
  return (
    <Box>
      {/* --- HERO SECTION --- */}
      <Box
        bgImage="url('https://images.unsplash.com/photo-1530103862676-de3c9da59af7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        h="60vh"
        position="relative"
      >
        <Box position="absolute" top="0" left="0" w="100%" h="100%" bg="rgba(0,0,0,0.4)">
          <Container maxW="container.lg" h="100%" centerContent justifyContent="center">
            <Stack spacing={6} textAlign="center">
              <Heading color="white" size="2xl" textShadow="2px 2px 4px rgba(0,0,0,0.6)" fontFamily="heading">
                Festas Mágicas e Sem Estresse
              </Heading>
              <Text color="gray.100" fontSize="xl" maxW="lg" fontWeight="bold">
                Decorações completas e kits pegue-e-monte para transformar seu aniversário em um momento inesquecível.
              </Text>
              
              {/* BOTÃO AGORA USA A COR BRAND (VERDE) */}
              <Button
                as={Link}
                to="/decoracoes"
                colorScheme="brand" 
                size="lg"
                px={10}
                fontWeight="bold"
                boxShadow="lg"
                _hover={{ transform: 'scale(1.05)', bg: 'brand.400' }}
              >
                Ver Temas Disponíveis
              </Button>
            </Stack>
          </Container>
        </Box>
      </Box>

      {/* --- SEÇÃO DE BENEFÍCIOS --- */}
      <Container maxW="container.xl" py={20}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Feature
            icon={StarIcon}
            color="accent.purple" // Usando o lilás do balão
            title="Temas Exclusivos"
            text="Peças selecionadas com carinho para garantir fotos incríveis do seu evento."
          />
          <Feature
            icon={CheckCircleIcon}
            color="accent.blue" // Usando o azul do balão
            title="Praticidade Total"
            text="Escolha, reserve e receba tudo pronto. Facilitamos sua vida para você curtir a festa."
          />
          <Feature
            icon={TimeIcon}
            color="accent.pink" // Usando o rosa da borboleta
            title="Economia de Tempo"
            text="Não gaste horas procurando itens separados. Nossos kits já vêm completos!"
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
}

// Componente auxiliar atualizado para aceitar cores dinâmicas
function Feature({ title, text, icon, color }) {
  return (
    <Stack align="center" textAlign="center" p={6} shadow="md" borderRadius="2xl" bg="white" borderTop="4px solid" borderColor={color}>
      <Flex w={16} h={16} align="center" justify="center" color="white" rounded="full" bg={color} mb={3}>
        <Icon as={icon} w={8} h={8} />
      </Flex>
      <Heading size="md" mb={2} color="gray.700" fontFamily="heading">{title}</Heading>
      <Text color="gray.500">{text}</Text>
    </Stack>
  );
}