import React from 'react';
import { Download, ExternalLink, CheckCircle } from 'lucide-react';

const Downloads = () => {
  const downloads = [
    {
      title: "Multi Theft Auto (MTA)",
      description: "San Andreas multiplayer modifikasyonu - oyuna katılmak için gerekli",
      version: "v1.6.0",
      size: "~45 MB",
      features: [
        "Çoklu oyuncu desteği",
        "Özel scriptler",
        "Gelişmiş grafik seçenekleri",
        "Anti-cheat koruması"
      ],
      downloadUrl: "#",
      color: "from-blue-600 to-blue-700"
    },
    {
      title: "GTA San Andreas",
      description: "Temel oyun dosyaları - MTA ile oynamak için gerekli",
      version: "Original",
      size: "~4.7 GB",
      features: [
        "Orijinal GTA SA oyunu",
        "Tüm DLC'ler dahil",
        "Türkçe dil desteği",
        "Optimized sürüm"
      ],
      downloadUrl: "#",
      color: "from-cyan-600 to-cyan-700"
    }
  ];

  return (
    <section id="downloads" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            İndirmeler
          </h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Oyuna başlamak için gerekli dosyaları indirin ve kurulum talimatlarını takip edin
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {downloads.map((item, index) => (
            <div
              key={index}
              className="bg-slate-800/50 rounded-xl border border-blue-500/30 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300 overflow-hidden group"
            >
              <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">
                    {item.version}
                  </span>
                </div>
                
                <p className="text-blue-200 mb-6">{item.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm text-blue-300 mb-4">
                    <span>Dosya Boyutu:</span>
                    <span className="font-semibold">{item.size}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-white font-semibold mb-3">Özellikler:</h4>
                    {item.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-blue-200 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r ${item.color} text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 group-hover:scale-105`}>
                    <Download className="w-4 h-4" />
                    <span>İndir</span>
                  </button>
                  
                  <button className="px-4 py-3 border border-blue-500/50 text-blue-300 rounded-lg hover:bg-blue-500/10 transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-slate-800/30 rounded-xl p-8 border border-blue-500/20 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">Kurulum Talimatları</h3>
          <div className="grid md:grid-cols-2 gap-6 text-blue-200">
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">1. GTA San Andreas</h4>
              <p className="text-sm mb-4">Önce GTA San Andreas'ı indirin ve kurun. Oyun tamamen kurulana kadar bekleyin.</p>
              
              <h4 className="font-semibold text-blue-300 mb-2">2. Multi Theft Auto</h4>
              <p className="text-sm">MTA'yı indirin ve kurun. Kurulum sırasında GTA SA klasörünü otomatik bulacaktır.</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">3. Sunucuya Bağlanma</h4>
              <p className="text-sm mb-4">MTA'yı açın, "Browse Servers" sekmesine gidin ve "JantiRolePlay" aratın.</p>
              
              <h4 className="font-semibold text-blue-300 mb-2">4. Oyuna Başlama</h4>
              <p className="text-sm">Sunucuya çift tıklayarak bağlanın ve roleplay deneyiminizi yaşamaya başlayın!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Downloads;