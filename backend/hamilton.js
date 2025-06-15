// Revisamos el nodo
function isSafe(vertex, graph, path, pos) {
    // Si el nodo actual no tiene arista con el anterior, se cancela
    if (!graph[path[pos - 1]][vertex]) return false;

    // iteramos hasta la posicion actual
    for (let i = 0; i < pos; i++) {
        // para revisar si la iteracion coincide con el vertice (si se repite), si es el caso, se cancela
        if (path[i] === vertex) return false;
    }

    // si se pasan las validaciones, significa que el nodo actual tiene arista con el nodo anterior
    // y que no se esta repitiendo
    return true;
}

/**
 * hamCycleUtil necesita:
 * - graph: el mero grafo (una matriz de adyacencia),
 * - path: un arreglo del mismo tamaño del grafo para ir registrando el ciclo encontrado
 * - pos: la posicion en la que debe iniciar a buscar el ciclo
 * - n: el tamaño del grafo
 * - allCycles: el arreglo en donde se van a guardar todos los ciclos encontrados
 */
function hamCycleUtil(graph, path, pos, n, allCycles) {
    // Se revisa primero que:
    // Al iterar, si la posicion coincide con el tamaño del grafo... (osea, esta al final...)
    if (pos === n) {
        // y si el ultimo nodo tiene conexion con el primer nodo (1)
        if (graph[path[pos - 1]][path[0]]) {
            allCycles.push([...path, path[0]]); // se guarda el ciclo
        }
        // si no, entonces retornamos, no guardamos nada
        return;
    }

    // Iteramos el tamaño del grafo para buscar ciclos
    for (let v = 1; v < n; v++) {
        // el nodo actual esta bien entonces
        if (isSafe(v, graph, path, pos)) {
            path[pos] = v; // guardamos el nodo en arreglo que arma el ciclo
            hamCycleUtil(graph, path, pos + 1, n, allCycles); // y seguimos buscando mas elementos
            path[pos] = -1; // asignamos -1 para deshacer la asignacion y probar otros caminos para buscar ciclos
        }
    }
}

function findAllHamiltonianCycles(graph) {
    const n = graph.length; // Longitud del arreglo
    const path = new Array(n).fill(-1); // Se llena un arreglo con n '-1's
    const allCycles = []; // Array para guardar los ciclos encontrados

    path[0] = 0; // Nodo inicial

    const startTime = performance.now(); // Inicio del timer
    hamCycleUtil(graph, path, 1, n, allCycles); // Proceso de buscar los ciclos con backtracking
    const endTime = performance.now(); // Finalizacion del timer

    // Cuando termina, devuelve el conteo de ciclos, el tiempo que tardó, los ciclos y la cantidad de nodos
    return {
        nodes: n,
        totalCycles: allCycles.length,
        time_ms: +(endTime - startTime).toFixed(4),
        cycles: allCycles,
    };
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

function generarGrafoCompleto(n) {
    const graph = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i !== j) graph[i][j] = 1;
        }
    }
    return graph;
}

const cycles = findAllHamiltonianCycles(generarGrafoCompleto(11));

// Imprimir los ciclos encontrados
// cycles.forEach((cycle, index) => {
//     console.log(`Ciclo ${index + 1}: ${cycle.map((node, i) => node + 1).join(' -> ')}`);
// });

for (let i = 0; i < Math.min(5, cycles.length); i++) {
    const cycle = cycles[i];
    console.log(`Ciclo ${i + 1}: ${cycle.map((node) => node + 1).join(' -> ')}`);
}


module.exports = {
    findAllHamiltonianCycles
}
