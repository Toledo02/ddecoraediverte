import { useContext, useEffect, useState } from 'react';
import { 
  Container, Heading, VStack, HStack, Text, Button, Box, Divider, 
  Checkbox, CheckboxGroup, Stack, useToast, FormControl, FormLabel, Input,
  IconButton, Flex, SimpleGrid
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';

export default function CarrinhoPage() {
  const { cart, removeFromCart, totalValue, clearCart } = useContext(CartContext);
  
  const [servicosDisponiveis, setServicosDisponiveis] = useState([]);
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  
  const [nomeCliente, setNomeCliente] = useState('');
  const [dataFesta, setDataFesta] = useState('');
  const [localFesta, setLocalFesta] = useState('');
  
  // MUDANÇA: Agora temos Início e Fim
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFim, setHorarioFim] = useState('');
  
  const toast = useToast();

  useEffect(() => {
    async function loadServicos() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await axios.get(`${apiUrl}/servicos`);
        setServicosDisponiveis(response.data);
      } catch (error) { console.error("Erro ao buscar serviços"); }
    }
    loadServicos();
  }, []);

  const totalServicos = servicosSelecionados.reduce((acc, id) => {
    const servico = servicosDisponiveis.find(s => s.id === parseInt(id));
    return acc + (servico ? servico.preco : 0);
  }, 0);

  const valorFinal = totalValue + totalServicos;

  function handleFinalizar() {
    if (!nomeCliente || !dataFesta || !localFesta || !horarioInicio || !horarioFim) {
      toast({ title: 'Preencha todos os dados!', status: 'warning' });
      return;
    }

    let msg = `Olá! Me chamo *${nomeCliente}*.\n`;
    msg += `📅 Data: *${dataFesta}*\n`;
    msg += `⏰ Horário: Das *${horarioInicio}* às *${horarioFim}*\n`; // MUDANÇA NA MENSAGEM
    msg += `📍 Local: *${localFesta}*\n\n`;
    
    msg += `*🛒 Itens Selecionados:* \n`;
    cart.forEach(item => {
      msg += `- ${item.quantity}x ${item.nome} (R$ ${item.preco * item.quantity})\n`;
    });

    if (servicosSelecionados.length > 0) {
      msg += `\n*🛠 Serviços Adicionais:* \n`;
      servicosSelecionados.forEach(id => {
        const s = servicosDisponiveis.find(serv => serv.id === parseInt(id));
        if (s) msg += `- ${s.nome} (R$ ${s.preco})\n`;
      });
    }

    msg += `\n*💰 TOTAL ESTIMADO: R$ ${valorFinal.toFixed(2)}*`;
    
    const link = `https://wa.me/554196812677?text=${encodeURIComponent(msg)}`;
    window.open(link, '_blank');
    clearCart();
  }

  if (cart.length === 0) {
    return (
      <Container py={20} centerContent>
        <Heading color="gray.400" size="md">Seu carrinho está vazio.</Heading>
        <Button mt={4} colorScheme="brand" as="a" href="/decoracoes">Ver Decorações</Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={10}>
      <Heading mb={6} color="brand.700" fontFamily="heading">Finalizar Orçamento</Heading>

      <Box bg="white" p={6} borderRadius="xl" shadow="sm" mb={6}>
        <Heading size="sm" mb={4}>1. Itens Selecionados</Heading>
        <VStack align="stretch" spacing={4}>
          {cart.map(item => (
            <HStack key={item.id} justify="space-between">
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold">{item.nome}</Text>
                <Text fontSize="sm" color="gray.500">{item.quantity}x R$ {item.preco}</Text>
              </VStack>
              <HStack>
                <Text fontWeight="bold">R$ {item.preco * item.quantity}</Text>
                <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" variant="ghost" onClick={() => removeFromCart(item.id)} />
              </HStack>
            </HStack>
          ))}
        </VStack>
        <Divider my={4} />
        <Flex justify="space-between">
          <Text>Subtotal Itens:</Text>
          <Text fontWeight="bold">R$ {totalValue.toFixed(2)}</Text>
        </Flex>
      </Box>

      <Box bg="white" p={6} borderRadius="xl" shadow="sm" mb={6}>
        <Heading size="sm" mb={4}>2. Serviços Adicionais</Heading>
        {servicosDisponiveis.length === 0 ? (
          <Text fontSize="sm" color="gray.500">Nenhum serviço extra cadastrado.</Text>
        ) : (
          <CheckboxGroup colorScheme="brand" onChange={setServicosSelecionados}>
            <Stack spacing={3}>
              {servicosDisponiveis.map(servico => (
                <Checkbox key={servico.id} value={String(servico.id)}>
                  <Flex justify="space-between" w="100%">
                    <Text mr={4}>{servico.nome}</Text>
                    <Text fontWeight="bold" color="gray.600">+ R$ {servico.preco}</Text>
                  </Flex>
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        )}
      </Box>

      <Box bg="white" p={6} borderRadius="xl" shadow="lg" border="1px solid" borderColor="brand.200">
        <Heading size="sm" mb={4}>3. Dados da Festa</Heading>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Seu Nome</FormLabel>
            <Input value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} placeholder="Ex: Ana Maria" />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Data da Festa</FormLabel>
            <Input type="date" value={dataFesta} onChange={(e) => setDataFesta(e.target.value)} />
          </FormControl>

          {/* NOVOS CAMPOS DE HORÁRIO */}
          <SimpleGrid columns={2} spacing={4} w="full">
            <FormControl isRequired>
              <FormLabel>Início da Festa</FormLabel>
              <Input type="time" value={horarioInicio} onChange={(e) => setHorarioInicio(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Fim da Festa</FormLabel>
              <Input type="time" value={horarioFim} onChange={(e) => setHorarioFim(e.target.value)} />
            </FormControl>
          </SimpleGrid>

          <FormControl isRequired>
            <FormLabel>Local / Endereço</FormLabel>
            <Input value={localFesta} onChange={(e) => setLocalFesta(e.target.value)} placeholder="Rua das Flores, 123 - Salão X" />
          </FormControl>
          
          <Divider my={2} />
          
          <Flex justify="space-between" w="100%" fontSize="lg">
            <Text fontWeight="bold" color="gray.600">Total Final:</Text>
            <Text fontWeight="bold" color="brand.600" fontSize="2xl">R$ {valorFinal.toFixed(2)}</Text>
          </Flex>

          <Button w="full" size="lg" colorScheme="green" leftIcon={<FaWhatsapp />} onClick={handleFinalizar}>
            Enviar Orçamento no WhatsApp
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}