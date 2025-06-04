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
            allCycles.push([...path, path[0]]); // cerrar el ciclo
        }
        return;
    }

    for (let v = 1; v < n; v++) {
        if (isSafe(v, graph, path, pos)) {
            path[pos] = v;
            hamCycleUtil(graph, path, pos + 1, n, allCycles);
            path[pos] = -1; // backtracking
        }
    }
}

function findAllHamiltonianCycles(graph) {
    const n = graph.length;
    const path = new Array(n).fill(-1);
    const allCycles = [];

    path[0] = 0;

    const startTime = performance.now(); // iniciar cronómetro
    hamCycleUtil(graph, path, 1, n, allCycles);
    const endTime = performance.now();   // detener cronómetro

    console.log(`Se encontraron ${allCycles.length} ciclos hamiltonianos.`);
    console.log(`Tiempo de ejecución: ${(endTime - startTime).toFixed(4)} ms`);

    return allCycles;
}

// === Ejemplo ===
// const graph = [
//     [0, 1, 1, 0, 1], 
//     [1, 0, 1, 1, 1], 
//     [1, 1, 0, 1, 0], 
//     [0, 1, 1, 0, 1], 
//     [1, 1, 0, 1, 0]
// ];

// const graph = [
//   [0,1,1,0,0,0,0,0,0,0,0,0,0,0,1],
//   [1,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
//   [1,1,0,1,1,0,0,0,0,0,0,0,0,0,0],
//   [0,1,1,0,1,1,0,0,0,0,0,0,0,0,0],
//   [0,0,1,1,0,1,1,0,0,0,0,0,0,0,0],
//   [0,0,0,1,1,0,1,1,0,0,0,0,0,0,0],
//   [0,0,0,0,1,1,0,1,1,0,0,0,0,0,0],
//   [0,0,0,0,0,1,1,0,1,1,0,0,0,0,0],
//   [0,0,0,0,0,0,1,1,0,1,1,0,0,0,0],
//   [0,0,0,0,0,0,0,1,1,0,1,1,0,0,0],
//   [0,0,0,0,0,0,0,0,1,1,0,1,1,0,0],
//   [0,0,0,0,0,0,0,0,0,1,1,0,1,1,0],
//   [0,0,0,0,0,0,0,0,0,0,1,1,0,1,1],
//   [0,0,0,0,0,0,0,0,0,0,0,1,1,0,1],
//   [1,0,0,0,0,0,0,0,0,0,0,0,1,1,0]
// ];

// const graph = [
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

// const graph = [
//     [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//     [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
//     [1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
//     [1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
//     [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
//     [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
//     [1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
//     [1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
//     [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
// ];

const cycles = findAllHamiltonianCycles(graph);

// Imprimir los ciclos encontrados
cycles.forEach((cycle, index) => {
    console.log(`Ciclo ${index + 1}: ${cycle.map((node, i) => node + 1).join(' -> ')}`);
});
