import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';

const ColoracionMenu = () => {
    const [selectedOption] = useState(null);
    const [hoveredOption, setHoveredOption] = useState(null);
    const navigate = useNavigate();

    const menuOptions = [
        {
            id: 'community',
            title: 'Algoritmo de Comunidad',
            description: 'Implementación estándar del algoritmo coloración de grafos: Voraz',
            icon: '🎨',
            gradient: 'from-blue-300 to-blue-500',
            path: '/coloracion-grafos-comunidad'
        },
        {
            id: 'propio',
            title: 'Algoritmo Propio',
            description: 'Implementación personalizada y optimizada del algoritmo coloración de grafos: Voraz',
            icon: '🫟',
            gradient: 'from-blue-300 to-blue-500',
            path: '/coloracion-grafos-propio'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-black  via-orange-600 to-black flex items-center justify-center p-6">
            
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Algoritmos de Coloración de Grafos
                    </h1>
                    <p className="text-xl text-gray-300 opacity-90">
                        Selecciona el tipo de algoritmo que deseas utilizar
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
                </div>

                {/* Menu Options */}
                <div className="grid md:grid-cols-2 gap-8">
                    {menuOptions.map((option) => (
                        <div
                            key={option.id}
                            className={`
                relative group cursor-pointer transform transition-all duration-500 ease-out
                ${hoveredOption === option.id ? 'scale-105 -translate-y-2' : ''}
                ${selectedOption === option.id ? 'scale-95' : ''}
              `}
                            onMouseEnter={() => setHoveredOption(option.id)}
                            onMouseLeave={() => setHoveredOption(null)}
                            onClick={() => navigate(option.path)}
                        >
                            {/* Background with gradient border */}
                            <div className={`
                absolute inset-0 bg-gradient-to-r ${option.gradient} rounded-2xl opacity-20 
                group-hover:opacity-30 transition-opacity duration-300
              `}></div>

                            {/* Card content */}
                            <div className="
                relative bg-black backdrop-blur-xl rounded-2xl p-8 h-full
                border border-white/10 group-hover:border-white/20 transition-all duration-300
                shadow-xl group-hover:shadow-2xl
              ">
                                {/* Icon */}
                                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                    {option.icon}
                                </div>

                                {/* Title */}
                                <h3 className={`
                  text-2xl font-bold mb-4 bg-gradient-to-r ${option.gradient} 
                  bg-clip-text text-transparent group-hover:text-white transition-all duration-300
                `}>
                                    {option.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-300 text-lg leading-relaxed mb-6 opacity-90">
                                    {option.description}
                                </p>

                                {/* Action Button */}
                                <div className={`
                  inline-flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300
                  bg-gradient-to-r ${option.gradient} text-white opacity-80 group-hover:opacity-100
                  transform group-hover:scale-105 shadow-lg group-hover:shadow-xl
                `}>
                                    <span>Seleccionar</span>
                                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>

                                {/* Selection indicator */}
                                {selectedOption === option.id && (
                                    <div className="absolute top-4 right-4">
                                        <div className={`
                      w-4 h-4 rounded-full bg-gradient-to-r ${option.gradient} 
                      animate-pulse shadow-lg
                    `}></div>
                                    </div>
                                )}
                            </div>

                            {/* Hover glow effect */}
                            {hoveredOption === option.id && (
                                <div className={`
                  absolute inset-0 bg-gradient-to-r ${option.gradient} rounded-2xl 
                  opacity-10 blur-xl transform scale-110 -z-10
                  animate-pulse
                `}></div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="text-center mt-5">
                    <Link
                        onClick={() => navigate(-1)}
                        className={`group inline-flex items-center space-x-4 px-8 py-4 text-lg font-bold text-white/80 rounded-full border-2 border-white/20 hover:border-white/40 hover:text-white backdrop-blur-lg bg-white/5 hover:bg-white/10 transition-all duration-500 hover:scale-105 'translate-y-0 opacity-100'`}
                        style={{ transitionDelay: '0.8s' }}
                    >
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                            <div className="w-0 h-0 border-r-4 border-r-white border-y-2 border-y-transparent mr-1"></div>
                        </div>
                        <span className="tracking-wider">Regresar</span>
                    </Link>
                </div>

                {/* Footer */}
                <div className="text-center mt-12">
                    <p className="text-gray-400 text-sm opacity-70">
                        Haz clic en cualquier opción para continuar
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ColoracionMenu;