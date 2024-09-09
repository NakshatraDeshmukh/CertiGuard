import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Students from './components/Students';
import Universities from './components/Universities';
import Certificates from './components/Certificates';
import Footer from './components/Footer'; 
import './App.css';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/universities" element={<Universities />} />
        <Route path="/certificates" element={<Certificates />} />
      </Routes>
       <Footer /> 
    </Router>
  );
};

export default App;
