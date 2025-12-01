/**
 * Formata o tempo em segundos para o formato MM:SS.mmm.
 * @param {number} totalSeconds - Tempo em segundos.
 * @returns {string} - Tempo formatado.
 */
function formatTime(totalSeconds) {
    let mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    let secs = String(Math.floor(totalSeconds % 60)).padStart(2, '0');
    let millis = String(Math.floor((totalSeconds * 1000) % 1000)).padStart(
      3,
      '0'
    );
    return `${mins}:${secs}.${millis}`;
  }
  
  /**
   * Manipula teclas de atalho durante o jogo.
   * @param {KeyboardEvent} event - Evento de teclado.
   */
  function handleKeyPress(event) {
    if (!gameData.gameStarted) return;
    if (event.key.toLowerCase() === 'p') {
      togglePause();
    }
  }
  
  /**
   * Alterna o estado de pausa do jogo.
   */
  function togglePause() {
    if (!gameData.gameStarted) return;
    gameData.isPaused = !gameData.isPaused;
    let pauseMenu = document.getElementById('pauseMenu');
    if (gameData.isPaused) {
      pauseMenu.style.display = 'flex';
      gameMusic.pause();
      if (gameData.zenMusicElement) {
        gameData.zenMusicElement.pause();
      }
    } else {
      pauseMenu.style.display = 'none';
      if (currentMode === 'zen') {
        if (gameData.zenMusicElement) {
          gameData.zenMusicElement.play();
        }
      } else {
        gameMusic.play();
      }
    }
  }
  
  /**
   * Retoma o jogo após uma pausa.
   */
  function resumeGame() {
    gameData.isPaused = false;
    let pauseMenu = document.getElementById('pauseMenu');
    pauseMenu.style.display = 'none';
    if (currentMode === 'zen') {
      if (gameData.zenMusicElement) {
        gameData.zenMusicElement.play();
      }
    } else {
      gameMusic.play();
    }
  }
  
  /**
   * Retorna ao menu principal, encerrando o jogo atual.
   */
  function exitToMenu() {
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('victoryScreen').style.display = 'none';
  
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
    gameData.score = 1000;
    document.getElementById('timer').innerText = '00:00';
    document.getElementById('score').innerText = gameData.score;
  
    document.removeEventListener('keydown', handleKeyPress);
  
    loadTheme();
    showSection('main-menu');
  }  