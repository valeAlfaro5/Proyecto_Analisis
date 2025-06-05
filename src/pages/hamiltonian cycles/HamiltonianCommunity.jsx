import React, { useState } from 'react';
import { Play, Flag, Trophy, Timer, Zap, Grid, AlertCircle, CheckCircle } from 'lucide-react';

const F1HamiltonianUI = () => {
  const [matrix, setMatrix] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [matrixSize, setMatrixSize] = useState(5);

  // Matriz por defecto (la misma que tienes en el servidor)
  const defaultMatrix = [
    [0,1,1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,0,1,1,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,0,1,1,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,0,1,1,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,0,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,0,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,0,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,0,1,1,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,0,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,0,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,1,1,0,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,1,1,0,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1,1,0]
  ];

  const loadDefaultMatrix = () => {
    const matrixStr = defaultMatrix.map(row => row.join(',')).join('\n');
    setMatrix(matrixStr);
    setMatrixSize(15);
  };

  const generateEmptyMatrix = (size) => {
    const emptyMatrix = Array(size).fill().map(() => Array(size).fill(0));
    const matrixStr = emptyMatrix.map(row => row.join(',')).join('\n');
    setMatrix(matrixStr);
  };

  const parseMatrix = (matrixStr) => {
    try {
      const rows = matrixStr.trim().split('\n');
      return rows.map(row => 
        row.split(',').map(cell => parseInt(cell.trim()))
      );
    } catch (err) {
      throw new Error('Formato de matriz inválido');
    }
  };

  const findHamiltonianCycles = async () => {
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

      // Llamada al backend con POST
      const response = await fetch('http://localhost:3000/hamiltonian-community', {
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
      console.log(data)
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCycle = (cycle) => {
    return cycle.map(node => node + 1).join(' → ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-800 text-white p-6">
      {/* Header con temática F1 */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Flag className="w-12 h-12 text-red-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 via-white to-red-400 bg-clip-text text-transparent">
              F1 HAMILTONIAN RACE
            </h1>
            <Flag className="w-12 h-12 text-red-500" />
          </div>
          <p className="text-xl text-gray-300">Algoritmo Community - Búsqueda de Ciclos Hamiltonianos</p>
          <div className="w-32 h-1 bg-gradient-to-r from-red-500 via-white to-red-500 mx-auto mt-4"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Panel de Control */}
          <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-red-500/30">
            <div className="flex items-center gap-3 mb-6">
              <Grid className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold">CONTROL DE CARRERA</h2>
            </div>

            {/* Controles de matriz */}
            <div className="space-y-4 mb-6">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={loadDefaultMatrix}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                >
                  Cargar Circuito Por Defecto
                </button>
                <select
                  value={matrixSize}
                  onChange={(e) => {
                    const size = parseInt(e.target.value);
                    setMatrixSize(size);
                    generateEmptyMatrix(size);
                  }}
                  className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg"
                >
                  {[3,4,5,6,7,8,9,10].map(size => (
                    <option key={size} value={size}>Matriz {size}x{size}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Editor de matriz */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                MATRIZ DE ADYACENCIA (separar con comas, una fila por línea)
              </label>
              <textarea
                value={matrix}
                onChange={(e) => setMatrix(e.target.value)}
                className="w-full h-40 p-3 bg-gray-900 border border-gray-600 rounded-lg font-mono text-sm resize-none focus:border-red-500 focus:outline-none"
                placeholder="0,1,1,0,1&#10;1,0,1,1,1&#10;1,1,0,1,0&#10;0,1,1,0,1&#10;1,1,0,1,0"
              />
            </div>

            {/* Botón de ejecución */}
            <button
              onClick={findHamiltonianCycles}
              disabled={loading}
              className={`
                w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3
                ${loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg hover:shadow-red-500/25 transform hover:scale-105'
                }
              `}
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  PROCESANDO CIRCUITO...
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  INICIAR CARRERA
                </>
              )}
            </button>

            {/* Error */}
            {error && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-200">{error}</span>
              </div>
            )}
          </div>

          {/* Panel de Resultados */}
          <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-red-500/30">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold">RESULTADOS DE CARRERA</h2>
            </div>

            {results ? (
              <div className="space-y-6">
                {/* Estadísticas principales */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-600/20 to-green-500/20 p-4 rounded-lg border border-green-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-green-300">CICLOS ENCONTRADOS</span>
                    </div>
                    <div className="text-3xl font-bold text-green-400">{results.count}</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Timer className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-blue-300">TIEMPO DE EJECUCIÓN</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-400">{results.time_ms}ms</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-600/20 to-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-purple-300">NODOS EN EL CIRCUITO</span>
                  </div>
                  <div className="text-3xl font-bold text-purple-400">{results.nodes}</div>
                </div>

                {/* Lista de ciclos */}
                {results.cycles && results.cycles.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Flag className="w-5 h-5 text-yellow-500" />
                      RUTAS HAMILTONIANAS ENCONTRADAS
                    </h3>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {results.cycles.map((cycle, index) => (
                        <div key={index} className="bg-gray-800/50 p-3 rounded-lg border border-gray-600">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-yellow-400 font-bold">#{index + 1}</span>
                            <span className="text-gray-400 text-sm">Ruta:</span>
                          </div>
                          <div className="font-mono text-green-400 text-sm">
                            {formatCycle(cycle)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Flag className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Esperando datos del circuito...</p>
                <p className="text-sm">Ingresa una matriz y presiona "INICIAR CARRERA"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default F1HamiltonianUI;