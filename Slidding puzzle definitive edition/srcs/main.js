// Global variables
let currentUser = localStorage.getItem("currentUser") || "Guest";
let currentMode = "classic";
let currentTheme = localStorage.getItem("theme") || "default";
let puzzleSize = 3; // Default size

let gameData = {
  timer: null,
  totalTime: 0,
  score: 1000, // Initial score
  isPaused: false,
  puzzle: [],
  emptyIndex: 8,
  moveHistory: [],
  moveCount: 0,
  gameStarted: false,
  puzzlesCompleted: 0,
  timeLimit: 170, // 2 minutes and 50 seconds
  zenPlaylist: ["audios/zen1.mp3", "audios/zen2.mp3", "audios/zen3.mp3"],
  zenMusicIndex: 0,
  zenMusicElement: null, // Audio element for Zen mode
  isAutoSolving: false,
  autoSolveInterval: null,
};

// DOM elements
const musicVolumeSlider = document.getElementById("music-volume");
const gameMusic = document.getElementById("game-music");
const victoryMusic = document.getElementById("victory-music");

/**
 * Shows a specific UI section while hiding the others.
 * @param {string} sectionId - The ID of the section to display.
 */
function showSection(sectionId) {
  let sections = document.querySelectorAll("body > div");
  sections.forEach((section) => {
    if (
      section.id !== "background-gif" &&
      section.id !== "user-circle-container" &&
      section.id !== "pauseMenu" &&
      section.id !== "victoryScreen"
    ) {
      section.style.display = "none";
      section.classList.remove("section-enter");
    }
  });

  let sectionToShow = document.getElementById(sectionId);
  if (sectionToShow) {
    sectionToShow.style.display = "flex";
    requestAnimationFrame(() => sectionToShow.classList.add("section-enter"));
  }

  // Hide user circle during gameplay, show in menus
  let circleContainer = document.getElementById("user-circle-container");
  if (circleContainer) {
    if (sectionId === "game-container") {
      circleContainer.style.display = "none";
      beatSync.stop();
    } else {
      circleContainer.style.display = "flex";
      if (beatSync.initialized) {
        beatSync.start();
      }
    }
  }

  // Close user dropdown when navigating
  let dropdown = document.getElementById("user-dropdown");
  if (dropdown) {
    dropdown.style.display = "none";
  }

  if (sectionId === "options") {
    loadTheme();
  }

  if (sectionId === "ranking") {
    loadRanking();
  }
}

/**
 * Exits the game.
 */
function exitGame() {
  window.location.href = "about:blank";
}

/**
 * Changes the game theme and saves it to localStorage.
 * @param {string} theme - The name of the theme to apply.
 */
function changeTheme(theme) {
  currentTheme = theme;
  localStorage.setItem("theme", theme);
  loadTheme();
}

/**
 * Loads assets for the selected theme (images and music).
 */
function loadTheme() {
  // Apply theme class to body for CSS variable overrides
  document.body.classList.remove("theme-anime", "theme-highschool");
  if (currentTheme !== "default") {
    document.body.classList.add("theme-" + currentTheme);
  }

  let backgroundGif = document.getElementById("background-gif");
  if (backgroundGif) {
    backgroundGif.style.backgroundImage = `url('imagens/${currentTheme}_background.gif')`;
  }

  if (gameMusic) {
    let newMusicSrc = `audios/${currentTheme}_music.mp3`;
    if (gameMusic.src.indexOf(newMusicSrc) === -1) {
      gameMusic.src = newMusicSrc;
      gameMusic.load();
      gameMusic.play();
    } else if (gameMusic.paused) {
      gameMusic.play();
    }
    gameMusic.volume = musicVolumeSlider ? musicVolumeSlider.value / 100 : 0.8;
  }

  if (victoryMusic) {
    victoryMusic.src = `audios/${currentTheme}_victory.mp3`;
  }

  if (musicVolumeSlider && gameMusic) {
    musicVolumeSlider.addEventListener("input", () => {
      gameMusic.volume = musicVolumeSlider.value / 100;
    });
  }
}

/**
 * Called when the window loads; initializes theme and shows the main menu.
 */
window.onload = function () {
  loadTheme();
  showSection("main-menu");
  updateUserCircle();

  // Initialize AudioContext on first user click (browser requirement)
  document.addEventListener(
    "click",
    function initAudio() {
      // Resume music that was blocked by autoplay policy
      if (gameMusic && gameMusic.paused) {
        gameMusic.play();
      }
      beatSync.init();
      beatSync.start();
      document.removeEventListener("click", initAudio);
    },
    { once: true },
  );
};
