import { useEffect, useState, useContext } from 'react';
import { 
  Box, Container, SimpleGrid, Image, Heading, Text, Badge, 
  Button, Flex, Spinner, Center, useToast, IconButton
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom'; // Importante para o link do carrinho
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';

export default function Vitrine() {
  const [produtos, setProdutos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const { cart, addToCart, removeFromCart, totalValue } = useContext(CartContext);

  // Calcula total de itens
  const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  useEffect(() => {
    async function buscarProdutos() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await axios.get(`${apiUrl}/produtos`);
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar:", error);
        toast({ title: 'Erro ao carregar.', status: 'error' });
      } finally {
        setLoading(false);
      }
    }
    buscarProdutos();
  }, []);

  function getQuantity(produtoId) {
    const item = cart.find((i) => i.id === produtoId);
    return item ? item.quantity : 0;
  }

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }

  return (
    <Box pb={24}> {/* Padding bottom extra para o conteúdo não ficar atrás da barra fixa */}
      <Container maxW="container.xl" py={10}>
        <Heading mb={2} color="brand.700" textAlign="center" fontFamily="heading">
          Nossos Temas
        </Heading>
        <Text mb={10} color="gray.500" textAlign="center">
          Adicione os itens ao carrinho para montar seu orçamento
        </Text>

        {produtos.length === 0 ? (
          <Center flexDir="column" py={10}>
            <Text fontSize="xl" color="gray.400">Nenhum produto cadastrado ainda.</Text>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {produtos.map((produto) => {
              const qty = getQuantity(produto.id);

              return (
                <Box 
                  key={produto.id} 
                  borderWidth="1px" 
                  borderRadius="2xl" 
                  overflow="hidden" 
                  bg="white" 
                  shadow="lg"
                  transition="all 0.2s"
                  borderColor={qty > 0 ? "brand.400" : "gray.200"}
                  transform={qty > 0 ? "scale(1.02)" : "none"}
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

                    <Heading mt={2} size="md" fontFamily="heading" color="gray.700">
                      {produto.nome}
                    </Heading>

                    <Text mt={2} color="gray.500" noOfLines={2}>
                      {produto.descricao}
                    </Text>

                    <Flex mt={4} justify="space-between" align="center">
                      <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                        R$ {Number(produto.preco).toFixed(2)}
                      </Text>

                      {/* AREA DE AÇÃO COM ALTURA FIXA PARA NÃO PULAR O LAYOUT */}
                      <Box h="40px" display="flex" alignItems="center">
                        {qty === 0 ? (
                          <Button 
                            colorScheme="brand" 
                            size="sm"
                            rounded="full"
                            onClick={() => addToCart(produto)}
                          >
                            Adicionar
                          </Button>
                        ) : (
                          <Flex align="center" bg="brand.50" borderRadius="full" px={2} py={1}>
                            <IconButton 
                              icon={<MinusIcon />} 
                              size="xs" 
                              colorScheme="brand" 
                              variant="ghost"
                              isRound
                              onClick={() => removeFromCart(produto.id)}
                              aria-label="Remover"
                            />
                            <Text mx={3} fontWeight="bold" color="brand.800">{qty}</Text>
                            <IconButton 
                              icon={<AddIcon />} 
                              size="xs" 
                              colorScheme="brand" 
                              variant="solid"
                              isRound
                              onClick={() => addToCart(produto)}
                              aria-label="Adicionar"
                            />
                          </Flex>
                        )}
                      </Box>
                    </Flex>
                  </Box>
                </Box>
              );
            })}
          </SimpleGrid>
        )}
      </Container>

      {/* --- BARRA FLUTUANTE DE CARRINHO (ESTILO IFOOD) --- */}
      {totalItems > 0 && (
        <Box 
          position="fixed" 
          bottom="0" 
          left="0" 
          w="100%" 
          bg="white" 
          p={4} 
          shadow="0px -4px 10px rgba(0,0,0,0.1)" 
          zIndex={999}
          borderTopRadius="xl"
        >
          <Container maxW="container.lg">
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontSize="sm" color="gray.500">Total estimado</Text>
                <Text fontSize="xl" fontWeight="bold" color="brand.600">
                  R$ {totalValue.toFixed(2)}
                </Text>
              </Box>
              
              <Button 
                as={Link}
                to="/carrinho"
                colorScheme="brand" 
                size="lg" 
                px={8}
                rounded="full"
                shadow="lg"
              >
                Ver Carrinho ({totalItems})
              </Button>
            </Flex>
          </Container>
        </Box>
      )}
    </Box>
  );
}