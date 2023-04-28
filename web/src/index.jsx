import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Transactions from './Transactions';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/fdc3/tx" element={<Transactions />} />
            <Route path="*" element={<App />} />
        </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
