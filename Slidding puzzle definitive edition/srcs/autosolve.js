/**
 * Inicia o autoresolvedor utilizando o algoritmo A*.
 */
function autoSolve() {
    if (puzzleSize > 3) {
      alert('O autoresolvedor não está disponível para puzzles maiores que 3x3.');
      return;
    }
  
    if (gameData.isPaused) {
      resumeGame();
    }
  
    let startState = gameData.puzzle.slice();
    let solution = astarSolver(startState);
  
    if (solution) {
      animateSolution(solution);
    } else {
      alert('Não foi possível resolver o puzzle automaticamente.');
    }
  }
  
  /**
   * Implementação do algoritmo A* para resolver o puzzle.
   * @param {number[]} startState - Estado inicial do puzzle.
   * @returns {number[][]} - Lista de estados até a solução.
   */
  function astarSolver(startState) {
    const side = puzzleSize;
    const totalTiles = side * side;
    const goalState = [...Array(totalTiles - 1).keys()].map(i => i + 1);
    goalState.push(null);
  
    let openSet = [];
    let closedSet = new Set();
    let startNode = {
      state: startState,
      parent: null,
      cost: 0,
      fScore: manhattanDistance(startState),
    };
    openSet.push(startNode);
  
    while (openSet.length > 0) {
      openSet.sort((a, b) => a.fScore - b.fScore);
      let currentNode = openSet.shift();
      let stateKey = currentNode.state.toString();
  
      if (isGoal(currentNode.state, goalState)) {
        return reconstructPath(currentNode);
      }
  
      closedSet.add(stateKey);
      let neighbors = getNeighbors(currentNode, side);
  
      neighbors.forEach(neighbor => {
        let neighborKey = neighbor.state.toString();
        if (closedSet.has(neighborKey)) return;
  
        neighbor.fScore = neighbor.cost + manhattanDistance(neighbor.state);
  
        let existingNode = openSet.find(n => n.state.toString() === neighborKey);
        if (existingNode && neighbor.cost >= existingNode.cost) return;
  
        openSet.push(neighbor);
      });
    }
  
    return null;
  }
  
  /**
   * Anima a solução do autoresolvedor passo a passo.
   * @param {number[][]} solution - Lista de estados do puzzle até a solução.
   */
  function animateSolution(solution) {
    let index = 0;
    let interval = setInterval(() => {
      if (index < solution.length - 1) {
        gameData.puzzle = solution[index + 1];
        renderPuzzle();
        index++;
      } else {
        clearInterval(interval);
        checkWin();
      }
    }, 500);
  }
  
  /**
   * Inicia a reprodução da música no modo Zen.
   */
  function playZenMusic() {
    const zenMusic = new Audio();
    zenMusic.src = gameData.zenPlaylist[gameData.zenMusicIndex];
    zenMusic.loop = false;
    zenMusic.volume = musicVolumeSlider ? musicVolumeSlider.value / 100 : 0.8;
    gameData.zenMusicElement = zenMusic;
    zenMusic.play();
  
    zenMusic.addEventListener('ended', () => {
      gameData.zenMusicIndex =
        (gameData.zenMusicIndex + 1) % gameData.zenPlaylist.length;
      zenMusic.src = gameData.zenPlaylist[gameData.zenMusicIndex];
      zenMusic.load();
      zenMusic.play();
    });
  }
  
  /**
   * Atualiza a exibição da pontuação na interface.
   */
  function updateScore() {
    let scoreElement = document.getElementById('score');
    scoreElement.innerText = gameData.score;
  }
  
  /**
   * Funções auxiliares para o algoritmo A*
   */
  
  function isGoal(state, goalState) {
    return state.every((value, index) => value === goalState[index]);
  }
  
  function reconstructPath(node) {
    let path = [];
    while (node.parent !== null) {
      path.unshift(node.state);
      node = node.parent;
    }
    path.unshift(node.state);
    return path;
  }
  
  function getNeighbors(node, side) {
    let neighbors = [];
    let zeroPos = node.state.indexOf(null);
    let row = Math.floor(zeroPos / side);
    let col = zeroPos % side;
  
    let moves = [];
    if (row > 0) moves.push(zeroPos - side);
    if (row < side - 1) moves.push(zeroPos + side);
    if (col > 0) moves.push(zeroPos - 1);
    if (col < side - 1) moves.push(zeroPos + 1);
  
    moves.forEach(newZeroPos => {
      let newState = node.state.slice();
      [newState[zeroPos], newState[newZeroPos]] = [
        newState[newZeroPos],
        newState[zeroPos],
      ];
      neighbors.push({
        state: newState,
        parent: node,
        cost: node.cost + 1,
      });
    });
  
    return neighbors;
  }
  
  function manhattanDistance(state) {
    let distance = 0;
    const side = puzzleSize;
    for (let i = 0; i < state.length; i++) {
      if (state[i] !== null) {
        let value = state[i];
        let currentRow = Math.floor(i / side);
        let currentCol = i % side;
        let goalRow = Math.floor((value - 1) / side);
        let goalCol = (value - 1) % side;
        distance +=
          Math.abs(currentRow - goalRow) + Math.abs(currentCol - goalCol);
      }
    }
    return distance;
  }  