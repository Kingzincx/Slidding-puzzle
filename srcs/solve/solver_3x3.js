/**
 * Solves 3x3 with optimized A* (bitpacking, heap, and stronger heuristic).
 * @param {number[]} startState - Initial puzzle state.
 * @returns {number[][]|null} - List of states up to the solution.
 */
function astarSolver3x3(startState) {
  const context = getSolverContext(3);
  const startPacked = packState(startState, context);
  const goalPacked = context.goalPacked;

  if (startPacked === goalPacked) {
    return [startState.slice()];
  }

  const startEmpty = startState.indexOf(null);
  const startHeuristic = manhattanWithLinearConflict(startPacked, context);
  const openSet = new MinHeap(compareAStarNodes);
  const bestCostByState = new Map();

  bestCostByState.set(startPacked, 0);
  openSet.push({
    packed: startPacked,
    emptyPos: startEmpty,
    g: 0,
    h: startHeuristic,
    f: startHeuristic,
    parent: null,
  });

  while (openSet.size() > 0) {
    const current = openSet.pop();
    const knownBest = bestCostByState.get(current.packed);
    if (knownBest === undefined || knownBest !== current.g) {
      continue;
    }

    if (current.packed === goalPacked) {
      return reconstructPackedPath(current, context);
    }

    const neighbors = context.neighborsByPos[current.emptyPos];
    for (let i = 0; i < neighbors.length; i++) {
      const nextEmpty = neighbors[i];
      const nextPacked = swapPackedTiles(
        current.packed,
        current.emptyPos,
        nextEmpty,
        context,
      );
      const tentativeG = current.g + 1;
      const previousBest = bestCostByState.get(nextPacked);

      if (previousBest !== undefined && tentativeG >= previousBest) {
        continue;
      }

      const heuristic = manhattanWithLinearConflict(nextPacked, context);
      bestCostByState.set(nextPacked, tentativeG);
      openSet.push({
        packed: nextPacked,
        emptyPos: nextEmpty,
        g: tentativeG,
        h: heuristic,
        f: tentativeG + heuristic,
        parent: current,
      });
    }
  }

  return null;
}

function reconstructPackedPath(node, context) {
  let path = [];
  let current = node;

  while (current !== null) {
    path.push(unpackState(current.packed, context));
    current = current.parent;
  }

  path.reverse();
  return path;
}

function compareAStarNodes(a, b) {
  if (a.f !== b.f) return a.f - b.f;
  return a.h - b.h;
}
