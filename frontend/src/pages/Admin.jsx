import { useEffect, useState } from 'react';
import {
  Box, Container, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Button, IconButton, Image, useDisclosure, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter,
  FormControl, FormLabel, Input, useToast, Flex, Textarea
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, AddIcon } from '@chakra-ui/icons';
import axios from 'axios';

export default function Admin() {
  const [produtos, setProdutos] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Estado para controlar o formulário (se é edição ou criação)
  const [produtoEditando, setProdutoEditando] = useState(null);
  
  // Dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: '',
    preco: '',
    imagemUrl: ''
  });

  // Carregar produtos ao abrir a tela
  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/produtos`);
      setProdutos(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  // Abre o modal para CRIAR novo
  function handleNovoProduto() {
    setProdutoEditando(null); // Null significa "Modo Criação"
    setFormData({ nome: '', descricao: '', categoria: '', preco: '', imagemUrl: '' });
    onOpen();
  }

  // Abre o modal para EDITAR existente
  function handleEditar(produto) {
    setProdutoEditando(produto); // Guarda quem estamos editando
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao || '',
      categoria: produto.categoria,
      preco: produto.preco,
      imagemUrl: produto.imagemUrl
    });
    onOpen();
  }

  // Função única para Salvar (decide se é POST ou PUT)
  async function handleSalvar() {
    try {
      // Validação simples
      if (!formData.nome || !formData.preco) {
        toast({ title: 'Preencha nome e preço.', status: 'warning' });
        return;
      }

      if (produtoEditando) {
        // ATUALIZAR (PUT)
        await axios.put(`${import.meta.env.VITE_API_URL}/produtos/${produtoEditando.id}`, formData);
        toast({ title: 'Produto atualizado!', status: 'success' });
      } else {
        // CRIAR (POST)
        await axios.post(`${import.meta.env.VITE_API_URL}/produtos`, formData);
        toast({ title: 'Produto criado!', status: 'success' });
      }

      carregarProdutos(); // Recarrega a tabela
      onClose(); // Fecha modal
    } catch (error) {
      toast({ title: 'Erro ao salvar.', status: 'error' });
    }
  }

  // Função de Excluir
  async function handleExcluir(id) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/produtos/${id}`);
        toast({ title: 'Produto excluído.', status: 'info' });
        carregarProdutos();
      } catch (error) {
        toast({ title: 'Erro ao excluir.', status: 'error' });
      }
    }
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading color="purple.700">Gerenciar Produtos</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="green" onClick={handleNovoProduto}>
          Novo Produto
        </Button>
      </Flex>

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

      {/* MODAL DE CADASTRO/EDIÇÃO */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {produtoEditando ? 'Editar Produto' : 'Cadastrar Novo Produto'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" gap={4}>
              <FormControl isRequired>
                <FormLabel>Nome do Item</FormLabel>
                <Input 
                  value={formData.nome} 
                  onChange={(e) => setFormData({...formData, nome: e.target.value})} 
                  placeholder="Ex: Kit Festa Tardezinha"
                />
              </FormControl>

              <Flex gap={4}>
                <FormControl isRequired>
                  <FormLabel>Categoria</FormLabel>
                  <Input 
                    value={formData.categoria} 
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})} 
                    placeholder="Ex: Móveis"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Preço (R$)</FormLabel>
                  <Input 
                    type="number"
                    value={formData.preco} 
                    onChange={(e) => setFormData({...formData, preco: e.target.value})} 
                    placeholder="0.00"
                  />
                </FormControl>
              </Flex>

              <FormControl>
                <FormLabel>URL da Imagem</FormLabel>
                <Input 
                  value={formData.imagemUrl} 
                  onChange={(e) => setFormData({...formData, imagemUrl: e.target.value})} 
                  placeholder="https://..."
                />
              </FormControl>

              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea 
                  value={formData.descricao} 
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})} 
                  placeholder="Detalhes do item..."
                />
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
            <Button colorScheme="purple" onClick={handleSalvar}>Salvar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}