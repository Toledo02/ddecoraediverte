import { useEffect, useState, useContext } from 'react';
import { 
  Box, Container, SimpleGrid, Image, Heading, Text, Badge, 
  Button, Flex, Spinner, Center, useToast, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, Divider
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, InfoIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';

export default function Vitrine() {
  const [produtos, setProdutos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  
  // Controle do Modal de Detalhes
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const { cart, addToCart, removeFromCart, totalValue } = useContext(CartContext);
  const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  useEffect(() => {
    async function buscarProdutos() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await axios.get(`${apiUrl}/produtos`);
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro", error);
        toast({ title: 'Erro ao carregar.', status: 'error' });
      } finally { setLoading(false); }
    }
    buscarProdutos();
  }, []);

  function getQuantity(produtoId) {
    const item = cart.find((i) => i.id === produtoId);
    return item ? item.quantity : 0;
  }

  // Função para abrir detalhes
  function verDetalhes(produto) {
    setProdutoSelecionado(produto);
    onOpen();
  }

  // Lógica: Se for decoração, maximo é 1. Se for peça avulsa, ilimitado.
  // Vamos assumir que categorias com "Decora" ou "Pegue" são únicas.
  function podeAdicionarMais(produto, qtyAtual) {
    const categoria = produto.categoria.toLowerCase();
    const ehDecoracao = categoria.includes('decora') || categoria.includes('pegue') || categoria.includes('kit');
    
    if (ehDecoracao && qtyAtual >= 1) return false;
    return true;
  }

  if (loading) return <Center h="50vh"><Spinner size="xl" color="brand.500" /></Center>;

  return (
    <Box pb={24}>
      <Container maxW="container.xl" py={10}>
        <Heading mb={2} color="brand.700" textAlign="center" fontFamily="heading">Nossos Temas</Heading>
        <Text mb={10} color="gray.500" textAlign="center">Clique na imagem para ver detalhes</Text>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {produtos.map((produto) => {
            const qty = getQuantity(produto.id);
            const permiteMais = podeAdicionarMais(produto, qty);

            return (
              <Box key={produto.id} borderWidth="1px" borderRadius="2xl" overflow="hidden" bg="white" shadow="lg" borderColor={qty > 0 ? "brand.400" : "gray.200"}>
                
                {/* Clique na imagem abre o modal */}
                <Box cursor="pointer" onClick={() => verDetalhes(produto)} position="relative">
                  <Image src={produto.imagemUrl} alt={produto.nome} h="250px" w="100%" objectFit="cover" fallbackSrc="https://via.placeholder.com/300" />
                  <Badge position="absolute" top={2} right={2} colorScheme="brand" borderRadius="md">
                    {produto.categoria}
                  </Badge>
                </Box>

                <Box p={6}>
                  <Flex justify="space-between" align="center">
                    <Heading size="md" fontFamily="heading" color="gray.700" noOfLines={1}>{produto.nome}</Heading>
                    <IconButton icon={<InfoIcon />} size="sm" variant="ghost" colorScheme="blue" onClick={() => verDetalhes(produto)} aria-label="Detalhes" />
                  </Flex>

                  <Text mt={2} color="gray.500" noOfLines={2} fontSize="sm">{produto.descricao}</Text>

                  <Flex mt={4} justify="space-between" align="center">
                    <Text fontSize="2xl" fontWeight="bold" color="brand.600">R$ {Number(produto.preco).toFixed(2)}</Text>

                    <Box h="40px" display="flex" alignItems="center">
                      {qty === 0 ? (
                        <Button colorScheme="brand" size="sm" rounded="full" onClick={() => addToCart(produto)}>
                          Adicionar
                        </Button>
                      ) : (
                        <Flex align="center" bg="brand.50" borderRadius="full" px={2} py={1}>
                          <IconButton icon={<MinusIcon />} size="xs" colorScheme="brand" variant="ghost" isRound onClick={() => removeFromCart(produto.id)} />
                          <Text mx={3} fontWeight="bold" color="brand.800">{qty}</Text>
                          
                          {/* Botão + só aparece se permitido */}
                          <IconButton 
                            icon={<AddIcon />} 
                            size="xs" 
                            colorScheme="brand" 
                            variant="solid" 
                            isRound 
                            onClick={() => addToCart(produto)} 
                            isDisabled={!permiteMais}
                            opacity={permiteMais ? 1 : 0.5}
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
      </Container>

      {/* MODAL DE DETALHES */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent borderRadius="2xl" overflow="hidden">
          {produtoSelecionado && (
            <>
              <Image src={produtoSelecionado.imagemUrl} h="300px" w="100%" objectFit="cover" />
              <ModalHeader fontFamily="heading" color="brand.700">{produtoSelecionado.nome}</ModalHeader>
              <ModalCloseButton bg="white" borderRadius="full" />
              <ModalBody pb={6}>
                <Badge colorScheme="green" mb={4} fontSize="md">{produtoSelecionado.categoria}</Badge>
                <Text fontSize="lg" color="gray.700" whiteSpace="pre-wrap">
                  {produtoSelecionado.descricao}
                </Text>
                <Divider my={4} />
                <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                  Valor: R$ {Number(produtoSelecionado.preco).toFixed(2)}
                </Text>
              </ModalBody>
              <ModalFooter bg="gray.50">
                <Button colorScheme="brand" w="full" size="lg" onClick={() => { addToCart(produtoSelecionado); onClose(); }}>
                  Adicionar ao Carrinho
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* BARRA FLUTUANTE (MANTIDA) */}
      {totalItems > 0 && (
        <Box position="fixed" bottom="0" left="0" w="100%" bg="white" p={4} shadow="0px -4px 10px rgba(0,0,0,0.1)" zIndex={999} borderTopRadius="xl">
          <Container maxW="container.lg">
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontSize="sm" color="gray.500">Total estimado</Text>
                <Text fontSize="xl" fontWeight="bold" color="brand.600">R$ {totalValue.toFixed(2)}</Text>
              </Box>
              <Button as={Link} to="/carrinho" colorScheme="brand" size="lg" px={8} rounded="full" shadow="lg">
                Ver Carrinho ({totalItems})
              </Button>
            </Flex>
          </Container>
        </Box>
      )}
    </Box>
  );
}