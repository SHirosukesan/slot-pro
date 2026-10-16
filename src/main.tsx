import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// 数字・ロゴ用フォント（端末に同梱するのでオフラインでも崩れない）
import '@fontsource/chakra-petch/latin-600.css';
import '@fontsource/chakra-petch/latin-700.css';
import '@fontsource/chakra-petch/latin-700-italic.css';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
