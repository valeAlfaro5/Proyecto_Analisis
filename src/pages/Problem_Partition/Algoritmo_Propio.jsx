import { Play } from "lucide-react";
import React, { useState } from "react";
import { partitionComponents } from "@backend/PPartition";
import { Link } from "react-router";

const componentsList = [
  { id: 1, name: "Batería", weight: 5000 },
  { id: 2, name: "Freno", weight: 3000 },
  { id: 3, name: "Sensor", weight: 1000 },
  { id: 4, name: "Tanque", weight: 6000 },
  { id: 5, name: "Radiador", weight: 4000 },
];

// Simulated partitionComponents function
// const partitionComponents = (components) => {
//   const totalWeight = components.reduce((sum, comp) => sum + comp.weight, 0);
//   const targetWeight = totalWeight / 2;

//   let left = [];
//   let right = [];
//   let leftWeight = 0;

//   // Simple greedy approach for demo
//   components.forEach(comp => {
//     if (leftWeight + comp.weight <= targetWeight) {
//       left.push(comp);
//       leftWeight += comp.weight;
//     } else {
//       right.push(comp);
//     }
//   });

//   return { left, right };
// };

function MercedesF1Balancer() {
  const [leftSide, setLeftSide] = useState([]);
  const [rightSide, setRightSide] = useState([]);
  const [selected, setSelected] = useState(null);
  const [executionTime, setExecutionTime] = useState(0);

  const handleDrop = (side) => {
    if (!selected) return;

    const updatedLeft = side === "left" ? [...leftSide, selected] : leftSide;
    const updatedRight = side === "right" ? [...rightSide, selected] : rightSide;
    const updatedAll = [...updatedLeft, ...updatedRight];

    const start = performance.now();
    const result = partitionComponents(updatedAll);
    const end = performance.now();

    setLeftSide(result.left);
    setRightSide(result.right);
    setExecutionTime((end - start).toFixed(2));
    setSelected(null);
  };

  const balanceAutomatically = () => {
    const currentComponents = [...leftSide, ...rightSide];
    const start = performance.now();
    const result = partitionComponents(currentComponents);
    const end = performance.now();

    setLeftSide(result.left);
    setRightSide(result.right);
    setExecutionTime((end - start).toFixed(2));
  };

  const resetSides = () => {
    setLeftSide([]);
    setRightSide([]);
    setExecutionTime(0);
  };

  const getWeight = (arr) => arr.reduce((sum, item) => sum + item.weight, 0);
  const leftWeight = getWeight(leftSide);
  const rightWeight = getWeight(rightSide);
  const balanced = leftWeight === rightWeight;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header with Mercedes styling */}
      <div className="relative overflow-hidden">
        <div className="relative px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-5xl font-black mb-4">
                <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Weight Balance System
                </span>
              </h1>
              <div className="mt-4 w-32 h-1 bg-gradient-to-r from-teal-400 to-emerald-400 mx-auto rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-12">
        {/* Components Selection Panel */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-200 mb-6 flex items-center">
                <div className="w-3 h-3 bg-teal-400 rounded-full mr-3"></div>
                SELECCIONAR COMPONENTES
              </h2>
              <div className="grid grid-cols-5 gap-4">
                {componentsList.map((comp) => (
                  <div
                    key={comp.id}
                    className={`group cursor-pointer transition-all duration-300 ${selected?.id === comp.id
                        ? "scale-105 transform"
                        : "hover:scale-102 transform"
                      }`}
                    onClick={() => setSelected(comp)}
                  >
                    <div className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${selected?.id === comp.id
                        ? "border-teal-400 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 shadow-lg shadow-teal-400/25"
                        : "border-gray-600 bg-gradient-to-br from-gray-700/50 to-gray-800/50 hover:border-gray-500 hover:shadow-lg"
                      }`}>
                      <div className="p-4 text-center">
                        <p className="font-bold text-white text-lg">{comp.name}</p>
                        <p className="text-gray-300 text-sm mt-1">{comp.weight} kg</p>
                      </div>
                      {selected?.id === comp.id && (
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-transparent pointer-events-none"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Balance Panels */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Left Side Panel */}
          <div
            className="group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            onClick={() => handleDrop("left")}
          >
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl hover:shadow-teal-400/10 transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-200 flex items-center">
                    <div className="w-4 h-4 bg-red-400 rounded-full mr-3"></div>
                    LADO IZQUIERDO
                  </h2>
                  <div className="text-right">
                    <p className="text-3xl font-black text-white">{leftWeight}</p>
                    <p className="text-sm text-gray-400">kg</p>
                  </div>
                </div>

                <div className="min-h-[200px]">
                  {leftSide.length === 0 ? (
                    <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-600 rounded-xl">
                      <p className="text-gray-500 text-lg">Arrastra componentes aquí</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {leftSide.map((comp, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-lg p-4 border border-gray-600">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-semibold">{comp.name}</span>
                            <span className="text-gray-300 font-bold">{comp.weight} kg</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Panel */}
          <div
            className="group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            onClick={() => handleDrop("right")}
          >
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl hover:shadow-teal-400/10 transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-200 flex items-center">
                    <div className="w-4 h-4 bg-blue-400 rounded-full mr-3"></div>
                    LADO DERECHO
                  </h2>
                  <div className="text-right">
                    <p className="text-3xl font-black text-white">{rightWeight}</p>
                    <p className="text-sm text-gray-400">kg</p>
                  </div>
                </div>

                <div className="min-h-[200px]">
                  {rightSide.length === 0 ? (
                    <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-600 rounded-xl">
                      <p className="text-gray-500 text-lg">Arrastra componentes aquí</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {rightSide.map((comp, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-lg p-4 border border-gray-600">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-semibold">{comp.name}</span>
                            <span className="text-gray-300 font-bold">{comp.weight} kg</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Panel */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <div className={`flex items-center text-xl font-bold ${balanced ? "text-emerald-400" : "text-red-400"}`}>
                    <span className="text-2xl mr-3">{balanced ? "✅" : "⚠️"}</span>
                    {balanced ? "PESO BALANCEADO" : "DESEQUILIBRIO DETECTADO"}
                  </div>

                  <div className="flex items-center text-teal-400 text-lg font-semibold">
                    <span className="text-xl mr-2">⏱️</span>
                    Tiempo: {executionTime} ms
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 border border-gray-600 hover:border-gray-500 shadow-lg"
                    onClick={resetSides}
                  >
                    RESETEAR
                  </button>
                  <button
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold hover:from-teal-400 hover:to-emerald-400 transition-all duration-300 shadow-lg hover:shadow-teal-400/25"
                    onClick={balanceAutomatically}
                  >
                    BALANCEAR AUTO
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="text-center mt-10">
          <Link
            to="/Particion"
            className={`group inline-flex items-center space-x-4 px-8 py-4 text-lg font-bold text-white rounded-full border-2 border-white/20 hover:border-white/40 hover:text-cyan-300 bg-white/5 hover:bg-white/10 transition-all duration-500 hover:scale-105`}
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
}

export default MercedesF1Balancer;