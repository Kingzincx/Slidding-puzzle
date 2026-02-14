/**
 * Starts the auto-solver.
 */
function autoSolve() {
  if (!gameData.gameStarted || gameData.isAutoSolving) {
    return;
  }

  if (gameData.isPaused) {
    resumeGame();
  }

  let startState = gameData.puzzle.slice();
  let solution = null;

  if (puzzleSize === 3) {
    solution = astarSolver3x3(startState);
  } else if (puzzleSize === 6) {
    solution = reverseHistorySolver(startState);
  } else {
    alert("The auto-solver is only available for 3x3 and 6x6 puzzles.");
    return;
  }

  if (solution) {
    if (solution.length <= 1) {
      checkWin();
      return;
    }
    animateSolution(solution, getAnimationDelay(solution.length));
  } else {
    alert("Could not solve the puzzle automatically.");
  }
}

/**
 * Animates the auto-solver solution step by step.
 * @param {number[][]} solution - List of puzzle states up to the solution.
 * @param {number} delay - Delay between animation steps in ms.
 */
function animateSolution(solution, delay) {
  if (gameData.autoSolveInterval) {
    clearInterval(gameData.autoSolveInterval);
    gameData.autoSolveInterval = null;
  }

  gameData.isAutoSolving = true;
  let index = 0;
  gameData.autoSolveInterval = setInterval(() => {
    if (gameData.isPaused) return;

    if (index < solution.length - 1) {
      gameData.puzzle = solution[index + 1];
      renderPuzzle();
      index++;
    } else {
      clearInterval(gameData.autoSolveInterval);
      gameData.autoSolveInterval = null;
      gameData.isAutoSolving = false;
      gameData.moveHistory = [];
      checkWin();
    }
  }, delay);
}

/**
 * Defines the auto-solver animation speed.
 * @param {number} stepCount - Number of steps in the solution.
 * @returns {number} - Interval in milliseconds.
 */
function getAnimationDelay(stepCount) {
  if (puzzleSize === 6) {
    if (stepCount > 300) return 25;
    if (stepCount > 180) return 35;
    return 45;
  }

  if (stepCount > 40) return 70;
  return 90;
}
