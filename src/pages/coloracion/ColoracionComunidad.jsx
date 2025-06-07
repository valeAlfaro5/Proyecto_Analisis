import React, { useRef } from "react";
import { Network } from "vis-network/standalone";
import { Link, useNavigate } from 'react-router';
import { colorearGrafo } from "@backend/greedy.js";


export default function ColoracionComunidad() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
//   const [tiempoEjecucion, setTiempoEjecucion] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    const grafo = parseTxtToGrafo(text);
    const resultado = colorearGrafo(grafo, 1000); 
    // setTiempoEjecucion(resultado.tiempo);


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
      nodes: { shape: 'dot', size: 25, font: { size: 16, color: '#000000' } },
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
    const palette = [ '#00D2BE','#DC0000', '#FF8700', '#1E41FF',  '#006F62', '#0090FF',
      '#005AFF', '#2B2D42', '#00E701', '#EDEDED', '#800080', '#ff00ff'];
    return palette[(colorId - 1) % palette.length] || '#aaaaaa';
  };

  return (
    
  <div className="flex flex-col items-center justify-center w-screen space-y-4 min-h-screen bg-gradient-to-bl from-blue-400 via-black-400 to-orange-400 text-gray-900 p-6">

    <h1 className="font-bold text-3xl text-gray-900 font-Montserrat text-center drop-shadow-md">
    Análisis de Algoritmo de Coloración de Grafos
    </h1>

    <h2 className="font-Montserrat text-xl text-gray-700 mt-2">
    Sube un grafo en formato .txt:
    </h2>

    <input
      className="border p-2 rounded"
      type="file"
      accept=".txt"
      onChange={handleFileChange}
    />

    <div
      ref={containerRef}
      style={{ width: "95%", height: "500px", border: "1px solid lightgray" }}
    ></div>

     <div className="text-center mt-5">
        <Link
            onClick={() => navigate(-1)}
            className={`group inline-flex items-center space-x-4 px-8 py-4 text-lg font-bold text-white/80 rounded-full border-2 border-black/20 hover:border-white/40 hover:text-white backdrop-blur-lg bg-white/5 hover:bg-white/10 transition-all duration-500 hover:scale-105 'translate-y-0 opacity-100'`}
            style={{ transitionDelay: '0.8s' }}
        >
            <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                <div className="w-0 h-0 border-r-4 border-r-white border-y-2 border-y-transparent mr-1"></div>
            </div>
            <span className="tracking-wider">Regresar</span>
        </Link>
    </div>
  </div>
);

}

//tiempos de ejecución promedio de colorearGrafo en n pequeño
//n=10
//0.002
//0.008
//0.013
//0.004
//0.003

//tiempos de ejecución promedio de colorearGrafo en n 
//n = 50
//0.038 - 100 aristas
//0.016 - 85 aristas
//0.018 - 85 aristas
//0.0029 - 40 aristas

//tiempos de ejecución promedio de colorearGrafo en n grande
//n = 500
//0.082 - 100 aristas
//0.092 - 1000 aristas
