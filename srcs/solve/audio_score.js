/**
 * Starts music playback in Zen mode.
 */
function playZenMusic() {
  const zenMusic = new Audio();
  zenMusic.src = gameData.zenPlaylist[0];
  zenMusic.loop = true;
  zenMusic.volume = musicVolumeSlider ? musicVolumeSlider.value / 100 : 0.8;
  gameData.zenMusicElement = zenMusic;
  zenMusic.play();
}

/**
 * Updates the score display in the UI.
 */
function updateScore() {
  let scoreElement = document.getElementById("score");
  scoreElement.innerText = gameData.score;
}
