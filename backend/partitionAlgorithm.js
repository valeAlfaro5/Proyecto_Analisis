
/**
 * 
 * Algoritmo de particion de la comunidad Utilizando programación dinámica
 * para numeros enteros positivos no muy grandes
 */
export function partitionComponents(components) {
  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
  const n = components.length;
  const target = Math.floor(totalWeight / 2);

  // DP[i][j] = true si se puede obtener peso j usando los primeros i elementos
  const dp = Array.from({ length: n + 1 }, () => Array(target + 1).fill(false));
  const pick = Array.from({ length: n + 1 }, () => Array(target + 1).fill(false));
  dp[0][0] = true;

  for (let i = 1; i <= n; i++) {
    const w = components[i - 1].weight;
    for (let j = 0; j <= target; j++) {
      if (dp[i - 1][j]) {
        dp[i][j] = true;
        if (j + w <= target) {
          dp[i][j + w] = true;
          pick[i][j + w] = true;
        }
      }
    }
  }

  // Encuentra el peso más cercano al target alcanzable
  let best = target;
  while (best >= 0 && !dp[n][best]) best--;

  // Reconstruir la partición
  const left = [];
  const right = [];
  let j = best;
  for (let i = n; i > 0; i--) {
    if (pick[i][j]) {
      left.push(components[i - 1]);
      j -= components[i - 1].weight;
    } else {
      right.push(components[i - 1]);
    }
  }

  return {
    left,
    right,
    leftWeight: left.reduce((sum, c) => sum + c.weight, 0),
    rightWeight: right.reduce((sum, c) => sum + c.weight, 0),
    balanced: Math.abs(
      left.reduce((sum, c) => sum + c.weight, 0) -
      right.reduce((sum, c) => sum + c.weight, 0)
    ) === 0,
  };
}