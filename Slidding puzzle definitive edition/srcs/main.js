// Variáveis Globais
let currentUser = localStorage.getItem('currentUser') || 'Convidado';
let currentMode = 'classic';
let currentTheme = localStorage.getItem('theme') || 'default';
let puzzleSize = 3; // Tamanho padrão

let gameData = {
  timer: null,
  totalTime: 0,
  score: 1000, // Pontuação inicial
  isPaused: false,
  puzzle: [],
  emptyIndex: 8,
  moveCount: 0,
  gameStarted: false,
  puzzlesCompleted: 0,
  timeLimit: 170, // 2 minutos e 50 segundos
  zenPlaylist: ['audios/zen1.mp3', 'audios/zen2.mp3', 'audios/zen3.mp3'],
  zenMusicIndex: 0,
  zenMusicElement: null, // Elemento de áudio para o modo Zen
};

// Elementos do DOM
const musicVolumeSlider = document.getElementById('music-volume');
const gameMusic = document.getElementById('game-music');
const victoryMusic = document.getElementById('victory-music');

/**
 * Mostra uma seção específica da interface, ocultando as demais.
 * @param {string} sectionId - O ID da seção a ser exibida.
 */
function showSection(sectionId) {
  let sections = document.querySelectorAll('body > div');
  sections.forEach(section => {
    if (
      section.id !== 'background-gif' &&
      section.id !== 'pauseMenu' &&
      section.id !== 'victoryScreen'
    ) {
      section.style.display = 'none';
    }
  });

  let sectionToShow = document.getElementById(sectionId);
  if (sectionToShow) {
    sectionToShow.style.display = 'flex';
  }

  if (sectionId === 'options') {
    loadTheme();
  }

  if (sectionId === 'ranking') {
    loadRanking();
  }
}

/**
 * Encerra o jogo.
 */
function exitGame() {
  window.location.href = 'about:blank';
}

/**
 * Altera o tema do jogo e salva no localStorage.
 * @param {string} theme - O nome do tema a ser aplicado.
 */
function changeTheme(theme) {
  currentTheme = theme;
  localStorage.setItem('theme', theme);
  loadTheme();
}

/**
 * Carrega os recursos do tema selecionado (imagens e músicas).
 */
function loadTheme() {
  let backgroundGif = document.getElementById('background-gif');
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
    musicVolumeSlider.addEventListener('input', () => {
      gameMusic.volume = musicVolumeSlider.value / 100;
    });
  }
}

/**
 * Função chamada quando a janela é carregada; inicia o tema e exibe o menu principal.
 */
window.onload = function () {
  loadTheme();
  showSection('main-menu');
};