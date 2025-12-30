// Audio Player Code (Fixed)
const player = document.getElementById('player2');
const playPauseBtn = document.getElementById('playPauseBtn2');
const playTime = document.getElementById('playTime2');
const timeBarProgress = document.getElementById('timeBarProgress2');
const timeBarContainer = document.getElementById('timeBarContainer2');

if (player && playPauseBtn && playTime && timeBarProgress && timeBarContainer) {
  // Update play/pause button (assuming background image)
  window.updatePlayButton = function () {
  playPauseBtn.dataset.state =
  player.paused || player.ended ? 'paused' : 'playing';

};

  // Toggle playback
  playPauseBtn.addEventListener('click', () => {
    if (player.paused || player.ended) {
      player.play();
    } else {
      player.pause();
    }
    updatePlayButton();
  });

  // Update time & progress bar
  player.addEventListener('timeupdate', () => {
    const current = formatTime(player.currentTime);
    const duration = formatTime(player.duration || 0);
    playTime.textContent = `${current} / ${duration}`;
    const progress = (player.currentTime / (player.duration || 1)) * 100;
    timeBarProgress.style.width = `${progress}%`;
  });

  // Seek on bar click
  timeBarContainer.addEventListener('click', e => {
    const rect = timeBarContainer.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    player.currentTime = percent * player.duration;
  });

  // Update on play/pause/ended
  player.addEventListener('play', updatePlayButton);
  player.addEventListener('pause', updatePlayButton);
  player.addEventListener('ended', updatePlayButton);

  // Format time
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  // Initial setup
  playTime.textContent = '00:00 / 00:00';
  updatePlayButton();

}
