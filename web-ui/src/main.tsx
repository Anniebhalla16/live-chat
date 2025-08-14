import { GlobalStyles, StyledEngineProvider } from '@mui/material';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import './index.css';
import { store } from './redux/store.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      {/* Enable Tailwind CSS with MUI Components */}
      {/* Refer: https://mui.com/material-ui/integrations/tailwindcss/tailwindcss-v4/ */}
      <StyledEngineProvider enableCssLayer>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <App />
      </StyledEngineProvider>
    </Provider>
  </StrictMode>
);
