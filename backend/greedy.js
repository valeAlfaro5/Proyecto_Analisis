
 function colorearGrafo(grafo) {
  const inicio = performance.now();
  let colores = ejecutarGreedy(grafo);
  const fin = performance.now();
  const tiempo = ((fin - inicio)).toFixed(4); // promedio

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

// module.exports = { colorearGrafo };
export { colorearGrafo };