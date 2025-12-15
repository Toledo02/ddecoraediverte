import { useEffect, useState } from 'react';
import { 
  Box, Container, SimpleGrid, Image, Heading, Text, Badge, 
  Button, Stack, Flex, Spinner, Center, useToast 
} from '@chakra-ui/react';
import axios from 'axios';

export default function Vitrine() {
  // 1. Inicializa como array vazio [] para não dar erro de undefined
  const [produtos, setProdutos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function buscarProdutos() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await axios.get(`${apiUrl}/produtos`);
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar:", error);
        toast({
          title: 'Erro ao carregar produtos.',
          description: "Tente recarregar a página.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }

    buscarProdutos();
  }, []);

  // 2. Se estiver carregando, mostra um spinner girando
  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Heading mb={2} color="brand.700" textAlign="center" fontFamily="heading">
        Nossos Temas
      </Heading>
      <Text mb={10} color="gray.500" textAlign="center">
        Escolha o tema perfeito para a sua próxima festa
      </Text>

      {/* 3. Verificação de segurança: Se a lista estiver vazia */}
      {produtos.length === 0 ? (
        <Center flexDir="column" py={10}>
          <Text fontSize="xl" color="gray.400">Nenhum produto cadastrado ainda.</Text>
          <Text fontSize="sm" color="gray.400">Acesse o painel Admin para adicionar.</Text>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {produtos.map((produto) => (
            <Box 
              key={produto.id} 
              borderWidth="1px" 
              borderRadius="2xl" 
              overflow="hidden" 
              bg="white" 
              shadow="lg"
              _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}
              transition="all 0.2s"
            >
              <Image 
                src={produto.imagemUrl} 
                alt={produto.nome} 
                h="250px" 
                w="100%" 
                objectFit="cover"
                fallbackSrc="https://via.placeholder.com/300?text=Sem+Foto"
              />

              <Box p={6}>
                <Flex align="baseline" mt={2}>
                  <Badge px={2} py={1} bg="brand.100" color="brand.800" borderRadius="md" fontSize="0.8em">
                    {produto.categoria}
                  </Badge>
                </Flex>

                <Heading mt={2} size="md" fontWeight="bold" lineHeight="short" fontFamily="heading" color="gray.700">
                  {produto.nome}
                </Heading>

                <Text mt={2} color="gray.500" noOfLines={2}>
                  {produto.descricao}
                </Text>

                <Flex mt={4} justify="space-between" align="center">
                  <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                    R$ {Number(produto.preco).toFixed(2)}
                  </Text>
                  
                  <Button 
                    as="a" 
                    href={`https://wa.me/5541999999999?text=Olá! Gostaria de saber mais sobre o tema ${produto.nome}`}
                    target="_blank"
                    colorScheme="brand" 
                    size="sm"
                    rounded="full"
                  >
                    Reservar
                  </Button>
                </Flex>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}