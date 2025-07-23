const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('playPauseBtn');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progressContainer');
const volumeControl = document.getElementById('volumeControl');
const playlistItems = document.querySelectorAll('#playlistList li');
const trackNameH1 = document.querySelector('.track-name h1');
const trackNameP = document.querySelector('.track-name p');

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.classList.add('pause');
    } else {
        audio.pause();
        playPauseBtn.classList.remove('pause');
    }
});

audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration)) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = percent + '%';
    }
});

progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});

audio.addEventListener('error', () => {
    alert('Ошибка загрузки аудио файла.');
});

function setTrack(item) {
    playlistItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    audio.src = item.getAttribute('data-src');
    const text = item.textContent.split(' - ');
    trackNameH1.textContent = text[0];
    trackNameP.textContent = text[1] || 'Composer';
    audio.currentTime = 0;
    audio.play();
    playPauseBtn.classList.add('pause');
}

playlistItems.forEach(item => {
    item.addEventListener('click', () => {
        setTrack(item);
    });
});
