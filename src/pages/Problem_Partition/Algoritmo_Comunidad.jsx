import { Play } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";

const componentsList = [
  { id: 1, name: "Batería", weight: 5000 },
  { id: 2, name: "Freno", weight: 3000 },
  { id: 3, name: "Sensor", weight: 1000 },
  { id: 4, name: "Tanque", weight: 6000 },
  { id: 5, name: "Radiador", weight: 4000 },
];

// Simulated partitionComponents function
const partitionComponents = (components) => {
  const totalWeight = components.reduce((sum, comp) => sum + comp.weight, 0);
  const targetWeight = totalWeight / 2;

  let left = [];
  let right = [];
  let leftWeight = 0;

  // Simple greedy approach for demo
  components.forEach(comp => {
    if (leftWeight + comp.weight <= targetWeight) {
      left.push(comp);
      leftWeight += comp.weight;
    } else {
      right.push(comp);
    }
  });

  return { left, right };
};

function CommunityF1Balancer() {
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
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black flex flex-col">
      {/* Compact Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-gray-800/80 to-slate-800/80 backdrop-blur-sm border-b border-gray-700/50 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              🏎️ MERCEDES F1 COMUNIDAD
            </h1>
            <p className="text-sm text-gray-400 font-semibold">Sistema de Balanceado Colaborativo</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-lg font-bold text-sm ${balanced ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
              {balanced ? "✅ BALANCEADO" : "⚠️ DESEQUILIBRIO"}
            </div>
            <div className="text-teal-400 font-semibold text-sm">
              ⏱️ {executionTime} ms
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col px-6 py-4 min-h-0">
        {/* Components Selection - Compact */}
        <div className="flex-shrink-0 mb-4">
          <div className="flex justify-center space-x-3">
            {componentsList.map((comp) => (
              <div
                key={comp.id}
                className={`cursor-pointer transition-all duration-300 ${selected?.id === comp.id ? "scale-110" : "hover:scale-105"
                  }`}
                onClick={() => setSelected(comp)}
              >
                <div className={`rounded-xl px-4 py-3 text-center border-2 transition-all duration-300 ${selected?.id === comp.id
                    ? "border-teal-400 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 shadow-lg shadow-teal-400/20"
                    : "border-gray-600 bg-gradient-to-br from-gray-700/80 to-gray-800/80 hover:border-gray-500"
                  }`}>
                  <p className="font-bold text-white text-sm">{comp.name}</p>
                  <p className="text-xs text-gray-300">{comp.weight}kg</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Balance Zones - Takes remaining space */}
        <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
          {/* Left Side */}
          <div
            className="cursor-pointer group transition-all duration-300 hover:scale-[1.01] flex flex-col"
            onClick={() => handleDrop("left")}
          >
            <div className="flex-1 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl border-2 border-gray-700/50 hover:border-teal-400/30 shadow-2xl flex flex-col">
              {/* Header */}
              <div className="flex-shrink-0 p-4 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-3 animate-pulse"></div>
                    <h3 className="text-lg font-black text-white">LADO IZQUIERDO</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-white">{leftWeight}</div>
                    <div className="text-xs text-gray-400">kg</div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-4 overflow-hidden">
                {leftSide.length === 0 ? (
                  <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-600 rounded-xl">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🎯</div>
                      <p className="text-gray-500 text-sm">Suelta aquí</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 h-full overflow-y-auto">
                    {leftSide.map((comp, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-gray-700/60 to-gray-800/60 rounded-lg p-3 border border-gray-600/50">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-semibold text-sm">{comp.name}</span>
                          <span className="text-gray-300 font-bold text-sm">{comp.weight}kg</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div
            className="cursor-pointer group transition-all duration-300 hover:scale-[1.01] flex flex-col"
            onClick={() => handleDrop("right")}
          >
            <div className="flex-1 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl border-2 border-gray-700/50 hover:border-teal-400/30 shadow-2xl flex flex-col">
              {/* Header */}
              <div className="flex-shrink-0 p-4 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
                    <h3 className="text-lg font-black text-white">LADO DERECHO</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-white">{rightWeight}</div>
                    <div className="text-xs text-gray-400">kg</div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-4 overflow-hidden">
                {rightSide.length === 0 ? (
                  <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-600 rounded-xl">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🎯</div>
                      <p className="text-gray-500 text-sm">Suelta aquí</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 h-full overflow-y-auto">
                    {rightSide.map((comp, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-gray-700/60 to-gray-800/60 rounded-lg p-3 border border-gray-600/50">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-semibold text-sm">{comp.name}</span>
                          <span className="text-gray-300 font-bold text-sm">{comp.weight}kg</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex-shrink-0 mt-4 flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 text-sm"
              onClick={resetSides}
            >
              🔄 RESET
            </button>
            <button
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold hover:from-teal-400 hover:to-emerald-400 transition-all duration-300 text-sm"
              onClick={balanceAutomatically}
            >
              🤖 AUTO
            </button>
          </div>

          <Link to="/Particion">
            <button className="group inline-flex items-center space-x-3 px-6 py-2 text-sm font-bold text-gray-300 rounded-2xl border border-gray-700 hover:border-teal-400 hover:text-teal-400 bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300">
              <div className="w-auto h-auto p-2 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                <Play size={14} className="scale-x-[-1]" />
              </div>
              <span>Back</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CommunityF1Balancer;