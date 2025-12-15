import { useEffect, useState } from 'react';
import { 
  Box, Container, Grid, Heading, Text, Image, Button, Badge, Flex, Spinner, Center, useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { FaWhatsapp } from 'react-icons/fa';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Função que busca os dados do backend
  useEffect(() => {
    async function fetchProdutos() {
      try {
        // Conecta na API que criamos (porta 3000)
        const response = await axios.get('http://localhost:3000/produtos');
        setProdutos(response.data);
      } catch (error) {
        toast({
          title: 'Erro ao carregar.',
          description: "Não foi possível buscar os produtos.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProdutos();
  }, []);

  return (
    <Box bg="gray.50" minH="100vh" pb={10}>
      {/* Cabeçalho estilo App */}
      <Box bg="purple.600" p={4} color="white" shadow="md">
        <Container maxW="container.md">
          <Flex justify="space-between" align="center">
            <Heading size="md">D' Decora e Diverte</Heading>
            {/* Futuramente aqui vai o ícone do carrinho */}
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.md" mt={6}>
        
        {loading ? (
          <Center h="50vh">
            <Spinner size="xl" color="purple.500" />
          </Center>
        ) : (
          <>
            {produtos.length === 0 ? (
              <Center h="50vh" flexDirection="column">
                <Text fontSize="xl" color="gray.500">Nenhum produto cadastrado.</Text>
                <Text fontSize="sm" color="gray.400">Acesse o /admin para adicionar.</Text>
              </Center>
            ) : (
              <Grid templateColumns={["1fr", "1fr 1fr"]} gap={6}>
                {produtos.map((produto) => (
                  <Box 
                    key={produto.id} 
                    bg="white" 
                    borderRadius="lg" 
                    overflow="hidden" 
                    shadow="sm"
                    border="1px"
                    borderColor="gray.200"
                  >
                    <Image 
                      src={produto.imagemUrl} 
                      alt={produto.nome}
                      h="200px" 
                      w="100%" 
                      objectFit="cover"
                      fallbackSrc="https://via.placeholder.com/300?text=Sem+Imagem" // Caso a imagem falhe
                    />

                    <Box p={4}>
                      <Badge borderRadius="full" px="2" colorScheme="purple">
                        {produto.categoria}
                      </Badge>
                      
                      <Heading size="md" mt={2} mb={2}>
                        {produto.nome}
                      </Heading>
                      
                      <Text fontSize="sm" color="gray.600" noOfLines={2}>
                        {produto.descricao}
                      </Text>

                      <Button 
                        mt={4} 
                        w="full" 
                        colorScheme="green" 
                        leftIcon={<FaWhatsapp />}
                        variant="outline"
                      >
                        Adicionar ao Orçamento
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default App;