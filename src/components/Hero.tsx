import React from 'react';
import { Play, Users, Globe } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-500/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Centra Roleplay
          </h1>
          
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 blur-lg opacity-30 rounded-lg"></div>
            <p className="relative text-xl md:text-2xl text-blue-100 bg-slate-900/50 p-6 rounded-lg border border-blue-500/30">
              En İyi Roleplay Deneyimi İçin Buradayız
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-800/50 p-6 rounded-lg border border-blue-500/30 backdrop-blur-sm hover:border-blue-400/50 transition-all">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Aktif Topluluk</h3>
              <p className="text-blue-200 text-sm">Binlerce oyuncu ile eğlenceli roleplay</p>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-lg border border-blue-500/30 backdrop-blur-sm hover:border-blue-400/50 transition-all">
              <Globe className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Kaliteli Sunucu</h3>
              <p className="text-blue-200 text-sm">7/24 kesintisiz oyun deneyimi</p>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-lg border border-blue-500/30 backdrop-blur-sm hover:border-blue-400/50 transition-all">
              <Play className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Kolay Kurulum</h3>
              <p className="text-blue-200 text-sm">Hızlı ve kolay oyuna başlama</p>
            </div>
          </div>

          <button
            onClick={() => document.getElementById('downloads')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <span className="relative">Hemen Başla</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;