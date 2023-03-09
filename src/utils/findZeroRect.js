export function findZeroRect(matrix, width, height) {
  const n = matrix.length;
  const m = matrix[0].length;
  for (let i = 0; i <= n - height; i++) {
    for (let j = 0; j <= m - width; j++) {
      let count = 0;
      for (let x = i; x < i + height; x++) {
        for (let y = j; y < j + width; y++) {
          if (matrix[x][y] === 0) {
            count++;
          }
        }
      }
      if (count === width * height) {
        return [
          [i, j],
          [i + height - 1, j + width - 1],
        ];
      }
    }
  }
  return null;
}
