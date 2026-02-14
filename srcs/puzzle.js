/**
 * Generates a random solvable initial puzzle.
 */
function generatePuzzle() {
  const totalTiles = puzzleSize * puzzleSize;
  const puzzle = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);
  puzzle.push(null);

  let emptyIndex = totalTiles - 1;
  let previousEmptyIndex = -1;
  const scrambleSteps = getScrambleSteps(puzzleSize);
  const scrambleHistory = [];

  for (let step = 0; step < scrambleSteps; step++) {
    let validMoves = getValidMoves(emptyIndex);

    if (previousEmptyIndex !== -1 && validMoves.length > 1) {
      validMoves = validMoves.filter((move) => move !== previousEmptyIndex);
    }

    const chosenMove =
      validMoves[Math.floor(Math.random() * validMoves.length)];

    [puzzle[emptyIndex], puzzle[chosenMove]] = [
      puzzle[chosenMove],
      puzzle[emptyIndex],
    ];

    scrambleHistory.push(emptyIndex);
    previousEmptyIndex = emptyIndex;
    emptyIndex = chosenMove;
  }

  gameData.puzzle = puzzle;
  gameData.emptyIndex = emptyIndex;
  gameData.moveHistory = scrambleHistory;
  renderPuzzle();
}

/**
 * Renders the puzzle in the game interface.
 */
function renderPuzzle() {
  let gameElement = document.getElementById("game");
  gameElement.innerHTML = "";

  let scale = puzzleSize / 3;
  document.documentElement.style.setProperty("--puzzle-scale", scale);

  gameElement.style.gridTemplateColumns = `repeat(${puzzleSize}, calc(80px / ${scale}))`;
  gameElement.style.gridTemplateRows = `repeat(${puzzleSize}, calc(80px / ${scale}))`;

  gameData.puzzle.forEach((value, index) => {
    let tile = document.createElement("div");
    tile.className = "tile";

    if (value) {
      tile.innerText = value;
      tile.addEventListener("click", () => moveTile(index));
    } else {
      gameData.emptyIndex = index;
      tile.classList.add("empty");
    }
    gameElement.appendChild(tile);
  });
}

/**
 * Shuffles the array using the Fisher-Yates algorithm.
 * @param {any[]} array - The array to shuffle.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Defines the number of random moves used for shuffling.
 * @param {number} side - Puzzle side length.
 * @returns {number} - Number of shuffle moves.
 */
function getScrambleSteps(side) {
  if (side === 3) return 120;
  if (side === 6) return 260;
  return Math.max(side * side * 8, 50);
}

/**
 * Checks whether the puzzle is solvable.
 * @param {number[]} puzzle - The current puzzle state.
 * @returns {boolean} - True if solvable, false otherwise.
 */
function isSolvable(puzzle) {
  let inversions = 0;
  for (let i = 0; i < puzzle.length; i++) {
    for (let j = i + 1; j < puzzle.length; j++) {
      if (puzzle[i] !== null && puzzle[j] !== null && puzzle[i] > puzzle[j]) {
        inversions++;
      }
    }
  }
  const gridWidth = puzzleSize;
  if (gridWidth % 2 === 0) {
    const blankIndex = puzzle.indexOf(null);
    const blankRowFromBottom = gridWidth - Math.floor(blankIndex / gridWidth);
    return blankRowFromBottom % 2 === 0
      ? inversions % 2 !== 0
      : inversions % 2 === 0;
  } else {
    return inversions % 2 === 0;
  }
}

/**
 * Returns valid moves from the current empty-space position.
 * @param {number} emptyIndex - Empty-space index.
 * @returns {number[]} - Array of valid move indices.
 */
function getValidMoves(emptyIndex) {
  let moves = [];
  let row = Math.floor(emptyIndex / puzzleSize);
  let col = emptyIndex % puzzleSize;

  if (row > 0) moves.push(emptyIndex - puzzleSize); // Up
  if (row < puzzleSize - 1) moves.push(emptyIndex + puzzleSize); // Down
  if (col > 0) moves.push(emptyIndex - 1); // Left
  if (col < puzzleSize - 1) moves.push(emptyIndex + 1); // Right

  return moves;
}
