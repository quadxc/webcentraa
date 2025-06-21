import React from 'react';
import { Heart, Code, Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-blue-500/30">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Centra Roleplay</span>
            </div>
            <p className="text-blue-200 text-sm mb-4">
              San Andreas'ın en kaliteli roleplay sunucusu. Gerçekçi roleplay deneyimi için bizimle oyun oynayın.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center border border-blue-500/30 hover:border-blue-400/50 transition-colors cursor-pointer">
                <span className="text-blue-400">D</span>
              </div>
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center border border-blue-500/30 hover:border-blue-400/50 transition-colors cursor-pointer">
                <span className="text-blue-400">F</span>
              </div>
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center border border-blue-500/30 hover:border-blue-400/50 transition-colors cursor-pointer">
                <span className="text-blue-400">T</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Sunucu Kuralları</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Başvuru Formu</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Yaşanan Problemler</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Güncelleme Notları</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Topluluk</h3>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Discord Sunucusu</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Etkinlikler</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Rehberler</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-500/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-blue-200 text-sm">
              © 2024 Centra Roleplay. Tüm hakları saklıdır.
            </div>
            
            <div className="flex items-center space-x-8 text-sm">
              <div className="flex items-center space-x-2 text-blue-300">
                <Users className="w-4 h-4" />
                <span>Project Leader - <span className="text-blue-400 font-semibold">linecstacy</span></span>
              </div>
              
              <div className="flex items-center space-x-2 text-blue-300">
                <Code className="w-4 h-4" />
                <span>FullStack Developer - <span className="text-blue-400 font-semibold">expect</span></span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-blue-200/60 text-xs flex items-center justify-center space-x-1">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-400" />
              <span>for the gaming community</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;