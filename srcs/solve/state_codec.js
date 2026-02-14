const solverContextCache = new Map();

function getSolverContext(side) {
  if (solverContextCache.has(side)) {
    return solverContextCache.get(side);
  }

  const totalTiles = side * side;
  const bitsPerTile = Math.ceil(Math.log2(totalTiles));
  const shifts = new Array(totalTiles);

  for (let i = 0; i < totalTiles; i++) {
    shifts[i] = BigInt(i * bitsPerTile);
  }

  const tileMask = (1n << BigInt(bitsPerTile)) - 1n;
  const goalRows = new Array(totalTiles).fill(0);
  const goalCols = new Array(totalTiles).fill(0);

  for (let value = 1; value < totalTiles; value++) {
    const goalIndex = value - 1;
    goalRows[value] = Math.floor(goalIndex / side);
    goalCols[value] = goalIndex % side;
  }

  const neighborsByPos = new Array(totalTiles);
  for (let index = 0; index < totalTiles; index++) {
    neighborsByPos[index] = getNeighborPositions(index, side);
  }

  const goalState = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);
  goalState.push(null);

  const context = {
    side,
    totalTiles,
    tileMask,
    shifts,
    goalRows,
    goalCols,
    neighborsByPos,
    goalPacked: packState(goalState, {
      shifts,
      tileMask,
      totalTiles,
    }),
  };

  solverContextCache.set(side, context);
  return context;
}

function getNeighborPositions(index, side) {
  let neighbors = [];
  const row = Math.floor(index / side);
  const col = index % side;

  if (row > 0) neighbors.push(index - side);
  if (row < side - 1) neighbors.push(index + side);
  if (col > 0) neighbors.push(index - 1);
  if (col < side - 1) neighbors.push(index + 1);

  return neighbors;
}

function packState(state, context) {
  let packed = 0n;
  for (let i = 0; i < context.totalTiles; i++) {
    const value = state[i] === null ? 0 : state[i];
    packed |= BigInt(value) << context.shifts[i];
  }
  return packed;
}

function unpackState(packed, context) {
  const state = new Array(context.totalTiles);
  for (let i = 0; i < context.totalTiles; i++) {
    const value = Number((packed >> context.shifts[i]) & context.tileMask);
    state[i] = value === 0 ? null : value;
  }
  return state;
}

function getPackedTile(packed, index, context) {
  return Number((packed >> context.shifts[index]) & context.tileMask);
}

function swapPackedTiles(packed, indexA, indexB, context) {
  const shiftA = context.shifts[indexA];
  const shiftB = context.shifts[indexB];
  const tileA = (packed >> shiftA) & context.tileMask;
  const tileB = (packed >> shiftB) & context.tileMask;

  let result = packed;
  result &= ~(context.tileMask << shiftA);
  result &= ~(context.tileMask << shiftB);
  result |= tileA << shiftB;
  result |= tileB << shiftA;

  return result;
}
