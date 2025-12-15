import { useEffect, useState } from 'react';
import {
  Box, Container, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Button, IconButton, Image, useDisclosure, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter,
  FormControl, FormLabel, Input, useToast, Flex, Textarea, VStack, Text, Badge
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, AddIcon, LockIcon } from '@chakra-ui/icons';
import axios from 'axios';

export default function Admin() {
  // ESTADO DE AUTENTICAÇÃO
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Estados do CRUD
  const [produtos, setProdutos] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome: '', descricao: '', categoria: '', preco: '', imagemUrl: ''
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem('admin_logged_in');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
      carregarProdutos();
    }
  }, []);

  async function handleLogin() {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${apiUrl}/login`, { 
        login: loginInput,
        password: passwordInput 
      });

      if (response.data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_logged_in', 'true');
        toast({ title: 'Bem-vinda de volta!', status: 'success', position: 'top' });
        carregarProdutos();
      }
    } catch (error) {
      toast({ title: 'Dados incorretos', status: 'error', position: 'top' });
    }
  }

  function handleLogout() {
    localStorage.removeItem('admin_logged_in');
    setIsAuthenticated(false);
    setLoginInput('');
    setPasswordInput('');
  }

  async function carregarProdutos() {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.get(`${apiUrl}/produtos`);
      setProdutos(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  // --- FUNÇÕES DO CRUD ---
  function handleNovoProduto() {
    setProdutoEditando(null);
    setFormData({ nome: '', descricao: '', categoria: '', preco: '', imagemUrl: '' });
    onOpen();
  }

  function handleEditar(produto) {
    setProdutoEditando(produto);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao || '',
      categoria: produto.categoria,
      preco: produto.preco,
      imagemUrl: produto.imagemUrl
    });
    onOpen();
  }

  async function handleSalvar() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    try {
      if (!formData.nome || !formData.preco) {
        toast({ title: 'Preencha nome e preço.', status: 'warning' });
        return;
      }
      if (produtoEditando) {
        await axios.put(`${apiUrl}/produtos/${produtoEditando.id}`, formData);
        toast({ title: 'Produto atualizado!', status: 'success' });
      } else {
        await axios.post(`${apiUrl}/produtos`, formData);
        toast({ title: 'Produto criado!', status: 'success' });
      }
      carregarProdutos();
      onClose();
    } catch (error) {
      toast({ title: 'Erro ao salvar.', status: 'error' });
    }
  }

  async function handleExcluir(id) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await axios.delete(`${apiUrl}/produtos/${id}`);
        toast({ title: 'Excluído.', status: 'info' });
        carregarProdutos();
      } catch (error) {
        toast({ title: 'Erro ao excluir.', status: 'error' });
      }
    }
  }

  // --- TELA DE LOGIN ---
  if (!isAuthenticated) {
    return (
      <Container maxW="container.sm" py={20}>
        <VStack spacing={8} bg="white" p={10} borderRadius="2xl" shadow="xl" borderTop="6px solid" borderColor="brand.500">
          <Box bg="brand.100" p={4} borderRadius="full">
            <LockIcon w={8} h={8} color="brand.600" />
          </Box>
          <Heading size="lg" textAlign="center" fontFamily="heading" color="gray.700">
            Área Restrita
          </Heading>

          <FormControl>
            <FormLabel>Usuário</FormLabel>
            <Input 
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              placeholder="Digite seu usuário..."
              focusBorderColor="brand.500"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Senha</FormLabel>
            <Input 
              type="password" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Digite a senha..."
              focusBorderColor="brand.500"
            />
          </FormControl>
          
          <Button colorScheme="brand" size="lg" w="full" onClick={handleLogin}>
            Entrar no Painel
          </Button>
        </VStack>
      </Container>
    );
  }

  // --- PAINEL DE CONTROLE ---
  return (
    <Container maxW="container.xl" py={10}>
      <Flex justify="space-between" align="center" mb={8} wrap="wrap" gap={4}>
        <Heading color="brand.700" fontFamily="heading">Gerenciar Produtos</Heading>
        <Flex gap={3}>
          <Button leftIcon={<AddIcon />} colorScheme="brand" onClick={handleNovoProduto}>
            Novo Produto
          </Button>
          <Button variant="outline" colorScheme="red" onClick={handleLogout}>
            Sair
          </Button>
        </Flex>
      </Flex>

      <Box overflowX="auto" shadow="lg" borderRadius="2xl" bg="white" border="1px solid" borderColor="gray.100">
        <Table variant="simple">
          <Thead bg="brand.50">
            <Tr>
              <Th>Imagem</Th>
              <Th>Nome</Th>
              <Th>Categoria</Th>
              <Th isNumeric>Preço</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {produtos.map((produto) => (
              <Tr key={produto.id} _hover={{ bg: 'gray.50' }}>
                <Td>
                  <Image 
                    src={produto.imagemUrl} 
                    boxSize="60px" 
                    objectFit="cover" 
                    borderRadius="md" 
                    fallbackSrc="https://via.placeholder.com/60" 
                  />
                </Td>
                <Td fontWeight="bold" color="gray.700">{produto.nome}</Td>
                <Td>
                  <Badge colorScheme="green" variant="subtle">{produto.categoria}</Badge>
                </Td>
                <Td isNumeric color="brand.600" fontWeight="bold">R$ {Number(produto.preco).toFixed(2)}</Td>
                <Td>
                  <IconButton icon={<EditIcon />} size="sm" colorScheme="blue" variant="ghost" mr={2} onClick={() => handleEditar(produto)} aria-label="Editar" />
                  <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" variant="ghost" onClick={() => handleExcluir(produto.id)} aria-label="Excluir" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal de Cadastro/Edição */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader fontFamily="heading" color="brand.700">
            {produtoEditando ? 'Editar Produto' : 'Novo Produto'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome do Tema/Produto</FormLabel>
                <Input 
                  value={formData.nome} 
                  onChange={(e) => setFormData({...formData, nome: e.target.value})} 
                  focusBorderColor="brand.500"
                />
              </FormControl>
              
              <Flex gap={4} w="100%">
                <FormControl isRequired>
                  <FormLabel>Categoria</FormLabel>
                  <Input 
                    value={formData.categoria} 
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})} 
                    placeholder="Ex: Pegue e Monte"
                    focusBorderColor="brand.500"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Preço (R$)</FormLabel>
                  <Input 
                    type="number" 
                    value={formData.preco} 
                    onChange={(e) => setFormData({...formData, preco: e.target.value})} 
                    focusBorderColor="brand.500"
                  />
                </FormControl>
              </Flex>

              <FormControl>
                <FormLabel>Link da Imagem</FormLabel>
                <Input 
                  value={formData.imagemUrl} 
                  onChange={(e) => setFormData({...formData, imagemUrl: e.target.value})} 
                  placeholder="https://..."
                  focusBorderColor="brand.500"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Descrição Detalhada</FormLabel>
                <Textarea 
                  value={formData.descricao} 
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})} 
                  placeholder="O que vem no kit..."
                  focusBorderColor="brand.500"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
            <Button colorScheme="brand" onClick={handleSalvar}>
              Salvar Alterações
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}