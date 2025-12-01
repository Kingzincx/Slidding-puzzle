/**
 * Gera o puzzle inicial de forma aleatória e solúvel.
 */
function generatePuzzle() {
    const totalTiles = puzzleSize * puzzleSize - 1;
    gameData.puzzle = Array.from({ length: totalTiles }, (_, i) => i + 1);
    do {
      shuffleArray(gameData.puzzle);
    } while (!isSolvable(gameData.puzzle));
    gameData.puzzle.push(null);
    renderPuzzle();
  }
  
  /**
   * Renderiza o puzzle na interface do jogo.
   */
  function renderPuzzle() {
    let gameElement = document.getElementById('game');
    gameElement.innerHTML = '';
  
    let scale = puzzleSize / 3;
    document.documentElement.style.setProperty('--puzzle-scale', scale);
  
    gameElement.style.gridTemplateColumns = `repeat(${puzzleSize}, calc(80px / ${scale}))`;
    gameElement.style.gridTemplateRows = `repeat(${puzzleSize}, calc(80px / ${scale}))`;
  
    gameData.puzzle.forEach((value, index) => {
      let tile = document.createElement('div');
      tile.className = 'tile';
  
      if (value) {
        tile.innerText = value;
        tile.addEventListener('click', () => moveTile(index));
      } else {
        gameData.emptyIndex = index;
        tile.classList.add('empty');
      }
      gameElement.appendChild(tile);
    });
  }
  
  /**
   * Embaralha o array utilizando o algoritmo de Fisher-Yates.
   * @param {any[]} array - O array a ser embaralhado.
   */
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  /**
   * Verifica se o puzzle é solúvel.
   * @param {number[]} puzzle - O estado atual do puzzle.
   * @returns {boolean} - True se for solúvel, false caso contrário.
   */
  function isSolvable(puzzle) {
    let inversions = 0;
    for (let i = 0; i < puzzle.length - 1; i++) {
      for (let j = i + 1; j < puzzle.length; j++) {
        if (puzzle[i] && puzzle[j] && puzzle[i] > puzzle[j]) {
          inversions++;
        }
      }
    }
    const gridWidth = puzzleSize;
    if (gridWidth % 2 === 0) {
      let emptyRow = Math.floor(gameData.puzzle.indexOf(null) / gridWidth);
      if (
        (emptyRow % 2 === 0 && inversions % 2 !== 0) ||
        (emptyRow % 2 !== 0 && inversions % 2 === 0)
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return inversions % 2 === 0;
    }
  }
  
  /**
   * Retorna os movimentos válidos a partir da posição atual do espaço vazio.
   * @param {number} emptyIndex - Índice do espaço vazio.
   * @returns {number[]} - Array de índices válidos para movimento.
   */
  function getValidMoves(emptyIndex) {
    let moves = [];
    let row = Math.floor(emptyIndex / puzzleSize);
    let col = emptyIndex % puzzleSize;
  
    if (row > 0) moves.push(emptyIndex - puzzleSize); // Cima
    if (row < puzzleSize - 1) moves.push(emptyIndex + puzzleSize); // Baixo
    if (col > 0) moves.push(emptyIndex - 1); // Esquerda
    if (col < puzzleSize - 1) moves.push(emptyIndex + 1); // Direita
  
    return moves;
  }  