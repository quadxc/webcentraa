import React, { useState, useEffect } from 'react';
import { Mail, MessageCircle, ExternalLink, Users, Play } from 'lucide-react';

const Contact = () => {
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    // Fetch player count from API
    const fetchPlayerCount = async () => {
      try {
        const response = await fetch('/api/players');
        const data = await response.json();
        setPlayerCount(data.count || 0);
      } catch (error) {
        console.error('Error fetching player count:', error);
        setPlayerCount(0);
      }
    };

    fetchPlayerCount();
    // Update every 30 seconds
    const interval = setInterval(fetchPlayerCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Discord Sunucusu",
      description: "Toplulukla iletişim kurun, etkinlikleri takip edin",
      value: "discord.gg/centraroleplay",
      color: "from-indigo-600 to-purple-600"
    },
    {
      icon: Mail,
      title: "E-posta",
      description: "Resmi başvurular ve destek için",
      value: "info@centraroleplay.com.tr",
      color: "from-blue-600 to-cyan-600"
    }
  ];

  const connectToServer = () => {
    window.open('mtasa://45.147.46.164:22003', '_self');
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            İletişim
          </h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Sorularınız mı var? Topluluğa katılmak mı istiyorsunuz? Bizimle iletişime geçin!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <div
                key={index}
                className="group bg-slate-800/50 rounded-xl p-8 border border-blue-500/30 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 text-center">{method.title}</h3>
                <p className="text-blue-200 mb-4 text-center text-sm">{method.description}</p>
                
                <div className="text-center">
                  <button className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${method.color} text-white rounded-lg hover:opacity-90 transition-all`}>
                    <span className="font-medium">{method.value}</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto bg-slate-800/30 rounded-xl p-8 border border-blue-500/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Sunucu Bilgileri</h3>
            <p className="text-blue-200">Oyun içinde bizimle buluşun</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-700/50 rounded-lg p-6 border border-blue-500/20">
              <h4 className="text-blue-300 font-semibold mb-2">Sunucu IP</h4>
              <p className="text-white font-mono text-sm">mtasa://45.147.46.164:22003</p>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-6 border border-blue-500/20">
              <h4 className="text-blue-300 font-semibold mb-2">Aktif Oyuncu</h4>
              <p className="text-white font-bold text-2xl">
                {playerCount} <span className="text-sm font-normal text-blue-200">online</span>
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={connectToServer}
              className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <span className="relative flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Sunucuya Bağlan</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;