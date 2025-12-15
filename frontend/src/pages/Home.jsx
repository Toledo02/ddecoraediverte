import { Box, Button, Container, Heading, Text, Stack, SimpleGrid, Icon, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { StarIcon, TimeIcon, CheckCircleIcon } from '@chakra-ui/icons';

export default function Home() {
  return (
    <Box>
      {/* --- HERO SECTION (O Banner Principal) --- */}
      <Box
        bgImage="url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        h="60vh"
        position="relative"
      >
        {/* Máscara escura para o texto ficar legível */}
        <Box position="absolute" top="0" left="0" w="100%" h="100%" bg="rgba(0,0,0,0.5)">
          <Container maxW="container.lg" h="100%" centerContent justifyContent="center">
            <Stack spacing={6} textAlign="center">
              <Heading color="white" size="2xl" textShadow="2px 2px 4px rgba(0,0,0,0.6)">
                Festas Mágicas e Sem Estresse
              </Heading>
              <Text color="gray.100" fontSize="xl" maxW="lg">
                Decorações completas e kits pegue-e-monte para transformar seu aniversário em um momento inesquecível.
              </Text>
              <Button
                as={Link}
                to="/decoracoes"
                colorScheme="purple"
                size="lg"
                px={10}
                fontWeight="bold"
                _hover={{ transform: 'scale(1.05)' }}
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
            title="Temas Exclusivos"
            text="Peças selecionadas com carinho para garantir fotos incríveis do seu evento."
          />
          <Feature
            icon={CheckCircleIcon}
            title="Praticidade Total"
            text="Escolha, reserve e receba tudo pronto. Facilitamos sua vida para você curtir a festa."
          />
          <Feature
            icon={TimeIcon}
            title="Economia de Tempo"
            text="Não gaste horas procurando itens separados. Nossos kits já vêm completos!"
          />
        </SimpleGrid>
      </Container>

      {/* --- RODAPÉ SIMPLES --- */}
      <Box bg="purple.800" color="white" py={10}>
        <Container maxW="container.lg" textAlign="center">
          <Text>&copy; {new Date().getFullYear()} D' Decora e Diverte. Feito com carinho.</Text>
        </Container>
      </Box>
    </Box>
  );
}

// Componente auxiliar para os cards de benefícios
function Feature({ title, text, icon }) {
  return (
    <Stack align="center" textAlign="center" p={5} shadow="md" borderRadius="lg" bg="gray.50">
      <Flex w={16} h={16} align="center" justify="center" color="white" rounded="full" bg="purple.500" mb={1}>
        <Icon as={icon} w={8} h={8} />
      </Flex>
      <Heading size="md" mb={2}>{title}</Heading>
      <Text color="gray.600">{text}</Text>
    </Stack>
  );
}