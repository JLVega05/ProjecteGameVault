import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './components/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';    

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <React.StrictMode>
      <App />
      <ToastContainer />  {/* Coloca el ToastContainer aquí */}
    </React.StrictMode>
  </AuthProvider>
);


reportWebVitals();
