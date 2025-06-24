import React, { useState } from 'react';
import { Play, Flag, Trophy, Timer, Zap, Grid, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { Link } from 'react-router';

const F1HamiltonianUI = () => {
  const [matrix, setMatrix] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [matrixSize, setMatrixSize] = useState(5);

  // Estados para paginación de ciclos
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [showAllCycles, setShowAllCycles] = useState(false);

  // Matriz por defecto (la misma que tienes en el servidor)
  const defaultMatrix = [
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0]
  ];

  // Funciones para paginación que faltaban
  const totalPages = results && results.cycles ? Math.ceil(results.cycles.length / itemsPerPage) : 0;

  const getPaginatedCycles = () => {
    if (!results || !results.cycles) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return results.cycles.slice(startIndex, endIndex);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const loadDefaultMatrix = () => {
    const matrixStr = defaultMatrix.map(row => row.join(' ')).join('\n');
    setMatrix(matrixStr);
    setMatrixSize(15);
  };

  const generateEmptyMatrix = (size) => {
    const emptyMatrix = Array(size).fill().map(() => Array(size).fill(0));
    const matrixStr = emptyMatrix.map(row => row.join(' ')).join('\n');
    setMatrix(matrixStr);
  };

  const parseMatrix = (matrixStr) => {
    try {
      const rows = matrixStr.trim().split('\n');
      return rows.map(row =>
        row.split(' ').map(cell => parseInt(cell.trim()))
      );
    } catch (err) {
      throw new Error('Invalid matrix format');
    }
  };

  const findHamiltonianCycles = async () => {
    setLoading(true);
    setError('');
    setResults(null);
    setCurrentPage(1); // Reset pagination when getting new results

    try {
      let graphMatrix = null;

      // Si hay una matriz ingresada, parsearla y validarla
      if (matrix.trim()) {
        graphMatrix = parseMatrix(matrix);
        // Validar que sea una matriz cuadrada
        const size = graphMatrix.length;
        if (graphMatrix.some(row => row.length !== size)) {
          throw new Error('Matrix must be square');
        }
        // Validar que solo contenga 0s y 1s
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            if (graphMatrix[i][j] !== 0 && graphMatrix[i][j] !== 1) {
              throw new Error('Matrix must contain only 0 and 1 values');
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
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
      setShowAllCycles(false); // Reset show all cycles when getting new results
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCycle = (cycle) => {
    return cycle.map(node => node + 1).join(' → ');
  };

  // Función para descargar los resultados en JSON
  const downloadResults = () => {
    if (!results || !results.cycles) return;

    const dataToDownload = {
      metadata: {
        timestamp: new Date().toISOString(),
        algorithm: "Community Algorithm",
        matrix_size: results.nodes,
        total_cycles_found: results.totalCycles,
        execution_time_ms: results.time_ms
      },
      cycles: results.cycles.map((cycle, index) => ({
        id: index + 1,
        path_numeric: cycle,
        path_letters: formatCycle(cycle),
        length: cycle.length
      })),
      statistics: {
        total_cycles: results.totalCycles,
        nodes_count: results.nodes,
        execution_time: results.time_ms,
        average_cycle_length: results.cycles.length > 0
          ? (results.cycles.reduce((sum, cycle) => sum + cycle.length, 0) / results.cycles.length).toFixed(2)
          : 0
      }
    };

    const jsonString = JSON.stringify(dataToDownload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `hamiltonian_cycles_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          <p className="text-xl text-gray-300">Community Algorithm - Hamiltonian Cycles Search</p>
          <div className="w-32 h-1 bg-gradient-to-r from-red-500 via-white to-red-500 mx-auto mt-4"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Panel de Control */}
          <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-red-500/30">
            <div className="flex items-center gap-3 mb-6">
              <Grid className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold">RACE CONTROL</h2>
            </div>

            {/* Controles de matriz */}
            <div className="space-y-4 mb-6">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={loadDefaultMatrix}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                >
                  Load Default Circuit
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
                  {[3, 4, 5, 6, 7, 8, 9, 10].map(size => (
                    <option key={size} value={size}>Matrix {size}x{size}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Editor de matriz */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                ADJACENCY MATRIX (separate with spaces, one row per line)
              </label>
              <textarea
                value={matrix}
                onChange={(e) => setMatrix(e.target.value)}
                className="w-full h-40 p-3 bg-gray-900 border border-gray-600 rounded-lg font-mono text-sm resize-none focus:border-red-500 focus:outline-none"
                placeholder="0 1 1 0 1&#10;1 0 1 1 1&#10;1 1 0 1 0&#10;0 1 1 0 1&#10;1 1 0 1 0"
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
                  PROCESSING CIRCUIT...
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  START RACE
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
              <h2 className="text-2xl font-bold">RACE RESULTS</h2>
            </div>

            {results ? (
              <div className="space-y-6">
                {/* Estadísticas principales */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-600/20 to-green-500/20 p-4 rounded-lg border border-green-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-green-300">CYCLES FOUND</span>
                    </div>
                    <div className="text-3xl font-bold text-green-400">{results.totalCycles}</div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Timer className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-blue-300">EXECUTION TIME</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-400">{results.time_ms}ms</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-600/20 to-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-purple-300">CIRCUIT NODES</span>
                  </div>
                  <div className="text-3xl font-bold text-purple-400">{results.nodes}</div>
                </div>

                {/* Lista de ciclos con manejo inteligente */}
                {results.cycles && results.cycles.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Flag className="w-5 h-5 text-yellow-500" />
                        HAMILTONIAN ROUTES FOUND
                      </h3>

                      <div className="flex items-center gap-3">
                        {/* Botón de descarga */}
                        <button
                          onClick={downloadResults}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 text-sm"
                          title="Download results in JSON"
                        >
                          <Download className="w-4 h-4" />
                          Download JSON
                        </button>

                        {/* Advertencia para muchos ciclos */}
                        {results.cycles.length > 100 && !showAllCycles && (
                          <div className="text-orange-400 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>Many results detected</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Controles de visualización */}
                    <div className="mb-4 p-3 bg-gray-800/30 rounded-lg border border-gray-600">
                      {results.cycles.length <= 100 ? (
                        // Mostrar todos si son pocos
                        <p className="text-green-400 text-sm">
                          ✅ Showing all {results.cycles.length} cycles found
                        </p>
                      ) : (
                        // Controles para muchos ciclos
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-yellow-400 text-sm">
                              ⚠️ Found {results.cycles.length.toLocaleString()} cycles
                            </p>
                            <button
                              onClick={() => setShowAllCycles(!showAllCycles)}
                              className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${showAllCycles
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                            >
                              {showAllCycles ? 'Hide List' : 'View Complete List'}
                            </button>
                          </div>

                          {showAllCycles && (
                            <div className="flex items-center gap-4 flex-wrap">
                              <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-300">Cycles per page:</label>
                                <select
                                  value={itemsPerPage}
                                  onChange={(e) => {
                                    setItemsPerPage(parseInt(e.target.value));
                                    setCurrentPage(1);
                                  }}
                                  className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                                >
                                  <option value={25}>25</option>
                                  <option value={50}>50</option>
                                  <option value={100}>100</option>
                                  <option value={200}>200</option>
                                </select>
                              </div>

                              <div className="text-sm text-gray-300">
                                Page {currentPage} of {totalPages}
                                ({((currentPage - 1) * itemsPerPage + 1).toLocaleString()} - {Math.min(currentPage * itemsPerPage, results.cycles.length).toLocaleString()})
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Renderizado condicional de ciclos */}
                    {(results.cycles.length <= 100 || showAllCycles) && (
                      <>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {(results.cycles.length <= 100 ? results.cycles : getPaginatedCycles()).map((cycle, index) => {
                            const displayIndex = results.cycles.length <= 100 ? index : (currentPage - 1) * itemsPerPage + index;
                            return (
                              <div key={displayIndex} className="bg-gray-800/50 p-3 rounded-lg border border-gray-600">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-yellow-400 font-bold">#{displayIndex + 1}</span>
                                  <span className="text-gray-400 text-sm">Route:</span>
                                </div>
                                <div className="font-mono text-green-400 text-sm">
                                  {formatCycle(cycle)}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Paginación */}
                        {showAllCycles && totalPages > 1 && (
                          <div className="mt-4 flex items-center justify-center gap-2">
                            <button
                              onClick={() => goToPage(1)}
                              disabled={currentPage === 1}
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm"
                            >
                              ⏮️
                            </button>
                            <button
                              onClick={() => goToPage(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm"
                            >
                              ⏪
                            </button>

                            {/* Páginas numeradas */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              const startPage = Math.max(1, currentPage - 2);
                              const pageNum = startPage + i;
                              if (pageNum > totalPages) return null;

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => goToPage(pageNum)}
                                  className={`px-3 py-1 rounded text-sm ${pageNum === currentPage
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}

                            <button
                              onClick={() => goToPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm"
                            >
                              ⏩
                            </button>
                            <button
                              onClick={() => goToPage(totalPages)}
                              disabled={currentPage === totalPages}
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm"
                            >
                              ⏭️
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    {/* Mensaje cuando no se muestran ciclos */}
                    {results.cycles.length > 100 && !showAllCycles && (
                      <div className="text-center py-8 text-gray-400 bg-gray-800/30 rounded-lg">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
                        <p className="text-lg mb-2">List hidden for performance</p>
                        <p className="text-sm">
                          Too many cycles were found to display all at once.<br />
                          Click "View Complete List" to explore the results.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Flag className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Waiting for circuit data...</p>
                <p className="text-sm">Enter a matrix and press "START RACE"</p>
              </div>
            )}
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