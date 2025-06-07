import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const componentsList = [
  { id: 1, name: "Batería", weight: 5 },
  { id: 2, name: "Freno", weight: 3 },
  { id: 3, name: "Sensor", weight: 1 },
  { id: 4, name: "Tanque", weight: 6 },
  { id: 5, name: "Radiador", weight: 4 },
];

export default function F1WeightBalancer() {
  const [leftSide, setLeftSide] = useState([]);
  const [rightSide, setRightSide] = useState([]);
  const [selected, setSelected] = useState(null);

  const handleDrop = (side) => {
    if (!selected) return;
    const update = side === "left" ? setLeftSide : setRightSide;
    update((prev) => [...prev, selected]);
    setSelected(null);
  };

  const resetSides = () => {
    setLeftSide([]);
    setRightSide([]);
  };

  const getWeight = (arr) => arr.reduce((sum, item) => sum + item.weight, 0);

  const leftWeight = getWeight(leftSide);
  const rightWeight = getWeight(rightSide);
  const balanced = leftWeight === rightWeight;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🏎️ Balanceador de Peso F1</h1>

      <div className="flex gap-4 mb-6">
        {componentsList.map((comp) => (
          <Card
            key={comp.id}
            className={`cursor-pointer transition-transform duration-150 ${
              selected?.id === comp.id ? "scale-105 bg-blue-100" : ""
            }`}
            onClick={() => setSelected(comp)}
          >
            <CardContent className="p-4 text-center">
              <p className="font-semibold">{comp.name}</p>
              <p className="text-sm">{comp.weight} kg</p>
            </CardContent>
          </Card>
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

      <div className="mb-4">
        <p className={`text-lg font-semibold ${balanced ? "text-green-600" : "text-red-600"}`}>
          {balanced ? "✅ Peso balanceado" : "⚠️ Desequilibrio detectado"}
        </p>
      </div>

      <Button onClick={resetSides}>Resetear distribución</Button>
    </div>
  );
}
