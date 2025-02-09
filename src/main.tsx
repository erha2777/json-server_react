import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './common.css';
import '@ant-design/v5-patch-for-react-19'; //ant-design React 19 兼容
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import store from '@/store/store';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </BrowserRouter>
    </StrictMode>
);
