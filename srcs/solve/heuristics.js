function manhattanWithLinearConflict(packed, context) {
  const side = context.side;
  let manhattan = 0;
  let conflicts = 0;

  for (let i = 0; i < context.totalTiles; i++) {
    const tile = getPackedTile(packed, i, context);
    if (tile === 0) continue;

    const row = Math.floor(i / side);
    const col = i % side;
    manhattan +=
      Math.abs(row - context.goalRows[tile]) +
      Math.abs(col - context.goalCols[tile]);
  }

  for (let row = 0; row < side; row++) {
    for (let colA = 0; colA < side; colA++) {
      const indexA = row * side + colA;
      const tileA = getPackedTile(packed, indexA, context);

      if (tileA === 0 || context.goalRows[tileA] !== row) continue;

      const goalColA = context.goalCols[tileA];

      for (let colB = colA + 1; colB < side; colB++) {
        const indexB = row * side + colB;
        const tileB = getPackedTile(packed, indexB, context);

        if (tileB === 0 || context.goalRows[tileB] !== row) continue;

        if (goalColA > context.goalCols[tileB]) {
          conflicts++;
        }
      }
    }
  }

  for (let col = 0; col < side; col++) {
    for (let rowA = 0; rowA < side; rowA++) {
      const indexA = rowA * side + col;
      const tileA = getPackedTile(packed, indexA, context);

      if (tileA === 0 || context.goalCols[tileA] !== col) continue;

      const goalRowA = context.goalRows[tileA];

      for (let rowB = rowA + 1; rowB < side; rowB++) {
        const indexB = rowB * side + col;
        const tileB = getPackedTile(packed, indexB, context);

        if (tileB === 0 || context.goalCols[tileB] !== col) continue;

        if (goalRowA > context.goalRows[tileB]) {
          conflicts++;
        }
      }
    }
  }

  return manhattan + conflicts * 2;
}
