const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// Rota de Login Simples
app.post('/login', (req, res) => {
  const { login, password } = req.body; // Recebe os dois
  
  const validLogin = process.env.ADMIN_LOGIN;
  const validPassword = process.env.ADMIN_PASSWORD;

  // Verifica se OS DOIS batem
  if (login === validLogin && password === validPassword) {
    res.json({ success: true, message: 'Acesso liberado' });
  } else {
    res.status(401).json({ error: 'Usuário ou senha incorretos' });
  }
});

// Rota para listar produtos
app.get('/produtos', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { id: 'desc' }
    });
    res.json(produtos);
  } catch (error) {
    console.error(error); // Isso mostra o erro real no terminal
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Rota para criar produto
app.post('/produtos', async (req, res) => {
  try {
    const { nome, descricao, categoria, imagemUrl, preco } = req.body;

    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        categoria,
        imagemUrl,
        preco: parseFloat(preco) 
      },
    });

    res.json(produto);
  } catch (error) {
    console.error(error); // Importante: Mostra o erro detalhado no terminal do Docker
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// Rota para ATUALIZAR um produto (PUT)
app.put('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, categoria, imagemUrl, preco } = req.body;

    const produto = await prisma.produto.update({
      where: { id: Number(id) }, // Converte string "1" para numero 1
      data: {
        nome,
        descricao,
        categoria,
        imagemUrl,
        preco: parseFloat(preco) // Garante que seja número
      },
    });

    res.json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// Rota para EXCLUIR um produto (DELETE)
app.delete('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.produto.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
});

// --- ROTAS DE SERVIÇOS ---

// Listar Serviços
app.get('/servicos', async (req, res) => {
  const servicos = await prisma.servico.findMany({ where: { ativo: true } });
  res.json(servicos);
});

// Criar Serviço (Para o Admin)
app.post('/servicos', async (req, res) => {
  const { nome, preco } = req.body;
  const servico = await prisma.servico.create({
    data: { nome, preco: parseFloat(preco), ativo: true }
  });
  res.json(servico);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});