import { extendTheme } from '@chakra-ui/react';

// Cores extraídas do logo D' Decora e Diverte
const colors = {
  brand: {
    50: '#f2fdf0', // Tom super claro para fundos
    100: '#e2fadb',
    200: '#c2f5b3',
    300: '#a4f766', // A COR PRINCIPAL DO LOGO (Verde Limão)
    400: '#8be645',
    500: '#6ec72a', // Cor padrão para botões
    600: '#549e1d', // Cor de hover (ao passar o mouse)
    700: '#3d7512',
    800: '#264f08',
    900: '#102900',
  },
  // Cores de apoio (balões e borboletas)
  accent: {
    pink: '#f7a8b8',   // Rosa das borboletas
    purple: '#d8a1e3', // Lilás do balão
    yellow: '#fce792', // Amarelo do balão
    blue: '#8ecafc',   // Azul do balão
  },
};

const theme = extendTheme({
  colors,
  fonts: {
    // Vamos manter fontes limpas e modernas
    heading: `'Fredoka One', cursive, sans-serif`, // Uma fonte mais arredondada para títulos (precisa importar no index.html)
    body: `'Open Sans', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50', // Um fundo cinza bem clarinho para destacar o conteúdo colorido
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'full', // Botões arredondados combinam com o logo
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
          },
        }),
      },
    },
  },
});

export default theme;