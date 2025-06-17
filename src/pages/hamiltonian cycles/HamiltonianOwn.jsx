import React, { useState, useEffect, useRef } from 'react';
import { Play, Zap, Trophy, Clock, Target, GitBranch } from 'lucide-react';
import { Link } from 'react-router';

const F1HamiltonianUI = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(0);
  const [matrix, setMatrix] = useState('');
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  // Grafo por defecto para la demostración
  const defaultGraph = [
    [0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0]
  ];

  // Función para parsear la matriz desde texto
  const parseMatrix = (matrixText) => {
    const lines = matrixText.trim().split('\n');
    return lines.map(line => {
      const row = line.trim().split(/\s+/).map(val => {
        const num = parseInt(val, 10);
        if (isNaN(num)) {
          throw new Error(`Valor inválido encontrado: "${val}". Solo se permiten números enteros.`);
        }
        return num;
      });
      return row;
    });
  };

  const analyzeGraph = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      let graphMatrix = null;

      // Si hay una matriz ingresada, parsearla y validarla
      if (matrix.trim()) {
        graphMatrix = parseMatrix(matrix);
        // Validar que sea una matriz cuadrada
        const size = graphMatrix.length;
        if (graphMatrix.some(row => row.length !== size)) {
          throw new Error('La matriz debe ser cuadrada');
        }
        // Validar que solo contenga 0s y 1s
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            if (graphMatrix[i][j] !== 0 && graphMatrix[i][j] !== 1) {
              throw new Error('La matriz debe contener solo valores 0 y 1');
            }
          }
        }
      }

      // Preparar el cuerpo de la petición
      const requestBody = graphMatrix ? { graph: graphMatrix } : {};

      // Llamada real al backend
      const response = await fetch('http://localhost:3000/hamiltonian-alt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
      setSelectedCycle(0); // Reset selected cycle

    } catch (err) {
      setError(err.message);
      // Si hay error, mostramos datos de demostración para que la UI siga funcionando
      if (err.message.includes('fetch')) {
        // Solo en caso de error de conexión, usar datos mock
        const mockResults = {
          message: "Usando datos de demostración (servidor no disponible)",
          nodes: graphMatrix ? graphMatrix.length : 5,
          totalCycles: 8,
          savedCycles: 5,
          time_ms: 12.34,
          cycles: [
            [0, 1, 2, 3, 4, 0],
            [0, 1, 2, 4, 3, 0],
            [0, 2, 1, 3, 4, 0],
            [0, 2, 4, 3, 1, 0],
            [0, 4, 3, 2, 1, 0]
          ]
        };
        setResults(mockResults);
      }
    } finally {
      setLoading(false);
    }
  };

  const drawTrackVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas || !results) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // Configuración de la pista
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    const nodes = results.nodes;

    // Calcular posiciones de los nodos en círculo
    const nodePositions = [];
    for (let i = 0; i < nodes; i++) {
      const angle = (i * 2 * Math.PI) / nodes - Math.PI / 2;
      nodePositions.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      });
    }

    // Obtener la matriz actual (personalizada o por defecto)
    let currentGraph = defaultGraph;
    if (matrix.trim()) {
      try {
        currentGraph = parseMatrix(matrix);
      } catch (e) {
        // Si hay error, usar grafo por defecto
        currentGraph = defaultGraph;
      }
    }

    // Dibujar conexiones del grafo (líneas grises)
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < nodes; i++) {
      for (let j = i + 1; j < nodes; j++) {
        if (currentGraph[i] && currentGraph[i][j]) {
          ctx.beginPath();
          ctx.moveTo(nodePositions[i].x, nodePositions[i].y);
          ctx.lineTo(nodePositions[j].x, nodePositions[j].y);
          ctx.stroke();
        }
      }
    }

    // Dibujar el ciclo seleccionado
    if (results.cycles && results.cycles[selectedCycle]) {
      const cycle = results.cycles[selectedCycle];
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#dc2626');
      gradient.addColorStop(0.5, '#ea580c');
      gradient.addColorStop(1, '#facc15');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 4;
      ctx.shadowColor = '#dc2626';
      ctx.shadowBlur = 10;

      ctx.beginPath();
      for (let i = 0; i < cycle.length - 1; i++) {
        const from = nodePositions[cycle[i]];
        const to = nodePositions[cycle[i + 1]];

        if (i === 0) {
          ctx.moveTo(from.x, from.y);
        }
        ctx.lineTo(to.x, to.y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Dibujar nodos
    nodePositions.forEach((pos, i) => {
      // Nodo base
      ctx.fillStyle = '#1f2937';
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Número del nodo
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i.toString(), pos.x, pos.y);

      // Efecto especial para Lewis Hamilton (nodo 44 % nodes)
      if (i === 44 % nodes) {
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 28, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  };

  useEffect(() => {
    if (results) {
      drawTrackVisualization();
    }
  }, [results, selectedCycle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const resizeCanvas = () => {
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = 400;
        drawTrackVisualization();
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      return () => window.removeEventListener('resize', resizeCanvas);
    }
  }, [results, selectedCycle]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900">
      {/* Header con efecto Lewis Hamilton */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-yellow-400/20 animate-pulse"></div>
        <div className="relative px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">44</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                    F1 Hamilton Circuit Analyzer
                  </h1>
                  <p className="text-gray-300 text-lg">Powered by Lewis Hamilton's Racing Spirit</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-mono text-sm opacity-75">STILL WE RISE</div>
                <div className="text-red-500 font-bold text-xl">#44</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Control Panel */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Zap className="w-6 h-6 text-yellow-400 mr-2" />
              Circuit Analysis Control
            </h2>
            <button
              onClick={analyzeGraph}
              disabled={loading}
              className="relative group px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Analysis
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Matrix Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Circuit Graph Matrix (Optional - Leave empty for default 5x5 circuit)
              </label>
              <div className="relative">
                <textarea
                  value={matrix}
                  onChange={(e) => setMatrix(e.target.value)}
                  placeholder={`Enter adjacency matrix (0s and 1s separated by spaces):
0 1 1 0 1
1 0 1 1 0
1 1 0 1 1
0 1 1 0 1
1 0 1 1 0`}
                  className="w-full h-32 px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 font-mono text-sm focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 resize-none"
                />
                <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-800/80 px-2 py-1 rounded">
                  Matrix Format
                </div>
              </div>
            </div>

            {/* Examples */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setMatrix('0 1 1 0 1\n1 0 1 1 0\n1 1 0 1 1\n0 1 1 0 1\n1 0 1 1 0')}
                className="px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 text-xs rounded-lg transition-colors duration-200"
              >
                5x5 Example
              </button>
              <button
                onClick={() => setMatrix('0 1 1\n1 0 1\n1 1 0')}
                className="px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 text-xs rounded-lg transition-colors duration-200"
              >
                3x3 Triangle
              </button>
              <button
                onClick={() => setMatrix('')}
                className="px-3 py-1 bg-red-700/50 hover:bg-red-600/50 text-red-300 text-xs rounded-lg transition-colors duration-200"
              >
                Clear
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-900/30 border border-red-600/50 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Dashboard */}
        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Statistics Panel */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/20">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Target className="w-5 h-5 text-red-500 mr-2" />
                Race Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-4 border border-gray-600/30">
                  <div className="text-gray-400 text-sm font-medium">Circuit Nodes</div>
                  <div className="text-2xl font-bold text-yellow-400">{results.nodes}</div>
                </div>
                <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 rounded-xl p-4 border border-red-600/30">
                  <div className="text-gray-400 text-sm font-medium">Total Circuits</div>
                  <div className="text-2xl font-bold text-red-400">{results.totalCycles}</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 rounded-xl p-4 border border-yellow-600/30">
                  <div className="text-gray-400 text-sm font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Lap Time
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">{results.time_ms}ms</div>
                </div>
                <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-xl p-4 border border-green-600/30">
                  <div className="text-gray-400 text-sm font-medium">Saved Circuits</div>
                  <div className="text-2xl font-bold text-green-400">{results.savedCycles}</div>
                </div>
              </div>
            </div>

            {/* Circuit Selector */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/20">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <GitBranch className="w-5 h-5 text-yellow-400 mr-2" />
                Circuit Selection
              </h3>
              <div className="space-y-3">
                {results.cycles.map((cycle, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCycle(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 border ${selectedCycle === index
                        ? 'bg-gradient-to-r from-red-600/30 to-yellow-600/30 border-yellow-400/50 text-yellow-400'
                        : 'bg-gray-700/30 border-gray-600/30 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm">
                        Circuit {index + 1}: {cycle.join(' → ')}
                      </span>
                      {selectedCycle === index && (
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Track Visualization */}
        {results && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/20">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
              Circuit Visualization - Hamilton Style
              <span className="ml-4 text-sm font-normal text-gray-400">
                (Circuit {selectedCycle + 1} highlighted)
              </span>
            </h3>
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="w-full border border-gray-600/30 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-800/50"
                style={{ height: '400px' }}
              />
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-yellow-400 font-mono text-sm">
                <div>Node 44 % {results.nodes} = Lewis Hamilton Position</div>
              </div>
            </div>
          </div>
        )}

        {/* Lewis Hamilton Tribute */}
        <div className="bg-gradient-to-r from-red-900/30 to-yellow-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gradient-to-r border-red-400/20">
          <div className="text-center">
            <div className="text-6xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent mb-2">
              #44
            </div>
            <div className="text-xl text-white font-bold mb-2">LEWIS HAMILTON</div>
            <div className="text-gray-300 italic">"Still We Rise" - Finding the fastest paths through every circuit</div>
          </div>
        </div>
        <div className="text-center mt-10">
          <Link
            to="/hamiltonian-menu"
            className={`group inline-flex items-center space-x-4 px-8 py-4 text-lg font-bold text-white rounded-full border-2 border-white/20 hover:border-white/40 hover:text-red-300 bg-white/5 hover:bg-white/10 transition-all duration-500 hover:scale-105`}
          >
            <div className="w-auto h-auto p-2 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
              <Play size={14} className="scale-x-[-1]" />
            </div>
            <span className="tracking-wider">Back</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default F1HamiltonianUI;