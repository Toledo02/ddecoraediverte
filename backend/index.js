const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient(); // Instância que conecta no banco

app.use(express.json()); // Permite ler JSON enviado no corpo da requisição
app.use(cors());

// Rota 1: Listar Produtos (Para a Vitrine)
app.get('/produtos', async (req, res) => {
    try {
        const produtos = await prisma.produto.findMany({
            where: { ativo: true }, // Só traz produtos ativos
            orderBy: { id: 'desc' } // Os mais novos primeiro
        });
        res.json(produtos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

// Rota 2: Criar Produto (Para o Admin)
app.post('/produtos', async (req, res) => {
    // Pegamos os dados que o front enviou
    const { nome, descricao, categoria, imagemUrl } = req.body;

    try {
        const novoProduto = await prisma.produto.create({
            data: {
                nome,
                descricao,
                categoria,
                imagemUrl,
                ativo: true
            }
        });
        res.status(201).json(novoProduto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API rodando na porta ${PORT}`);
});