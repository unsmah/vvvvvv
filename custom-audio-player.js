// custom-audio-player.js

class CustomAudioPlayer {
  constructor(audioElementId, lyricsContainerId, mp3Url, vttUrl) {
    this.audioPlayer = document.getElementById(audioElementId);
    this.lyricsContainer = document.getElementById(lyricsContainerId);
    this.mp3Url = mp3Url;
    this.vttUrl = vttUrl;

    this.lyrics = [];
    this.currentLyrics = '';

    this.setupAudio();
    this.loadLyrics();
  }

  setupAudio() {
    this.audioPlayer.src = this.mp3Url;

    // Event listeners for play and pause
    this.audioPlayer.addEventListener('play', () => this.onPlay());
    this.audioPlayer.addEventListener('pause', () => this.onPause());
    this.audioPlayer.addEventListener('timeupdate', () => this.updateLyrics());
  }

  onPlay() {
    this.loadLyrics(); // Load lyrics when the audio starts
    this.audioPlayer.play();
  }

  onPause() {
    this.audioPlayer.pause();
  }

  loadLyrics() {
    fetch(this.vttUrl)
      .then(response => response.text())
      .then(data => this.parseVTT(data));
  }

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

  timeToSeconds(time) {
    const parts = time.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseFloat(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  }

  updateLyrics() {
    const currentTime = this.audioPlayer.currentTime;

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
}
