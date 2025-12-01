/**
 * Função para selecionar a dificuldade.
 * @param {string} mode - O modo de jogo selecionado.
 */
function selectDifficulty(mode) {
    currentMode = mode;
    showSection('difficultySelect');
  }
  
  /**
   * Inicia o jogo no modo selecionado e dificuldade.
   * @param {string} mode - O modo de jogo a ser iniciado ('classic', 'zen', 'timed').
   * @param {string} difficulty - A dificuldade selecionada ('easy', 'hard').
   */
  function startGame(mode, difficulty = 'easy') {
    currentMode = mode;
    puzzleSize = difficulty === 'hard' ? 6 : 3;
  
    gameData.score = 1000;
    gameData.moveCount = 0;
    gameData.totalTime = 0;
    gameData.puzzlesCompleted = 0;
    gameData.gameStarted = false;
    gameData.zenMusicIndex = 0;
  
    if (gameData.zenMusicElement) {
      gameData.zenMusicElement.pause();
      gameData.zenMusicElement = null;
    }
    gameMusic.pause();
  
    if (currentMode === 'zen') {
      document.getElementById('timer-container').style.display = 'none';
      document.getElementById('score-container').style.display = 'none';
      playZenMusic();
      puzzleSize = 3;
    } else {
      document.getElementById('timer-container').style.display = 'block';
      document.getElementById('score-container').style.display = 'block';
      gameMusic.play();
    }
  
    document.getElementById('score').innerText = gameData.score;
  
    showSection('game-container');
    initGame();
  }
  
  /**
   * Inicializa os eventos e a contagem regressiva antes de iniciar o jogo.
   */
  function initGame() {
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.addEventListener('keydown', handleKeyPress);
  
    startCountdown(3);
  }
  
  /**
   * Inicia a contagem regressiva antes de começar o jogo.
   * @param {number} seconds - Número de segundos para a contagem regressiva.
   */
  function startCountdown(seconds) {
    let countdownElement = document.getElementById('countdown');
    countdownElement.style.display = 'flex';
    countdownElement.innerText = seconds;
    let count = seconds;
    let countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        countdownElement.innerText = count;
      } else {
        clearInterval(countdownInterval);
        countdownElement.style.display = 'none';
        startGamePlay();
      }
    }, 1000);
  }
  
  /**
   * Inicia o gameplay efetivo após a contagem regressiva.
   */
  function startGamePlay() {
    gameData.gameStarted = true;
    generatePuzzle();
    if (currentMode === 'timed') {
      startTimer(gameData.timeLimit);
    } else {
      startTimer();
    }
  }
  