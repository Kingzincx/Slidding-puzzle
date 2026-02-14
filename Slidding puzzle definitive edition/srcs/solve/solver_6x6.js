function isSolvedState(state) {
  for (let i = 0; i < state.length - 1; i++) {
    if (state[i] !== i + 1) return false;
  }
  return state[state.length - 1] === null;
}

/**
 * Solves 6x6 by reversing the move history of the current match.
 * @param {number[]} startState - Current puzzle state.
 * @returns {number[][]|null} - Path to the solved state.
 */
function reverseHistorySolver(startState) {
  if (isSolvedState(startState)) {
    return [startState];
  }

  if (
    !Array.isArray(gameData.moveHistory) ||
    gameData.moveHistory.length === 0
  ) {
    return null;
  }

  let simulatedState = startState.slice();
  let simulatedEmpty = gameData.emptyIndex;
  let solution = [simulatedState.slice()];

  for (let i = gameData.moveHistory.length - 1; i >= 0; i--) {
    const previousEmpty = gameData.moveHistory[i];

    if (!getValidMoves(simulatedEmpty).includes(previousEmpty)) {
      return null;
    }

    [simulatedState[simulatedEmpty], simulatedState[previousEmpty]] = [
      simulatedState[previousEmpty],
      simulatedState[simulatedEmpty],
    ];

    simulatedEmpty = previousEmpty;
    solution.push(simulatedState.slice());
  }

  if (!isSolvedState(solution[solution.length - 1])) {
    return null;
  }

  return solution;
}
