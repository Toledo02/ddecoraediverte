const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});