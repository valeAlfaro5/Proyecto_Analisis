import React, { useState } from "react";
import { partitionComponents } from "@backend/partitionAlgorithm";
import { Link, useNavigate } from 'react-router-dom';


const componentsList = [
  { id: 1, name: "Batería", weight: 5000 },
  { id: 2, name: "Freno", weight: 3000 },
  { id: 3, name: "Sensor", weight: 1000 },
  { id: 4, name: "Tanque", weight: 6000 },
  { id: 5, name: "Radiador", weight: 4000 },
];

function Algoritmo_Propio() {
  const [leftSide, setLeftSide] = useState([]);
  const [rightSide, setRightSide] = useState([]);
  const [selected, setSelected] = useState(null);
  const [executionTime, setExecutionTime] = useState(0);

  const navigate = useNavigate();

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
  const backgroundClasses = "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex ";

  return (
    <div className={backgroundClasses}>
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-yellow-400 bg-clip-text text-transparent pb-10">
          🏎️ Balanceador De Peso F1 COMUNIDAD
      </h1>

      <div className="flex gap-4 mb-6">
        {componentsList.map((comp) => (
          <div
            key={comp.id}
            className={`rounded-lg shadow-md bg-white cursor-pointer transition-transform duration-150 border ${
              selected?.id === comp.id ? "scale-105 bg-blue-100 border-blue-400" : "border-gray-200"
            }`}
            onClick={() => setSelected(comp)}
          >
            <div className="p-4 text-center">
              <p className="font-semibold">{comp.name}</p>
              <p className="text-sm">{comp.weight} kg</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6">
        <div
          className="p-4 bg-gray-100 rounded-xl min-h-[200px] border border-gray-300"
          onClick={() => handleDrop("left")}
        >
          <h2 className="text-xl font-semibold mb-2">Lado Izquierdo</h2>
          <ul>
            {leftSide.map((comp, idx) => (
              <li key={idx}>{comp.name} - {comp.weight}kg</li>
            ))}
          </ul>
          <p className="mt-4 font-bold">Total: {leftWeight} kg</p>
        </div>

        <div
          className="p-4 bg-gray-100 rounded-xl min-h-[200px] border border-gray-300"
          onClick={() => handleDrop("right")}
        >
          <h2 className="text-xl font-semibold mb-2">Lado Derecho</h2>
          <ul>
            {rightSide.map((comp, idx) => (
              <li key={idx}>{comp.name} - {comp.weight}kg</li>
            ))}
          </ul>
          <p className="mt-4 font-bold">Total: {rightWeight} kg</p>
        </div>
      </div>

      <div className="mb-4 flex">
        <p className={`text-lg font-semibold ${balanced ? "text-green-600" : "text-red-600"}`}>
          {balanced ? "✅ Peso balanceado" : "⚠️ Desequilibrio detectado"}
        </p>
        <p className="text-xl text-yellow-200 ml-10">
          ⏱️ Tiempo de ejecución: {executionTime} ms
        </p>
      </div>

      <div className="flex gap-4">
        <button
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          onClick={resetSides}
        >
          Resetear distribución
        </button>
        <button
          className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          onClick={balanceAutomatically}
        >
          Balancear automáticamente
        </button>
      </div>

      <div className="text-center mt-10 pt-10">
              <Link
                to="/particion"
                className={`group inline-flex items-center space-x-4 px-8 py-4 text-lg font-bold text-white/80 rounded-full border-2 border-white/20 hover:border-red/40 hover:text-blue-500 backdrop-blur-lg bg-red/5 hover:bg-red/10 transition-all duration-500 hover:scale-105`}
                style={{ transitionDelay: '0.3s' }}
              >
                <div className="w-8 h-8 rounded-full bg-white-700 flex items-center justify-center group-hover:bg-blue-700/50 transition-colors duration-300">
                  <div className="w-0 h-0 border-r-4 border-r-white-600 border-y-2 border-y-transparent mr-1"></div>
                </div>
                <span className="tracking-wider">Volver a la página anterior</span>
              </Link>
            </div>

      
    </div>
    </div>
  );
}

export default Algoritmo_Propio;