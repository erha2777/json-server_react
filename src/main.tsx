import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './common.css';
import '@ant-design/v5-patch-for-react-19'; //ant-design React 19 兼容
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);
