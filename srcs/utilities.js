/**
 * Formats time in seconds to MM:SS.mmm.
 * @param {number} totalSeconds - Time in seconds.
 * @returns {string} - Formatted time.
 */
function formatTime(totalSeconds) {
  let mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  let secs = String(Math.floor(totalSeconds % 60)).padStart(2, "0");
  let millis = String(Math.floor((totalSeconds * 1000) % 1000)).padStart(
    3,
    "0",
  );
  return `${mins}:${secs}.${millis}`;
}

/**
 * Handles keyboard shortcuts during gameplay.
 * @param {KeyboardEvent} event - Keyboard event.
 */
function handleKeyPress(event) {
  if (!gameData.gameStarted) return;
  if (event.key.toLowerCase() === "p") {
    togglePause();
  }
}

/**
 * Toggles the game's pause state.
 */
function togglePause() {
  if (!gameData.gameStarted) return;
  gameData.isPaused = !gameData.isPaused;
  let pauseMenu = document.getElementById("pauseMenu");
  if (gameData.isPaused) {
    pauseMenu.style.display = "flex";
    gameMusic.pause();
    if (gameData.zenMusicElement) {
      gameData.zenMusicElement.pause();
    }
  } else {
    pauseMenu.style.display = "none";
    if (currentMode === "zen") {
      if (gameData.zenMusicElement) {
        gameData.zenMusicElement.play();
      }
    } else {
      gameMusic.play();
    }
  }
}

/**
 * Resumes the game after a pause.
 */
function resumeGame() {
  gameData.isPaused = false;
  let pauseMenu = document.getElementById("pauseMenu");
  pauseMenu.style.display = "none";
  if (currentMode === "zen") {
    if (gameData.zenMusicElement) {
      gameData.zenMusicElement.play();
    }
  } else {
    gameMusic.play();
  }
}

/**
 * Returns to the main menu, ending the current game.
 */
function exitToMenu() {
  document.getElementById("pauseMenu").style.display = "none";
  document.getElementById("victoryScreen").style.display = "none";

  if (gameData.autoSolveInterval) {
    clearInterval(gameData.autoSolveInterval);
    gameData.autoSolveInterval = null;
  }
  gameData.isAutoSolving = false;

  gameMusic.pause();
  if (gameData.zenMusicElement) {
    gameData.zenMusicElement.pause();
    gameData.zenMusicElement = null;
  }

  gameData.gameStarted = false;
  gameData.isPaused = false;
  clearInterval(gameData.timer);
  gameData.timer = null;
  gameData.totalTime = 0;
  gameData.moveCount = 0;
  gameData.moveHistory = [];
  gameData.score = 1000;
  document.getElementById("timer").innerText = "00:00";
  document.getElementById("score").innerText = gameData.score;

  document.removeEventListener("keydown", handleKeyPress);

  loadTheme();
  showSection("main-menu");
}
