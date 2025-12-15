import { useEffect, useState } from 'react';
import { 
  Box, Container, Grid, Heading, Text, Image, Button, Badge, 
  Flex, Spinner, Center, useToast, IconButton, HStack,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, 
  ModalCloseButton, ModalFooter, Input, FormControl, FormLabel,
  useDisclosure
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';

// Importamos nosso contexto do carrinho
import { useCart } from '../contexts/CartContext';

function Vitrine() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para o formulário de checkout
  const [nomeCliente, setNomeCliente] = useState('');
  const [dataFesta, setDataFesta] = useState('');

  const toast = useToast();
  
  // Controle do Modal de Checkout
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Pegamos as funções do carrinho
  const { cart, addToCart, removeFromCart, totalValue, generateWhatsAppMessage } = useCart();

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/produtos`);
        setProdutos(response.data);
      } catch (error) {
        toast({
          title: 'Erro de conexão',
          description: "Verifique se o backend está rodando.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProdutos();
  }, []);

  // Função auxiliar para saber a quantidade de um item específico no carrinho
  function getQuantity(produtoId) {
    const item = cart.find(i => i.id === produtoId);
    return item ? item.quantity : 0;
  }

  // Função que envia o Zap
  function handleSendWhatsapp() {
    if (!nomeCliente || !dataFesta) {
      toast({
        title: 'Campos obrigatórios',
        description: "Por favor, preencha seu nome e a data da festa.",
        status: 'warning',
      });
      return;
    }

    const link = `https://wa.me/5541999999999?text=${generateWhatsAppMessage(nomeCliente, dataFesta)}`;
    window.open(link, '_blank');
    onClose(); // Fecha o modal após enviar
  }

  return (
    <Box bg="gray.50" minH="100vh" pb="120px"> {/* Padding bottom grande para não esconder cards atrás da barra fixa */}
      
      {/* Cabeçalho */}
      <Box bg="purple.600" p={4} color="white" shadow="md" position="sticky" top={0} zIndex={10}>
        <Container maxW="container.md">
          <Flex justify="space-between" align="center">
            <Heading size="md">D' Decora e Diverte</Heading>
            {/* Opcional: Mostrar contador total de itens aqui */}
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.md" mt={6}>
        {loading ? (
          <Center h="50vh">
            <Spinner size="xl" color="purple.500" />
          </Center>
        ) : (
          <Grid templateColumns={["1fr", "1fr 1fr"]} gap={6}>
            {produtos.map((produto) => {
              const qty = getQuantity(produto.id);
              
              return (
                <Box 
                  key={produto.id} 
                  bg="white" 
                  borderRadius="lg" 
                  overflow="hidden" 
                  shadow="sm"
                  border="1px"
                  borderColor={qty > 0 ? "purple.300" : "gray.200"} // Destaca se estiver no carrinho
                  transition="all 0.2s"
                >
                  <Box position="relative">
                    <Image 
                      src={produto.imagemUrl} 
                      alt={produto.nome}
                      h="200px" 
                      w="100%" 
                      objectFit="cover"
                    />
                    {/* Preço sobre a imagem (opcional) ou no corpo */}
                  </Box>

                  <Box p={4}>
                    <Flex justify="space-between" align="center" mb={2}>
                      <Badge borderRadius="full" px="2" colorScheme="purple">
                        {produto.categoria}
                      </Badge>
                      <Text fontWeight="bold" color="green.600">
                        R$ {produto.preco.toFixed(2)}
                      </Text>
                    </Flex>
                    
                    <Heading size="md" mb={2}>
                      {produto.nome}
                    </Heading>
                    
                    <Text fontSize="sm" color="gray.600" noOfLines={2} mb={4}>
                      {produto.descricao}
                    </Text>

                    {/* Lógica dos Botões de Quantidade */}
                    {qty === 0 ? (
                      <Button 
                        w="full" 
                        colorScheme="purple" 
                        variant="outline"
                        onClick={() => addToCart(produto)}
                      >
                        Adicionar
                      </Button>
                    ) : (
                      <Flex align="center" justify="space-between" bg="purple.50" p={1} borderRadius="md">
                        <IconButton 
                          icon={<MinusIcon />} 
                          size="sm" 
                          colorScheme="purple" 
                          variant="ghost"
                          onClick={() => removeFromCart(produto.id)}
                          aria-label="Remover"
                        />
                        <Text fontWeight="bold" fontSize="lg">{qty}</Text>
                        <IconButton 
                          icon={<AddIcon />} 
                          size="sm" 
                          colorScheme="purple" 
                          variant="solid"
                          onClick={() => addToCart(produto)}
                          aria-label="Adicionar"
                        />
                      </Flex>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* BARRA INFERIOR FLUTUANTE (Checkout) */}
      {cart.length > 0 && (
        <Box 
          position="fixed" 
          bottom={0} 
          left={0} 
          right={0} 
          bg="white" 
          p={4} 
          shadow="lg" 
          borderTop="1px" 
          borderColor="gray.200"
          zIndex={20}
        >
          <Container maxW="container.md">
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontSize="sm" color="gray.500">Total Estimado</Text>
                <Text fontSize="xl" fontWeight="bold" color="purple.600">
                  R$ {totalValue.toFixed(2)}
                </Text>
              </Box>
              <Button 
                rightIcon={<FaWhatsapp />} 
                colorScheme="green" 
                size="lg"
                onClick={onOpen} // Abre o modal
              >
                Finalizar
              </Button>
            </Flex>
          </Container>
        </Box>
      )}

      {/* MODAL DE DADOS DO CLIENTE */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent mx={4}>
          <ModalHeader>Quase lá!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4} color="gray.600">
              Informe seus dados para montarmos o orçamento no WhatsApp.
            </Text>
            
            <FormControl isRequired mb={4}>
              <FormLabel>Seu Nome</FormLabel>
              <Input 
                placeholder="Ex: Maria Silva" 
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Data da Festa</FormLabel>
              <Input 
                type="date" 
                value={dataFesta}
                onChange={(e) => setDataFesta(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="green" onClick={handleSendWhatsapp}>
              Enviar Orçamento
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
}

export default Vitrine;