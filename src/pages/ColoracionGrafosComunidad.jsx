import React, { useRef } from "react";
import { Network } from "vis-network/standalone";
import { colorearGrafo } from "@backend/greedy.js";


export default function ColoracionGrafosComunidad() {
  const containerRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    const grafo = parseTxtToGrafo(text);
    const resultado = colorearGrafo(grafo, 1000); 

    alert(
      `Colores usados: ${[...new Set(Object.values(resultado.colores))].length}\n` +
      `Tiempo de ejecución: ${resultado.tiempo} ms`
    );

    const nodesWithColor = grafo.nodes.map((node) => ({
      ...node,
      color: getColor(resultado.colores[node.id])
    }));

    new Network(containerRef.current, {
      nodes: nodesWithColor,
      edges: grafo.edges,
    }, {
      nodes: { shape: 'dot', size: 25, font: { size: 16, color: '#ffffff' } },
      edges: { width: 2 }
    });
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
      label: `V${i + 1}`
    }));
    return { nodes, edges };
  };

  const getColor = (colorId) => {
    const palette = ['#D6380D', '#0D8DD6', '#D6AE0D', '#0DD62B', '#7E11CE', '#800000',
      '#ff0000', '#ffA500', '#ffff00', '#808000', '#800080', '#ff00ff'];
    return palette[(colorId - 1) % palette.length] || '#aaaaaa';
  };

  return (
  <div className="flex flex-col items-center justify-center h-screen w-screen space-y-4">
    <h1 className="font-bold text-2xl font-Monsterrat text-center">
      Análisis de Algoritmo de Coloración de Grafos
    </h1>

    <h2 className="font-Monsterrat text-lg">Sube un grafo en formato .txt:</h2>

    <input
      className="font-Monsterrat border p-2 rounded"
      type="file"
      accept=".txt"
      onChange={handleFileChange}
    />

    <div
      ref={containerRef}
      style={{ width: "95%", height: "500px", border: "1px solid lightgray" }}
    ></div>
  </div>
);

}

//tiempos de ejecución promedio de colorearGrafo en n pequeño
//n=5
//0.002
//0.008
//0.003
//0.004
//0.003