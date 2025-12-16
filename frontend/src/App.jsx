import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingBar from './components/FloatingBar';

import Home from './pages/Home';
import Vitrine from './pages/Vitrine';
import Sobre from './pages/Sobre';
import Admin from './pages/Admin';
import CarrinhoPage from './pages/CarrinhoPage';

function App() {
  return (
    <Router>
      <Navbar />
      
      {/* O pb={24} garante espaço para a barra flutuante não tapar o conteúdo */}
      <Box pb={24} minH="calc(100vh - 200px)"> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/decoracoes" element={<Vitrine />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/carrinho" element={<CarrinhoPage />} />
        </Routes>
      </Box>

      <FloatingBar /> {/* Barra fixa sempre visível se tiver itens */}
      <Footer />      {/* Rodapé sempre visível */}
    </Router>
  );
}

import { Box } from '@chakra-ui/react';

export default App;