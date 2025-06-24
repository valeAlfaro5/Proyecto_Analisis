 function AlgoritmoVoraz(nodes, edges) {
  const inicio = performance.now();
  const colores = [ "#50C878","#90E0EF" ,"#FFDE21","#9583B6" ]; //solo 4 colores, representando las semanas
  const coloracion = {};//inicializar coloracion
  const grafo ={};

  for (let i = 0; i < nodes.length; i++) {//inicializar grafo
    grafo[nodes[i].id] = []; 
  }

  for (let i = 0; i < edges.length; i++) {//llenar edges por las predefinidas
      const source = edges[i].source;
      const target = edges[i].target;
      grafo[source].push(target);
      grafo[target].push(source);
  }

 
  for (let v = 0; v <nodes.length; v++) {
    const coloresUsados = new Set();//conjunto para almacenar los colores usados por los vecinos
    const nodo = nodes[v]; 
    const nodoActual = grafo[nodo.id];

    //recorrer los vecinos del nodo actual
    for (let u = 0; u<nodoActual.length; u++) {
      const vecino = nodoActual[u];

     if(coloracion[vecino] !== undefined) {
        coloresUsados.add(coloracion[vecino]);//si el vecino ya tiene color, agregarlo al conjunto
      }
       let colorDisponible = "#FFF5BA";
        for (let k = 0; k < colores.length; k++) {
          if (!coloresUsados.has(colores[k])) {
            colorDisponible = colores[k];//buscar el primer color que no esté en el conjunto de colores usados
            break;
          }
        }
         coloracion[nodo.id] = colorDisponible ;
    }

  }

  const fin = performance.now();
  const tiempo = ((fin - inicio).toFixed(4)); // promedio
  return {tiempo, coloracion};
}

// module.exports = { AlgoritmoVoraz };
export { AlgoritmoVoraz };

//si esta vacio - preguntar cuando seleccione un pin si alli quiere iniciar
//si no esta vacio - preguntar si quiere que ese continue
//usar solo 4 colores representando las semanas (1,2,3,4) de cada mes

//seleccionar al menos 2 para la coloracion tipo de monza se pueden ir a las vegas o a brasil
//utilizar ids para saber a donde van las vertices