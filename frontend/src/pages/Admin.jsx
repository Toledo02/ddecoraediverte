import { useEffect, useState } from 'react';
import {
  Box, Container, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Button, IconButton, Image, useDisclosure, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter,
  FormControl, FormLabel, Input, useToast, Flex, Textarea, VStack, 
  Tabs, TabList, TabPanels, Tab, TabPanel, Badge
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, AddIcon, LockIcon } from '@chakra-ui/icons';
import axios from 'axios';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Estados de Dados
  const [produtos, setProdutos] = useState([]);
  const [servicos, setServicos] = useState([]);

  // Controles de Modal (Produtos)
  const { isOpen: isProdOpen, onOpen: onProdOpen, onClose: onProdClose } = useDisclosure();
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [formProd, setFormProd] = useState({ nome: '', descricao: '', categoria: '', preco: '', imagemUrl: '' });

  // Controles de Modal (Serviços)
  const { isOpen: isServOpen, onOpen: onServOpen, onClose: onServClose } = useDisclosure();
  const [servicoEditando, setServicoEditando] = useState(null);
  const [formServ, setFormServ] = useState({ nome: '', preco: '' });

  const toast = useToast();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const loggedIn = localStorage.getItem('admin_logged_in');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
      carregarDados();
    }
  }, []);

  async function handleLogin() {
    try {
      const response = await axios.post(`${apiUrl}/login`, { login: loginInput, password: passwordInput });
      if (response.data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_logged_in', 'true');
        toast({ title: 'Bem-vinda!', status: 'success' });
        carregarDados();
      }
    } catch (error) {
      toast({ title: 'Dados incorretos', status: 'error' });
    }
  }

  function handleLogout() {
    localStorage.removeItem('admin_logged_in');
    setIsAuthenticated(false);
  }

  async function carregarDados() {
    try {
      const [resProd, resServ] = await Promise.all([
        axios.get(`${apiUrl}/produtos`),
        axios.get(`${apiUrl}/servicos`)
      ]);
      setProdutos(resProd.data);
      setServicos(resServ.data);
    } catch (error) {
      console.error(error);
    }
  }

  // --- CRUD PRODUTOS ---
  async function salvarProduto() {
    try {
      if (produtoEditando) {
        await axios.put(`${apiUrl}/produtos/${produtoEditando.id}`, formProd);
      } else {
        await axios.post(`${apiUrl}/produtos`, formProd);
      }
      carregarDados();
      onProdClose();
      toast({ title: 'Produto salvo!', status: 'success' });
    } catch (e) { toast({ title: 'Erro ao salvar', status: 'error' }); }
  }

  async function excluirProduto(id) {
    if (confirm('Excluir produto?')) {
      await axios.delete(`${apiUrl}/produtos/${id}`);
      carregarDados();
    }
  }

  // --- CRUD SERVIÇOS ---
  async function salvarServico() {
    try {
      if (servicoEditando) {
        await axios.put(`${apiUrl}/servicos/${servicoEditando.id}`, formServ);
      } else {
        await axios.post(`${apiUrl}/servicos`, formServ);
      }
      carregarDados();
      onServClose();
      toast({ title: 'Serviço salvo!', status: 'success' });
    } catch (e) { toast({ title: 'Erro ao salvar', status: 'error' }); }
  }

  async function excluirServico(id) {
    if (confirm('Excluir serviço?')) {
      await axios.delete(`${apiUrl}/servicos/${id}`);
      carregarDados();
    }
  }

  // TELA DE LOGIN
  if (!isAuthenticated) {
    return (
      <Container maxW="container.sm" py={20}>
        <VStack spacing={8} bg="white" p={10} borderRadius="2xl" shadow="xl" borderTop="6px solid" borderColor="brand.500">
          <LockIcon w={8} h={8} color="brand.600" />
          <Heading size="lg" fontFamily="heading">Área Restrita</Heading>
          <Input placeholder="Usuário" value={loginInput} onChange={e => setLoginInput(e.target.value)} />
          <Input type="password" placeholder="Senha" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
          <Button colorScheme="brand" w="full" onClick={handleLogin}>Entrar</Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading color="brand.700" fontFamily="heading">Painel Administrativo</Heading>
        <Button variant="outline" colorScheme="red" onClick={handleLogout}>Sair</Button>
      </Flex>

      <Tabs variant="enclosed" colorScheme="brand">
        <TabList>
          <Tab fontWeight="bold">📦 Produtos / Decorações</Tab>
          <Tab fontWeight="bold">🛠️ Serviços (Frete/Montagem)</Tab>
        </TabList>

        <TabPanels>
          {/* PAINEL DE PRODUTOS */}
          <TabPanel>
            <Button leftIcon={<AddIcon />} colorScheme="brand" mb={4} onClick={() => {
              setProdutoEditando(null);
              setFormProd({ nome: '', descricao: '', categoria: '', preco: '', imagemUrl: '' });
              onProdOpen();
            }}>Novo Produto</Button>
            
            <Box overflowX="auto" shadow="lg" borderRadius="xl" bg="white">
              <Table variant="simple">
                <Thead bg="brand.50"><Tr><Th>Foto</Th><Th>Nome</Th><Th>Preço</Th><Th>Ações</Th></Tr></Thead>
                <Tbody>
                  {produtos.map(p => (
                    <Tr key={p.id}>
                      <Td><Image src={p.imagemUrl} boxSize="50px" objectFit="cover" borderRadius="md" /></Td>
                      <Td fontWeight="bold">{p.nome}</Td>
                      <Td>R$ {p.preco}</Td>
                      <Td>
                        <IconButton icon={<EditIcon />} size="sm" mr={2} onClick={() => {
                          setProdutoEditando(p);
                          setFormProd(p);
                          onProdOpen();
                        }} />
                        <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => excluirProduto(p.id)} />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>

          {/* PAINEL DE SERVIÇOS */}
          <TabPanel>
            <Button leftIcon={<AddIcon />} colorScheme="blue" mb={4} onClick={() => {
              setServicoEditando(null);
              setFormServ({ nome: '', preco: '' });
              onServOpen();
            }}>Novo Serviço</Button>

            <Box overflowX="auto" shadow="lg" borderRadius="xl" bg="white">
              <Table variant="simple">
                <Thead bg="blue.50"><Tr><Th>Serviço</Th><Th>Preço</Th><Th>Ações</Th></Tr></Thead>
                <Tbody>
                  {servicos.map(s => (
                    <Tr key={s.id}>
                      <Td fontWeight="bold">{s.nome}</Td>
                      <Td>R$ {s.preco}</Td>
                      <Td>
                        <IconButton icon={<EditIcon />} size="sm" mr={2} onClick={() => {
                          setServicoEditando(s);
                          setFormServ(s);
                          onServOpen();
                        }} />
                        <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => excluirServico(s.id)} />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* MODAL PRODUTOS */}
      <Modal isOpen={isProdOpen} onClose={onProdClose} size="xl">
        <ModalOverlay /><ModalContent>
          <ModalHeader>{produtoEditando ? 'Editar Produto' : 'Novo Produto'}</ModalHeader>
          <ModalCloseButton /><ModalBody>
            <VStack spacing={4}>
              <Input placeholder="Nome" value={formProd.nome} onChange={e => setFormProd({...formProd, nome: e.target.value})} />
              <Flex gap={4} w="full">
                <Input placeholder="Categoria (ex: Decoração)" value={formProd.categoria} onChange={e => setFormProd({...formProd, categoria: e.target.value})} />
                <Input placeholder="Preço" type="number" value={formProd.preco} onChange={e => setFormProd({...formProd, preco: e.target.value})} />
              </Flex>
              <Input placeholder="URL Imagem" value={formProd.imagemUrl} onChange={e => setFormProd({...formProd, imagemUrl: e.target.value})} />
              <Textarea placeholder="Descrição" value={formProd.descricao} onChange={e => setFormProd({...formProd, descricao: e.target.value})} />
            </VStack>
          </ModalBody>
          <ModalFooter><Button onClick={salvarProduto} colorScheme="brand">Salvar</Button></ModalFooter>
        </ModalContent>
      </Modal>

      {/* MODAL SERVIÇOS */}
      <Modal isOpen={isServOpen} onClose={onServClose}>
        <ModalOverlay /><ModalContent>
          <ModalHeader>{servicoEditando ? 'Editar Serviço' : 'Novo Serviço'}</ModalHeader>
          <ModalCloseButton /><ModalBody>
            <VStack spacing={4}>
              <Input placeholder="Nome (ex: Frete Bairro X)" value={formServ.nome} onChange={e => setFormServ({...formServ, nome: e.target.value})} />
              <Input placeholder="Preço" type="number" value={formServ.preco} onChange={e => setFormServ({...formServ, preco: e.target.value})} />
            </VStack>
          </ModalBody>
          <ModalFooter><Button onClick={salvarServico} colorScheme="blue">Salvar</Button></ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}