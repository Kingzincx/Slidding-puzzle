/**
 * Moves a tile if the move is valid.
 * @param {number} index - Index of the tile to move.
 */
function moveTile(index) {
  if (gameData.isPaused || !gameData.gameStarted || gameData.isAutoSolving)
    return;
  let validMoves = getValidMoves(gameData.emptyIndex);
  if (validMoves.includes(index)) {
    const previousEmptyIndex = gameData.emptyIndex;
    [gameData.puzzle[gameData.emptyIndex], gameData.puzzle[index]] = [
      gameData.puzzle[index],
      gameData.puzzle[gameData.emptyIndex],
    ];
    gameData.emptyIndex = index;
    recordMoveInHistory(previousEmptyIndex, index);
    gameData.moveCount++;

    if (currentMode === "classic") {
      gameData.score = Math.max(gameData.score - 10, 0);
      updateScore();
    }

    renderPuzzle();
    checkWin();
  }
}

/**
 * Records the move in history, removing canceling pairs.
 * @param {number} previousEmptyIndex - Empty index before the move.
 * @param {number} movedTileIndex - Index of the moved tile.
 */
function recordMoveInHistory(previousEmptyIndex, movedTileIndex) {
  if (!Array.isArray(gameData.moveHistory)) {
    gameData.moveHistory = [];
  }

  const lastHistoryEntry =
    gameData.moveHistory[gameData.moveHistory.length - 1];
  if (lastHistoryEntry === movedTileIndex) {
    gameData.moveHistory.pop();
  } else {
    gameData.moveHistory.push(previousEmptyIndex);
  }
}

/**
 * Checks whether the player completed the puzzle.
 */
function checkWin() {
  for (let i = 0; i < gameData.puzzle.length - 1; i++) {
    if (gameData.puzzle[i] !== i + 1) {
      return;
    }
  }
  if (currentMode === "zen") {
    generatePuzzle();
  } else if (currentMode === "timed") {
    gameData.puzzlesCompleted++;
    generatePuzzle();
  } else {
    endGame();
  }
}

/**
 * Ends the game and shows the victory screen.
 */
function endGame() {
  if (gameData.autoSolveInterval) {
    clearInterval(gameData.autoSolveInterval);
    gameData.autoSolveInterval = null;
  }
  gameData.isAutoSolving = false;

  clearInterval(gameData.timer);
  gameData.gameStarted = false;

  gameMusic.pause();

  victoryMusic.volume = 1.0;
  victoryMusic.play();

  let victoryScreen = document.getElementById("victoryScreen");
  let victoryMessage = document.getElementById("victoryMessage");
  let victoryStats = document.getElementById("victoryStats");

  if (currentMode === "timed") {
    victoryMessage.innerText = "Time's Up!";
    victoryStats.innerText = `Puzzles completed: ${gameData.puzzlesCompleted}.`;
    updateRanking(gameData.puzzlesCompleted, gameData.totalTime);
  } else {
    victoryMessage.innerText = "Congratulations! You solved the puzzle.";
    victoryStats.innerHTML = `Time: ${formatTime(
      gameData.totalTime,
    )}<br>Score: ${gameData.score}`;
    updateRanking(gameData.score, gameData.totalTime);
  }

  victoryScreen.style.display = "flex";
}

/**
 * Restarts the current game.
 */
function restartGame() {
  let victoryScreen = document.getElementById("victoryScreen");
  victoryScreen.style.display = "none";

  if (gameData.autoSolveInterval) {
    clearInterval(gameData.autoSolveInterval);
    gameData.autoSolveInterval = null;
  }
  gameData.isAutoSolving = false;
  gameData.moveHistory = [];

  victoryMusic.pause();
  victoryMusic.currentTime = 0;
  if (currentMode === "zen") {
    playZenMusic();
  } else {
    gameMusic.play();
  }

  gameData.totalTime = 0;
  gameData.moveCount = 0;
  gameData.score = 1000;
  gameData.puzzlesCompleted = 0;
  document.getElementById("timer").innerText = "00:00";
  document.getElementById("score").innerText = gameData.score;
  startGamePlay();
}

/**
 * Starts the game timer.
 * @param {number|null} timeLimit - Time limit for 'timed' mode, or null for free time.
 */
function startTimer(timeLimit = null) {
  let timerElement = document.getElementById("timer");
  let startTime = Date.now();
  gameData.timer = setInterval(() => {
    if (!gameData.isPaused) {
      let elapsedTime = (Date.now() - startTime) / 1000;
      if (timeLimit) {
        gameData.totalTime = timeLimit - elapsedTime;
        if (gameData.totalTime <= 0) {
          clearInterval(gameData.timer);
          endGame();
          return;
        }
      } else {
        gameData.totalTime = elapsedTime;
      }
      timerElement.innerText = formatTime(gameData.totalTime);
    }
  }, 100);
}
