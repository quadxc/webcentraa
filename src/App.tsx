import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Downloads from './components/Downloads';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <Hero />
      <Downloads />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;