const express = require('express');
const app = express();
const cors = require('cors')
const port = 3000;

const { findNHamiltonianCycles } = require("./ownHamilton")
const { findAllHamiltonianCycles } = require("./hamilton")

// Middleware para parsear JSON
app.use(express.json());
app.use(cors())



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
    if (graph.length >= 12 && isTooDense(graph)) {
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

app.post('/hamiltonian-alt', (req, res) => {
    let graph = req.body.graph;

    if (!graph) {
        graph = defaultGraph;
    }

    try {
        const cycleResult = findNHamiltonianCycles(graph, 5); // puedes cambiar el máximo de ciclos guardados

        res.json({
            message: "Ciclos Hamiltonianos contados y encontrados exitosamente.",
            ...cycleResult
        });
    } catch (error) {
        res.status(500).json({
            error: "Ocurrió un error inesperado durante el procesamiento.",
            details: error.message
        });
    }
})

// Escuchar en el puerto
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});


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