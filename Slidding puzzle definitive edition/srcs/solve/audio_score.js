/**
 * Starts music playback in Zen mode.
 */
function playZenMusic() {
  const zenMusic = new Audio();
  zenMusic.src = gameData.zenPlaylist[gameData.zenMusicIndex];
  zenMusic.loop = false;
  zenMusic.volume = musicVolumeSlider ? musicVolumeSlider.value / 100 : 0.8;
  gameData.zenMusicElement = zenMusic;
  zenMusic.play();

  zenMusic.addEventListener("ended", () => {
    gameData.zenMusicIndex =
      (gameData.zenMusicIndex + 1) % gameData.zenPlaylist.length;
    zenMusic.src = gameData.zenPlaylist[gameData.zenMusicIndex];
    zenMusic.load();
    zenMusic.play();
  });
}

/**
 * Updates the score display in the UI.
 */
function updateScore() {
  let scoreElement = document.getElementById("score");
  scoreElement.innerText = gameData.score;
}
