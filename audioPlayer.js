// audioPlayer.js

class AudioPlayer {
    constructor(audioElementId, lyricsContainerId, mp3Src, vttSrc) {
        this.audioPlayer = document.getElementById(audioElementId);
        this.lyricsContainer = document.getElementById(lyricsContainerId);
        this.mp3Src = mp3Src;
        this.vttSrc = vttSrc;
        this.lyrics = [];

        this.init();
    }

    init() {
        this.setupAudio();
        this.loadLyrics();
        this.setupEventListeners();
    }

    setupAudio() {
        const source = document.createElement('source');
        source.src = this.mp3Src;
        source.type = 'audio/mp3';
        this.audioPlayer.appendChild(source);
        this.audioPlayer.load();
    }

    loadLyrics() {
        fetch(this.vttSrc)
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

    setupEventListeners() {
        this.audioPlayer.addEventListener('timeupdate', () => {
            this.updateLyrics();
        });
    }

    updateLyrics() {
        const currentTime = this.audioPlayer.currentTime;
        for (let lyric of this.lyrics) {
            if (currentTime >= lyric.startTime && (!lyric.endTime || currentTime < lyric.endTime)) {
                this.lyricsContainer.textContent = lyric.text;
                return;
            }
        }
        this.lyricsContainer.textContent = ''; // Clear lyrics if no match
    }
}

// Exporting the AudioPlayer class
export default AudioPlayer;
