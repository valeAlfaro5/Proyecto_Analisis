import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Play } from 'lucide-react';

const Particion = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [hoveredOption, setHoveredOption] = useState(null);
    const navigate = useNavigate();

    const menuOptions = [
        {
            id: 'community',
            title: 'Community Algorithm',
            description: 'Standard implementation of the partitioning algorithm',
            icon: "🌐",
            path: '/Algoritmo_Comunidad'
        },
        {
            id: 'propio',
            title: 'Customized Algorithm',
            description: 'Customized and optimized implementation of the partitioning algorithm',
            icon: "🧠",
            path: '/Algoritmo_Propio'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-black flex items-center justify-center p-6">
            <div className="max-w-5xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Partitioning algorithms
                    </h1>
                    <p className="text-xl text-gray-300 opacity-90">
                        Select the type of algorithm you want to use
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-slate-400 mx-auto mt-6 rounded-full"></div>
                </div>

                {/* Menu Options */}
                <div className="grid md:grid-cols-2 gap-10">
                    {menuOptions.map((option) => (
                        <div
                            key={option.id}
                            className={`
                relative group cursor-pointer transition-all duration-700 ease-in-out
                ${hoveredOption === option.id ? 'scale-105 -translate-y-2 rotate-[2deg]' : ''}
                ${selectedOption === option.id ? 'scale-95' : ''}
              `}
                            onMouseEnter={() => setHoveredOption(option.id)}
                            onMouseLeave={() => setHoveredOption(null)}
                            onClick={() => navigate(option.path)}
                        >
                            {/* Mercedes LED Border */}
                            <div className={`
                absolute inset-0 rounded-2xl z-0 pointer-events-none
                overflow-hidden transition-opacity duration-500
                ${hoveredOption === option.id ? 'opacity-100' : 'opacity-0'}
              `}>
                                <div className="w-full h-full rounded-2xl border-[3px] border-transparent"
                                    style={{
                                        borderImage: 'linear-gradient(90deg, #00d4aa, #c0c0c0, #00d4aa) 1',
                                        animation: hoveredOption === option.id ? 'mercedesBorderGlow 3s linear infinite' : undefined
                                    }}
                                ></div>
                            </div>

                            {/* Card */}
                            <div className="
                relative z-10 bg-black/60 backdrop-blur-xl rounded-2xl p-8 h-full
                border border-white/10 transition-all duration-500
                shadow-xl group-hover:shadow-[0_0_30px_rgba(0,212,170,0.6)]
              ">
                                {/* Icon (Image) */}
                                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300 text-yellow-400">
                                    {option.icon}
                                </div>

                                <h3 className="text-2xl font-bold mb-4 text-white">
                                    {option.title}
                                </h3>

                                <p className="text-gray-300 text-md leading-relaxed mb-6">
                                    {option.description}
                                </p>

                                <div className={`
                  inline-flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300
                  bg-gradient-to-r from-cyan-400 to-slate-400 text-black group-hover:text-white group-hover:scale-105
                  shadow-lg group-hover:shadow-xl
                `}>
                                    <span>Select</span>
                                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>

                                {selectedOption === option.id && (
                                    <div className="absolute top-4 right-4">
                                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-slate-400 animate-pulse shadow-lg"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Back Button */}
                <div className="text-center mt-10">
                    <Link
                        to="/menu"
                        className={`group inline-flex items-center space-x-4 px-8 py-4 text-lg font-bold text-white rounded-full border-2 border-white/20 hover:border-white/40 hover:text-cyan-300 bg-white/5 hover:bg-white/10 transition-all duration-500 hover:scale-105`}
                    >
                        <div className="w-auto h-auto p-2 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                            <Play size={14} className="scale-x-[-1]" />
                        </div>
                        <span className="tracking-wider">Back</span>
                    </Link>
                </div>

                {/* Footer */}
                <div className="text-center mt-12">
                    <p className="text-gray-400 text-sm opacity-70">
                        Click on any option to continue
                    </p>
                </div>
            </div>

            {/* Keyframes para el efecto Mercedes */}
            <style>
                {`
          @keyframes mercedesBorderGlow {
            0% {
              border-image-source: linear-gradient(90deg, #00d4aa, #c0c0c0, #00d4aa);
            }
            100% {
              border-image-source: linear-gradient(450deg, #00d4aa, #c0c0c0, #00d4aa);
            }
          }
        `}
            </style>
        </div>
    );
};

export default Particion;