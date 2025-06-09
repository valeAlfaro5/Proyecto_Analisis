const express = require('express');
const app = express();
const cors = require('cors')
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use(cors())

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

function isTooDense(graph) {
    const n = graph.length;
    let edgeCount = 0;

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (graph[i][j]) edgeCount++;
        }
    }

    const maxEdges = (n * (n - 1)) / 2;
    const density = edgeCount / maxEdges;

    return density >= 0.9; // Puedes ajustar el umbral si hace falta
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
app.post('/hamiltonian-community', async (req, res) => {
    let graph = req.body.graph;

    if (!graph) {
        graph = defaultGraph;
    }

    // Validación previa de densidad
    if (graph.length >= 10 && isTooDense(graph)) {
        return res.status(400).json({
            error: "El grafo es demasiado denso para procesarlo sin riesgo de fallo.",
            message: "Tu grafo tiene muchas conexiones y podría causar que el servidor se quede sin memoria.",
            suggestion: "Intenta reducir el número de conexiones o nodos. Evita grafos completos con más de 10 nodos."
        });
    }

    try {
        const result = findAllHamiltonianCycles(graph);

        res.json({
            message: "Ciclos Hamiltonianos encontrados exitosamente.",
            ...result
        });
    } catch (error) {
        if (error.message === 'timeout') {
            res.status(400).json({
                error: "El procesamiento del grafo tomó demasiado tiempo.",
                message: "El grafo es demasiado complejo para procesarlo. Intenta reducir la cantidad de conexiones o el número de nodos.",
                solution: "Evita enviar grafos densos (como los completos) con más de 11 nodos."
            });
        } else {
            res.status(500).json({
                error: "Ocurrió un error inesperado durante el procesamiento.",
                details: error.message
            });
        }
    }
});

// Escuchar en el puerto
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

