/**
 * Move um bloco se o movimento for válido.
 * @param {number} index - Índice do bloco a ser movido.
 */
function moveTile(index) {
    if (gameData.isPaused || !gameData.gameStarted) return;
    let validMoves = getValidMoves(gameData.emptyIndex);
    if (validMoves.includes(index)) {
      [gameData.puzzle[gameData.emptyIndex], gameData.puzzle[index]] = [
        gameData.puzzle[index],
        gameData.puzzle[gameData.emptyIndex],
      ];
      gameData.emptyIndex = index;
      gameData.moveCount++;
  
      if (currentMode === 'classic') {
        gameData.score = Math.max(gameData.score - 10, 0);
        updateScore();
      }
  
      renderPuzzle();
      checkWin();
    }
  }
  
  /**
   * Verifica se o jogador completou o puzzle.
   */
  function checkWin() {
    for (let i = 0; i < gameData.puzzle.length - 1; i++) {
      if (gameData.puzzle[i] !== i + 1) {
        return;
      }
    }
    if (currentMode === 'zen') {
      generatePuzzle();
    } else if (currentMode === 'timed') {
      gameData.puzzlesCompleted++;
      generatePuzzle();
    } else {
      endGame();
    }
  }
  
  /**
   * Finaliza o jogo e exibe a tela de vitória.
   */
  function endGame() {
    clearInterval(gameData.timer);
    gameData.gameStarted = false;
  
    gameMusic.pause();
  
    victoryMusic.volume = 1.0;
    victoryMusic.play();
  
    let victoryScreen = document.getElementById('victoryScreen');
    let victoryMessage = document.getElementById('victoryMessage');
    let victoryStats = document.getElementById('victoryStats');
  
    if (currentMode === 'timed') {
      victoryMessage.innerText = 'Tempo Esgotado!';
      victoryStats.innerText = `Puzzles completos: ${gameData.puzzlesCompleted}.`;
      updateRanking(gameData.puzzlesCompleted, gameData.totalTime);
    } else {
      victoryMessage.innerText = 'Parabéns! Completaste o puzzle.';
      victoryStats.innerHTML = `Tempo: ${formatTime(
        gameData.totalTime
      )}<br>Pontuação: ${gameData.score}`;
      updateRanking(gameData.score, gameData.totalTime);
    }
  
    victoryScreen.style.display = 'flex';
  }
  
  /**
   * Reinicia o jogo atual.
   */
  function restartGame() {
    let victoryScreen = document.getElementById('victoryScreen');
    victoryScreen.style.display = 'none';
  
    victoryMusic.pause();
    victoryMusic.currentTime = 0;
    if (currentMode === 'zen') {
      playZenMusic();
    } else {
      gameMusic.play();
    }
  
    gameData.totalTime = 0;
    gameData.moveCount = 0;
    gameData.score = 1000;
    gameData.puzzlesCompleted = 0;
    document.getElementById('timer').innerText = '00:00';
    document.getElementById('score').innerText = gameData.score;
    startGamePlay();
  }
  
  /**
   * Inicia o cronômetro do jogo.
   * @param {number|null} timeLimit - Tempo limite para o modo 'timed', ou null para tempo livre.
   */
  function startTimer(timeLimit = null) {
    let timerElement = document.getElementById('timer');
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