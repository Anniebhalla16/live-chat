import { GlobalStyles, StyledEngineProvider } from '@mui/material';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Enable Tailwind CSS with MUI Components */}
    {/* Refer: https://mui.com/material-ui/integrations/tailwindcss/tailwindcss-v4/ */}
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <App />
    </StyledEngineProvider>
  </StrictMode>
);
