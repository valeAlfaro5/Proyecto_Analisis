const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

function isSafe(vertex, graph, path, pos) {
    if (!graph[path[pos - 1]][vertex]) return false;
    for (let i = 0; i < pos; i++) {
        if (path[i] === vertex) return false;
    }
    return true;
}

function hamCycleUtil(graph, path, pos, n, allCycles) {
    if (pos === n) {
        if (graph[path[pos - 1]][path[0]]) {
            allCycles.push([...path, path[0]]);
        }
        return;
    }

    for (let v = 1; v < n; v++) {
        if (isSafe(v, graph, path, pos)) {
            path[pos] = v;
            hamCycleUtil(graph, path, pos + 1, n, allCycles);
            path[pos] = -1;
        }
    }
}

function findAllHamiltonianCycles(graph) {
    const n = graph.length;
    const path = new Array(n).fill(-1);
    const allCycles = [];

    path[0] = 0;

    const startTime = performance.now();
    hamCycleUtil(graph, path, 1, n, allCycles);
    const endTime = performance.now();

    return {
        count: allCycles.length,
        time_ms: +(endTime - startTime).toFixed(4),
        cycles: allCycles,
        nodes: n
    };
}

// Grafo por defecto de 5 nodos con varios ciclos hamiltonianos
// const defaultGraph = [
//     [0, 1, 1, 0, 1], 
//     [1, 0, 1, 1, 1], 
//     [1, 1, 0, 1, 0], 
//     [0, 1, 1, 0, 1], 
//     [1, 1, 0, 1, 0]
// ];


const defaultGraph = [
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

// const defaultGraph = [
//     [0, 1, 0, 1, 0, 1, 0, 1, 1],
//     [1, 0, 1, 1, 1, 0, 0, 1, 1],
//     [0, 1, 0, 1, 0, 0, 0, 0, 1],
//     [1, 1, 1, 0, 1, 1, 0, 0, 1],
//     [0, 1, 0, 1, 0, 1, 0, 1, 1],
//     [1, 0, 0, 1, 1, 0, 1, 1, 1],
//     [0, 0, 0, 0, 0, 1, 0, 1, 1],
//     [1, 1, 0, 0, 1, 1, 1, 0, 1],
//     [1, 1, 1, 1, 1, 1, 1, 1, 0],
// ]

//   const defaultGraph = [
//       [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//       [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
//       [1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
//       [1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
//       [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
//       [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
//       [1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
//       [1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
//       [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
//       [1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
//   ];

// Ruta principal
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// POST /hamiltonian con un grafo opcional en el cuerpo
app.get('/hamiltonian-community', (req, res) => {
    // let graph = req.body.graph;

    // if (!graph) {
        graph = defaultGraph;
    // }

    try {
        const result = findAllHamiltonianCycles(graph);
        res.json({
            message: "Ciclos Hamiltonianos encontrados exitosamente.",
            ...result
        });
    } catch (error) {
        res.status(400).json({
            error: "Ocurrió un error al procesar el grafo.",
            details: error.message
        });
    }
});

// Escuchar en el puerto
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
