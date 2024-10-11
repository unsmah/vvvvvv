// customAudioPlayer.js
class CustomAudioPlayer {
  constructor(audioElementId, lyricsContainerId, options = {}) {
    this.audioElement = document.getElementById(audioElementId);
    this.lyricsContainer = document.getElementById(lyricsContainerId);
    this.playBtn = options.playBtnId ? document.getElementById(options.playBtnId) : null;
    this.pauseBtn = options.pauseBtnId ? document.getElementById(options.pauseBtnId) : null;
    this.volumeSlider = options.volumeSliderId ? document.getElementById(options.volumeSliderId) : null;
    this.progressBar = options.progressBarId ? document.getElementById(options.progressBarId) : null;
    this.currentTimeElem = options.currentTimeId ? document.getElementById(options.currentTimeId) : null;
    this.durationElem = options.durationId ? document.getElementById(options.durationId) : null;
    this.volumeLevelElem = options.volumeLevelId ? document.getElementById(options.volumeLevelId) : null;
    
    this.lyrics = [];

    // Bind event listeners
    if (this.playBtn) this.playBtn.addEventListener('click', () => this.play());
    if (this.pauseBtn) this.pauseBtn.addEventListener('click', () => this.pause());
    if (this.volumeSlider) this.volumeSlider.addEventListener('input', () => this.updateVolume());
    if (this.progressBar) this.progressBar.addEventListener('input', () => this.seek());
    this.audioElement.addEventListener('timeupdate', () => this.updateProgress());
    this.audioElement.addEventListener('loadedmetadata', () => this.updateDuration());
    this.audioElement.addEventListener('loadeddata', () => this.loadLyrics());
  }

  // Play the audio
  play() {
    this.audioElement.play();
    if (this.playBtn) this.playBtn.classList.add('hidden');
    if (this.pauseBtn) this.pauseBtn.classList.remove('hidden');
  }

  // Pause the audio
  pause() {
    this.audioElement.pause();
    if (this.pauseBtn) this.pauseBtn.classList.add('hidden');
    if (this.playBtn) this.playBtn.classList.remove('hidden');
  }

  // Update volume
  updateVolume() {
    this.audioElement.volume = this.volumeSlider.value;
    if (this.volumeLevelElem) {
      this.volumeLevelElem.textContent = (this.audioElement.volume).toFixed(1);
    }
  }

  // Seek the audio
  seek() {
    const seekTime = (this.progressBar.value / 100) * this.audioElement.duration;
    this.audioElement.currentTime = seekTime;
  }

  // Update progress bar
  updateProgress() {
    const currentTime = this.audioElement.currentTime;
    const duration = this.audioElement.duration;
    const progressPercent = (currentTime / duration) * 100;
    if (this.progressBar) this.progressBar.value = progressPercent || 0;
    if (this.currentTimeElem) this.currentTimeElem.textContent = this.formatTime(currentTime);
    this.updateLyrics(currentTime);
  }

  // Update duration display
  updateDuration() {
    if (this.durationElem) this.durationElem.textContent = this.formatTime(this.audioElement.duration);
  }

  // Load VTT file and parse lyrics
  loadLyrics() {
    const vttFile = this.audioElement.getAttribute('data-lyrics');
    fetch(vttFile)
      .then(response => response.text())
      .then(data => this.parseVTT(data));
  }

  // Parse VTT file to extract lyrics and timestamps
  parseVTT(data) {
    const lines = data.split('\n');
    let currentLyrics = null;

    lines.forEach(line => {
      const timeCodeMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})/);
      if (timeCodeMatch) {
        const startTime = this.timeToSeconds(timeCodeMatch[1]);
        const endTime = this.timeToSeconds(timeCodeMatch[2]);

        if (currentLyrics) {
          currentLyrics.endTime = startTime;
          this.lyrics.push(currentLyrics);
        }

        currentLyrics = { startTime, text: '' };
      } else if (line.trim() !== '') {
        if (currentLyrics) {
          currentLyrics.text += line.trim() + ' ';
        }
      }
    });

    if (currentLyrics) {
      this.lyrics.push(currentLyrics);
    }
  }

  // Convert VTT time format to seconds
  timeToSeconds(time) {
    const parts = time.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseFloat(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Update lyrics based on the current time of the audio
  updateLyrics(currentTime) {
    for (let i = 0; i < this.lyrics.length; i++) {
      const lyric = this.lyrics[i];
      if (currentTime >= lyric.startTime && (!lyric.endTime || currentTime < lyric.endTime)) {
        this.lyricsContainer.textContent = lyric.text;
        break;
      } else {
        this.lyricsContainer.textContent = ''; // Clear lyrics if no match
      }
    }
  }

  // Format time as MM:SS
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

// Function to initialize the audio player
function initializeAudioPlayer(audioId, lyricsContainerId, options = {}) {
  return new CustomAudioPlayer(audioId, lyricsContainerId, options);
}
