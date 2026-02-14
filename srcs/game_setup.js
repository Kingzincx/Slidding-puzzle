/**
 * Function to select the difficulty.
 * @param {string} mode - The selected game mode.
 */
function selectDifficulty(mode) {
  currentMode = mode;
  showSection("difficultySelect");
}

/**
 * Starts the game in the selected mode and difficulty.
 * @param {string} mode - The game mode to start ('classic', 'zen', 'timed').
 * @param {string} difficulty - The selected difficulty ('easy', 'hard').
 */
function startGame(mode, difficulty = "easy") {
  currentMode = mode;
  puzzleSize = difficulty === "hard" ? 6 : 3;

  if (gameData.autoSolveInterval) {
    clearInterval(gameData.autoSolveInterval);
    gameData.autoSolveInterval = null;
  }
  gameData.isAutoSolving = false;

  gameData.score = 1000;
  gameData.moveCount = 0;
  gameData.moveHistory = [];
  gameData.totalTime = 0;
  gameData.puzzlesCompleted = 0;
  gameData.gameStarted = false;
  gameData.zenMusicIndex = 0;

  if (gameData.zenMusicElement) {
    gameData.zenMusicElement.pause();
    gameData.zenMusicElement = null;
  }
  gameMusic.pause();

  if (currentMode === "zen") {
    document.getElementById("timer-container").style.display = "none";
    document.getElementById("score-container").style.display = "none";
    playZenMusic();
    puzzleSize = 3;
  } else {
    document.getElementById("timer-container").style.display = "block";
    document.getElementById("score-container").style.display = "block";
    gameMusic.play();
  }

  document.getElementById("score").innerText = gameData.score;

  showSection("game-container");
  initGame();
}

/**
 * Initializes events and the countdown before starting the game.
 */
function initGame() {
  document.getElementById("pauseBtn").addEventListener("click", togglePause);
  document.addEventListener("keydown", handleKeyPress);

  startCountdown(3);
}

/**
 * Starts the countdown before the game begins.
 * @param {number} seconds - Number of seconds for the countdown.
 */
function startCountdown(seconds) {
  let countdownElement = document.getElementById("countdown");
  countdownElement.style.display = "flex";
  countdownElement.innerText = seconds;
  let count = seconds;
  let countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownElement.innerText = count;
    } else {
      clearInterval(countdownInterval);
      countdownElement.style.display = "none";
      startGamePlay();
    }
  }, 1000);
}

/**
 * Starts actual gameplay after the countdown.
 */
function startGamePlay() {
  gameData.gameStarted = true;
  generatePuzzle();
  if (currentMode === "timed") {
    startTimer(gameData.timeLimit);
  } else {
    startTimer();
  }
}
