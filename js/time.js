function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('bar-clock').textContent = `${hours}:${minutes}`;
}

updateTime();
setInterval(updateTime, 1000 * 60);

const toggleBtn = document.getElementById('toggleTheme');
const setTheme = (theme) => {
    const url = theme === 'dark' ? './wallpapers/dark-theme.png' : './wallpapers/light-theme.png';
    document.body.style.backgroundImage = `url('${url}')`;
    toggleBtn.textContent = theme === 'dark' ? 'Light' : 'Dark';
    localStorage.setItem('theme', theme);
}

toggleBtn.addEventListener('click', () => {
    const current = localStorage.getItem('theme') || 'light';
    setTheme(current === 'light' ? 'dark' : 'light');
});

window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
});