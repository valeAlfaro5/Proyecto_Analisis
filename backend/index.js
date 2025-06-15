const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { performance } = require('perf_hooks');
const app = express();
const upload = multer({ dest: 'uploads/' });
const port = 3000;
const { colorearGrafo } = require('./greedy');
const { AlgoritmoVoraz } = require('./voraz');


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
app.post('/hamiltonian-community', (req, res) => {
    let graph = req.body.graph;

    if (!graph) {
        graph = defaultGraph;
    }

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

function leerGrafoDesdeArchivo(ruta) {
    const contenido = fs.readFileSync(ruta, 'utf-8');
    const edges = contenido.trim().split('\n').map(linea => {
        const [from, to] = linea.trim().split(/\s+/).map(Number);
        return { from, to };
    });
    return { edges };
}


//codigo de la comunidad
app.post('/colorear-grafo', upload.single('archivo'), (req, res) => {
    // const repeticiones = parseInt(req.query.repeticiones || '1');
    const archivo = req.file?.path;

    if (!archivo) {
        return res.status(400).json({ error: 'No se proporcionó archivo .txt' });
    }

    try {
        const grafo = leerGrafoDesdeArchivo(archivo);
        const resultado = colorearGrafo(grafo);
        fs.unlinkSync(archivo); // Borra archivo temporal
        res.json({
            message: "Coloración realizada exitosamente.",
            ...resultado
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error procesando el archivo del grafo.',
            detalles: error.message
        });
    }
});

//mi codigo
app.post('/colorar-mio', (req, res) => {
  const { nodes, edges } = req.body;
  if (!nodes || !edges) {
    return res.status(400).json({ error: 'Faltan nodes o edges' });
  }

  const resultado = AlgoritmoVoraz(nodes, edges);
  res.json(resultado);
});

// Escuchar en el puerto
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});


