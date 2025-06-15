export function partitionComponents(components) {
  const weights = components.map((comp) => comp.weight);
  const total = weights.reduce((sum, w) => sum + w, 0);

  if (total % 2 !== 0) return { left: components, right: [] };

  const target = total / 2;
  const n = weights.length;

  // Matriz DP con marca de inclusión para reconstrucción
  const dp = Array.from({ length: n + 1 }, () => Array(target + 1).fill(false));
  const prev = Array.from({ length: n + 1 }, () => Array(target + 1).fill(-1));

  for (let i = 0; i <= n; i++) dp[i][0] = true;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= target; j++) {
      if (j < weights[i - 1]) {
        dp[i][j] = dp[i - 1][j];
      } else {
        let canInclude = false;
        for (let k = 0; k <= i - 1; k++) {
          if (dp[k][j - weights[i - 1]]) {
            canInclude = true;
            prev[i][j] = j - weights[i - 1]; // Guarda peso anterior
            break;
          }
        }
        dp[i][j] = dp[i - 1][j] || canInclude;
      }
    }
  }

  if (!dp[n][target]) return { left: components, right: [] };

  // Reconstruir subconjunto izquierdo
  const left = [];
  const used = Array(n).fill(false);
  let i = n, w = target;

  while (w > 0 && i > 0) {
    if (!dp[i - 1][w] && dp[i][w]) {
      left.push(components[i - 1]);
      used[i - 1] = true;
      w -= weights[i - 1];
    }
    i--;
  }

  // Subconjunto derecho = resto de componentes
  const right = components.filter((_, idx) => !used[idx]);

  return { left, right };
}
