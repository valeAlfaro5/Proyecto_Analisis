function findHamiltonianCycleCount(graph) {
    const n = graph.length;
    const visited = new Array(n).fill(false);
    let count = 0;

    function backtrack(curr, depth) {
        if (depth === n) {
            // Si hay conexión de regreso al nodo inicial, contamos ciclo
            if (graph[curr][0] === 1) {
                count++;
            }
            return;
        }

        for (let next = 1; next < n; next++) {
            if (!visited[next] && graph[curr][next] === 1) {
                visited[next] = true;
                backtrack(next, depth + 1);
                visited[next] = false;
            }
        }
    }

    visited[0] = true; // Empezamos desde nodo 0
    const startTime = performance.now();
    backtrack(0, 1);
    const endTime = performance.now();

    return {
        count,
        time_ms: +(endTime - startTime).toFixed(4),
        nodes: n
    };
}

function findNHamiltonianCycles(graph, maxSavedCycles = 5) {
    const n = graph.length;
    let totalCount = 0;
    const firstCycles = [];

    function backtrack(path, visitedMask) {
        const u = path[path.length - 1];

        if (path.length === n) {
            if (graph[u][path[0]]) {
                totalCount++;
                if (firstCycles.length < maxSavedCycles) {
                    firstCycles.push([...path, path[0]]);
                }
            }
            return;
        }

        for (let v = 0; v < n; v++) {
            if (!(visitedMask & (1 << v)) && graph[u][v]) {
                path.push(v);
                backtrack(path, visitedMask | (1 << v));
                path.pop();
            }
        }
    }

    const startTime = performance.now();
    backtrack([0], 1 << 0);
    const endTime = performance.now();

    return {
        nodes: n,
        totalCycles: totalCount,
        savedCycles: firstCycles.length,
        time_ms: +(endTime - startTime).toFixed(2),
        cycles: firstCycles,
    };
}

function generarGrafoCompleto(n) {
    const graph = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i !== j) graph[i][j] = 1;
        }
    }
    return graph;
}

// console.log(findNHamiltonianCycles(generarGrafoCompleto(11)))


module.exports = {
    findNHamiltonianCycles
}