import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AudioContext } from '../context/AudioProvider';
import { Play } from 'lucide-react'

function Menu() {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate()

  const { playMenu } = useContext(AudioContext)

  // const audio = new Audio('src\\assets\\F1ThemeMusic.mp3')


  useEffect(() => {
    // Animación de entrada después de la transición
    setTimeout(() => setIsLoaded(true), 100);
    playMenu();
  }, []);

  const menuOptions = [
    {
      title: "Graph Coloring",
      description: "Race strategy optimization",
      color: "from-orange-400 to-orange-600",
      icon: "src\\assets\\cars\\mclaren.avif",
      path: "/coloracion-grafos-menu"
    },
    {
      title: "Hamiltonian Cycles",
      description: "Optimal race routes",
      color: "from-red-600 to-slate-900",
      icon: "src\\assets\\cars\\ferrari.avif",
      path: "/hamiltonian-menu"
    },
    {
      title: "Partition Problem",
      description: "Car weight division",
      color: "from-gray-800 to-emerald-500",
      icon: "src\\assets\\cars\\mercedes.avif",
      path: "/Particion"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Racing grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 h-full gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border-l border-white/10 h-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
          ))}
        </div>
      </div>

      <div className={`relative z-10 container mx-auto px-6 py-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-white to-blue-400 mb-6 animate-pulse">
            Algorithm Garage
          </h1>
          <div className="text-xl text-white/70 tracking-widest font-light">
            CHAMPIONSHIP ALGORITHMS
          </div>
        </div>

        {/* Menu Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {menuOptions.map((option, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-3xl backdrop-blur-lg bg-gradient-to-br ${option.color}  bg-opacity-10 border border-white/10 hover:bg-opacity-20 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              style={{ transitionDelay: `${index * 0.2}s` }}
              onClick={() => navigate(option.path)}
            >
              {/* Corner decorations */}
              {/* <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-white/30 rounded-tl-2xl"></div> */}
              {/* <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-white/30 rounded-br-2xl"></div> */}

              {/* Content */}
              <div className="text-center flex flex-col items-center">
                <div className="flex justify-center text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <img src={option.icon} alt="Imagen del carro formula 1" srcset="" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-white/90 transition-colors duration-300">
                  {option.title}
                </h3>
                <p className="text-white/60 text-sm font-light tracking-wide mb-6">
                  {option.description}
                </p>
                <div className="inline-flex items-center space-x-2 text-white/80 group-hover:text-white transition-colors duration-300 mt-auto">
                  <span className="text-sm font-medium tracking-wide">EXECUTE</span>
                  <div className="w-auto h-auto p-2 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <Play size={14} />
                  </div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Back button */}
        <div className="text-center">
          <Link
            to="/"
            className={`group inline-flex items-center space-x-4 px-8 py-4 text-lg font-bold text-white/80 rounded-full border-2 border-white/20 hover:border-white/40 hover:text-white backdrop-blur-lg bg-white/5 hover:bg-white/10 transition-all duration-500 hover:scale-105 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: '0.8s' }}
          >
            <div className="w-auto h-auto p-2 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
              <Play size={14} className="scale-x-[-1]" />
            </div>
            <span className="tracking-wider">RETURN TO GARAGE</span>
          </Link>
        </div>

        {/* Status indicators */}
        <div className="absolute bottom-8 right-8 flex space-x-3">
          {['READY', 'ONLINE', 'ACTIVE'].map((status, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full bg-green-400 animate-pulse`} style={{ animationDelay: `${i * 0.3}s` }}></div>
              <span className="text-white/60 text-xs font-mono">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Menu;