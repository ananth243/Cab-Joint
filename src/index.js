import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import App from './App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>
);
