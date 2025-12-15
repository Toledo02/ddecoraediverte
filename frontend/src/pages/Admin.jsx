import { useEffect, useState } from 'react';
import {
  Box, Container, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Button, IconButton, Image, useDisclosure, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter,
  FormControl, FormLabel, Input, useToast, Flex, Textarea, VStack, Text
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, AddIcon, LockIcon } from '@chakra-ui/icons';
import axios from 'axios';

export default function Admin() {
  // ESTADO DE AUTENTICAÇÃO
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Estados do CRUD (Já existentes)
  const [produtos, setProdutos] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome: '', descricao: '', categoria: '', preco: '', imagemUrl: ''
  });

  // Verifica se já fez login antes (localStorage) ao carregar a página
  useEffect(() => {
    const loggedIn = localStorage.getItem('admin_logged_in');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
      carregarProdutos();
    }
  }, []);

  // Função de Login
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
      toast({ title: 'Bem-vinda de volta!', status: 'success' });
      carregarProdutos();
    }
  } catch (error) {
    toast({ title: 'Dados incorretos', status: 'error' }); // Mensagem genérica é mais segura
  }
}

  // Função para Logout
  function handleLogout() {
    localStorage.removeItem('admin_logged_in');
    setIsAuthenticated(false);
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

  // --- FUNÇÕES DO CRUD (Iguais ao anterior) ---
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
    if (confirm('Tem certeza?')) {
      try {
        await axios.delete(`${apiUrl}/produtos/${id}`);
        toast({ title: 'Excluído.', status: 'info' });
        carregarProdutos();
      } catch (error) {
        toast({ title: 'Erro ao excluir.', status: 'error' });
      }
    }
  }

  // --- RENDERIZAÇÃO CONDICIONAL ---

  // SE NÃO ESTIVER LOGADO: MOSTRA TELA DE LOGIN
  if (!isAuthenticated) {
    return (
      <Container maxW="container.sm" py={20}>
        <VStack spacing={8} bg="white" p={8} borderRadius="lg" shadow="lg">
          <LockIcon w={10} h={10} color="purple.500" />
          <Heading size="md" textAlign="center">Área Restrita da D' Decora</Heading>

          {/* NOVO CAMPO DE USUÁRIO */}
          <FormControl>
            <FormLabel>Usuário</FormLabel>
            <Input 
              type="text" 
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              placeholder="Digite seu usuário..."
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
            />
          </FormControl>

          <Button colorScheme="purple" w="full" onClick={handleLogin}>
            Entrar
          </Button>
        </VStack>
      </Container>
    );
  }

  // SE ESTIVER LOGADO: MOSTRA O PAINEL (CÓDIGO ANTERIOR)
  return (
    <Container maxW="container.xl" py={10}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading color="purple.700">Gerenciar Produtos</Heading>
        <Flex gap={2}>
          <Button leftIcon={<AddIcon />} colorScheme="green" onClick={handleNovoProduto}>
            Novo Produto
          </Button>
          <Button variant="outline" colorScheme="red" onClick={handleLogout}>
            Sair
          </Button>
        </Flex>
      </Flex>

      {/* Tabela de Produtos */}
      <Box overflowX="auto" shadow="md" borderRadius="lg" bg="white">
        <Table variant="simple">
          <Thead bg="gray.100">
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
              <Tr key={produto.id}>
                <Td>
                  <Image src={produto.imagemUrl} boxSize="50px" objectFit="cover" borderRadius="md" fallbackSrc="https://via.placeholder.com/50" />
                </Td>
                <Td fontWeight="bold">{produto.nome}</Td>
                <Td>{produto.categoria}</Td>
                <Td isNumeric color="green.600">R$ {produto.preco.toFixed(2)}</Td>
                <Td>
                  <IconButton icon={<EditIcon />} size="sm" colorScheme="blue" mr={2} onClick={() => handleEditar(produto)} aria-label="Editar" />
                  <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => handleExcluir(produto.id)} aria-label="Excluir" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal de Cadastro (Igual ao anterior) */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{produtoEditando ? 'Editar' : 'Novo Produto'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" gap={4}>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} />
              </FormControl>
              <Flex gap={4}>
                <FormControl isRequired>
                  <FormLabel>Categoria</FormLabel>
                  <Input value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Preço</FormLabel>
                  <Input type="number" value={formData.preco} onChange={(e) => setFormData({...formData, preco: e.target.value})} />
                </FormControl>
              </Flex>
              <FormControl>
                <FormLabel>URL Imagem</FormLabel>
                <Input value={formData.imagemUrl} onChange={(e) => setFormData({...formData, imagemUrl: e.target.value})} />
              </FormControl>
              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} />
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>Cancelar</Button>
            <Button colorScheme="purple" onClick={handleSalvar}>Salvar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}