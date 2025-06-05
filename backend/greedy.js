export function colorearGrafo(grafo, repeticiones = 1000) {
  const inicio = performance.now();
  let colores;

  for (let i = 0; i < repeticiones; i++) {
    colores = ejecutarGreedy(grafo);
  }

  const fin = performance.now();
  const tiempo = ((fin - inicio) / repeticiones).toFixed(3); // promedio

  return { colores, tiempo };
}

function ejecutarGreedy(grafo) {
  const colores = {};
  const adyacencia = {};

  grafo.edges.forEach(({ from, to }) => {
    if (!adyacencia[from]) adyacencia[from] = [];
    if (!adyacencia[to]) adyacencia[to] = [];
    adyacencia[from].push(to);
    adyacencia[to].push(from);
  });

  const nodos = Object.keys(adyacencia).map(n => parseInt(n));

  for (let v of nodos) {
    const usados = new Set();
    (adyacencia[v] || []).forEach(vecino => {
      if (colores[vecino]) usados.add(colores[vecino]);
    });
    let color = 1;
    while (usados.has(color)) color++;
    colores[v] = color;
  }

  return colores;
}
