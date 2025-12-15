import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

// Importando componentes
import Navbar from './components/Navbar';

// Importando páginas
import Home from './pages/Home';
import Vitrine from './pages/Vitrine';
import Sobre from './pages/Sobre';
import Admin from './pages/Admin';
import CarrinhoPage from './pages/CarrinhoPage';

function App() {
  return (
    <BrowserRouter>
      <Box minH="100vh" bg="gray.50">
        {/* A Navbar fica fora das Routes para aparecer em todas as telas */}
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/decoracoes" element={<Vitrine />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/carrinho" element={<CarrinhoPage />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;