function AlgoritmoComunidad() {
  const codigoJS = `
function puedePartirse(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;

  const objetivo = total / 2;
  const dp = Array(objetivo + 1).fill(false);
  dp[0] = true;

  for (const num of nums) {
    for (let j = objetivo; j >= num; j--) {
      dp[j] = dp[j] || dp[j - num];
    }
  }

  return dp[objetivo];
}

// Ejemplo de uso:
const conjunto = Array.from({ length: 100 }, (_, i) => i + 1);
console.time("Tiempo de ejecución");
const resultado = puedePartirse(conjunto);
console.timeEnd("Tiempo de ejecución");
console.log("¿Se puede dividir en dos subconjuntos con la misma suma?", resultado ? "Sí" : "No");
`;

  return (
    <div>
      <h1>Algoritmo de la Comunidad: Problema de Partición</h1>
      <p>Este es el algoritmo implementado en <strong>JavaScript</strong>:</p>
      <pre style={{ background: "#f4f4f4", padding: "1em", borderRadius: "8px", overflowX: "auto" }}>
        <code>{codigoJS}</code>
      </pre>
    </div>
  );
}

export default AlgoritmoComunidad;
