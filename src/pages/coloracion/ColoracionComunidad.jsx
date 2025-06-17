import React, { useRef, useState } from "react";
import { Network } from "vis-network/standalone";
import { Link, useNavigate } from 'react-router';
import { colorearGrafo } from "@backend/greedy.js";
import { Play, Upload, Clock, Palette, Users, Zap } from "lucide-react";

export default function ColoracionComunidad() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [analisisData, setAnalisisData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const grafo = parseTxtToGrafo(text);
      const resultado = colorearGrafo(grafo, 1000);
      
      const coloresUsados = [...new Set(Object.values(resultado.colores))].length;
      const densidad = (grafo.edges.length * 2) / (grafo.nodes.length * (grafo.nodes.length - 1)) * 100;
      
      setAnalisisData({
        colores: coloresUsados,
        tiempo: resultado.tiempo,
        nodos: grafo.nodes.length,
        aristas: grafo.edges.length,
        densidad: densidad.toFixed(2),
        eficiencia: calculateEfficiency(grafo.nodes.length, resultado.tiempo)
      });

      const nodesWithColor = grafo.nodes.map((node) => ({
        ...node,
        color: getColor(resultado.colores[node.id])
      }));

      new Network(containerRef.current, {
        nodes: nodesWithColor,
        edges: grafo.edges,
      }, {
        nodes: { 
          shape: 'dot', 
          size: 30, 
          font: { size: 14, color: '#ffffff', face: 'Inter' },
          borderWidth: 2,
          borderColor: '#FF8000'
        },
        edges: { 
          width: 3,
          color: '#666666',
          smooth: { type: 'continuous' }
        },
        physics: {
          enabled: true,
          stabilization: { iterations: 100 }
        }
      });
    } catch (error) {
      console.error('Error procesando archivo:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateEfficiency = (nodes, tiempo) => {
    if (tiempo === 0) return 100;
    return Math.min(100, (1000 / (nodes * tiempo)) * 100).toFixed(1);
  };

  const parseTxtToGrafo = (text) => {
    const lines = text.trim().split("\n");
    const numNodes = parseInt(lines[0]);
    const edges = lines.slice(1).map(line => {
      const [from, to] = line.trim().split(" ").map(Number);
      return { from, to };
    });
    const nodes = Array.from({ length: numNodes }, (_, i) => ({
      id: i + 1,
      label: `${i + 1}`
    }));
    return { nodes, edges };
  };

  const getColor = (colorId) => {
    const f1TeamColors2025 = [
      '#FF8000', // McLaren Orange
      '#DC0000', // Ferrari Red
      '#00D2BE', // Mercedes Teal
      '#0090FF', // Alpine Blue
      '#15118C', // Red Bull Navy
      '#229971', // Aston Martin Green
      '#C92D4B', // Stake Sauber Red
      '#B6BABD', // Haas Grey
      '#4E7C9B', // RB Blue
      '#00D2BE'  // Mercedes Teal variant
    ];
    return f1TeamColors2025[(colorId - 1) % f1TeamColors2025.length] || '#666666';
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-900/85 via-black to-orange-400/85 text-white p-4">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent mb-1">
            Análisis de Coloración de Grafos
          </h1>
          <p className="text-gray-400 text-base">Algoritmo Greedy - Tema McLaren F1</p>
        </div>

        {/* File Upload */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
            <div className={`flex items-center space-x-3 px-5 py-2 rounded-lg border-2 border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-blue-500/10 hover:from-orange-500/20 hover:to-blue-500/20 transition-all duration-300 ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-orange-500/50 cursor-pointer'}`}>
              <Upload size={18} className="text-orange-400" />
              <span className="font-medium text-sm">
                {isProcessing ? 'Procesando...' : 'Seleccionar archivo .txt'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
          {/* Graph Visualization */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden flex-1 flex flex-col">
              <div className="p-3 border-b border-gray-700/50">
                <h3 className="text-lg font-semibold text-orange-400">Visualización del Grafo</h3>
              </div>
              <div 
                ref={containerRef}
                className="flex-1"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(255,128,0,0.05) 100%)'
                }}
              />
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="flex flex-col">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 p-4 flex-1 overflow-y-auto">
              <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                <Zap size={18} className="mr-2" />
                Análisis en Tiempo Real
              </h3>
              
              {analisisData ? (
                <div className="space-y-3">
                  {/* Execution Time */}
                  <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center text-orange-400">
                        <Clock size={14} className="mr-2" />
                        <span className="font-medium text-sm">Tiempo de Ejecución</span>
                      </div>
                      <span className="text-xl font-bold text-orange-300">
                        {analisisData.tiempo} ms
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Eficiencia: {analisisData.eficiencia}%
                    </div>
                  </div>

                  {/* Colors Used */}
                  <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center text-blue-400">
                        <Palette size={14} className="mr-2" />
                        <span className="font-medium text-sm">Colores Utilizados</span>
                      </div>
                      <span className="text-xl font-bold text-blue-300">
                        {analisisData.colores}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Número cromático aproximado
                    </div>
                  </div>

                  {/* Graph Stats */}
                  <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
                    <div className="flex items-center text-gray-300 mb-2">
                      <Users size={14} className="mr-2" />
                      <span className="font-medium text-sm">Estadísticas del Grafo</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nodos:</span>
                        <span className="font-medium">{analisisData.nodos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Aristas:</span>
                        <span className="font-medium">{analisisData.aristas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Densidad:</span>
                        <span className="font-medium">{analisisData.densidad}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Indicator */}
                  <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-3 border border-green-500/20">
                    <div className="text-center">
                      <div className="text-base font-bold text-green-400 mb-1">
                        {analisisData.tiempo < 1 ? 'Excelente' : 
                         analisisData.tiempo < 10 ? 'Bueno' : 
                         analisisData.tiempo < 50 ? 'Regular' : 'Lento'}
                      </div>
                      <div className="text-xs text-gray-400">
                        Rendimiento del algoritmo
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <Upload size={28} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Sube un archivo para ver el análisis</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-4">
          <Link
            onClick={() => navigate(-1)}
            className="group inline-flex items-center space-x-3 px-6 py-3 text-base font-bold text-white/80 rounded-full border-2 border-orange-500/30 hover:border-orange-500/60 hover:text-white backdrop-blur-lg bg-gradient-to-r from-orange-500/10 to-blue-500/10 hover:from-orange-500/20 hover:to-blue-500/20 transition-all duration-500 hover:scale-105"
          >
            <div className="w-auto h-auto p-2 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors duration-300">
              <Play size={12} className="scale-x-[-1]" />
            </div>
            <span className="tracking-wider">Regresar</span>
          </Link>
        </div>
      </div>
    </div>
  );
}