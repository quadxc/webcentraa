import React from 'react';
import { Download, Users, Mail, Home } from 'lucide-react';

const Header = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm border-b border-blue-500/30 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Centra Roleplay</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center space-x-2 text-blue-300 hover:text-blue-400 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Ana Sayfa</span>
            </button>
            <button
              onClick={() => scrollToSection('downloads')}
              className="flex items-center space-x-2 text-blue-300 hover:text-blue-400 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>İndirmeler</span>
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="flex items-center space-x-2 text-blue-300 hover:text-blue-400 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>İletişim</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;