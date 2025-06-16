import { Play } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';

const ColoracionMenu = () => {
    const [selectedOption] = useState(null);
    const [hoveredOption, setHoveredOption] = useState(null);
    const navigate = useNavigate();

    const menuOptions = [
        {
            id: 'community',
            title: 'Community Algorithm',
            description: 'Standard implementation of the graph coloring algorithm: Voraz',
            icon: '🌐',
            gradient: 'from-orange-400 via-yellow-300 to-orange-500',
            path: '/coloracion-grafos-comunidad'
        },
        {
            id: 'propio',
            title: 'Customized Algorithm',
            description: 'Customized and optimized implementation of the graph coloring algorithm: Voraz',
            icon: '🧠',
            gradient: 'from-orange-400 via-yellow-300 to-orange-500',
            path: '/coloracion-grafos-propio'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-500 to-black flex items-center justify-center p-6">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-500 bg-clip-text text-transparent">
                        Graph Coloring Algorithms
                    </h1>
                    <p className="text-xl text-white/90">
                        Select the type of algorithm you want to use
                    </p>
                    <div className="w-24 h-1 bg-yellow-400 mx-auto mt-6 rounded-full"></div>
                </div>

                {/* Menu Options */}
                <div className="grid md:grid-cols-2 gap-8">
                    {menuOptions.map((option) => (
                        <div
                            key={option.id}
                            className={`
                                relative group cursor-pointer transform transition-all duration-500 ease-out
                                ${hoveredOption === option.id ? 'scale-105 -translate-y-2 rotate-[1deg]' : ''}
                                ${selectedOption === option.id ? 'scale-95' : ''}
                            `}
                            onMouseEnter={() => setHoveredOption(option.id)}
                            onMouseLeave={() => setHoveredOption(null)}
                            onClick={() => navigate(option.path)}
                        >
                            {/* LED border */}
                            {hoveredOption === option.id && (
                                <div className={`
                                    absolute -inset-1 rounded-2xl z-0 blur-sm
                                    
                                    animate-spin-slow
                                `}></div>
                            )}

                            {/* Card content */}
                            <div className="relative bg-black/80 backdrop-blur-xl rounded-2xl p-8 h-full z-10
                                border border-orange-400/30 group-hover:border-orange-200 transition-all duration-300
                                shadow-xl group-hover:shadow-orange-500/30 text-white">
                                {/* Icon */}
                                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300 text-yellow-400">
                                    {option.icon}
                                </div>

                                {/* Title */}
                                <h3 className={`
                                    text-2xl font-bold mb-4 bg-gradient-to-r ${option.gradient}
                                    bg-clip-text text-transparent group-hover:text-yellow-100 transition-all duration-300
                                `}>
                                    {option.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                    {option.description}
                                </p>

                                {/* Action Button */}
                                <div className={`
                                    inline-flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300
                                    bg-gradient-to-r ${option.gradient} text-black group-hover:text-white
                                    transform group-hover:scale-105 shadow-md
                                `}>
                                    <span>Select</span>
                                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Back Button */}
                <div className="text-center mt-10">
                    <Link
                        onClick={() => navigate(-1)}
                        className={`group inline-flex items-center space-x-4 px-8 py-4 text-lg font-bold text-white rounded-full border-2 border-white/20 hover:border-white/40 hover:text-yellow-300 bg-white/5 hover:bg-white/10 transition-all duration-500 hover:scale-105`}
                    >
                        <div className="w-auto h-auto p-2 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                            <Play size={14} className="scale-x-[-1]" />
                        </div>
                        <span className="tracking-wider">Back</span>
                    </Link>
                </div>

                {/* Footer */}
                <div className="text-center mt-12">
                    <p className="text-white/70 text-sm">
                        Click on any option to continue
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ColoracionMenu;
