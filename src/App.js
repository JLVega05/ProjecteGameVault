import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './components/Signup';
import Login from './components/Login';
import Explorar from './pages/Explorar.js';
import { AuthProvider } from './components/AuthContext';
import UserProfile from './pages/Usuario';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/explorar" element={<Explorar />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
