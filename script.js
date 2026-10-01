function startCountdown() {
    const display = document.getElementById('countdown');
    const now = new Date();
    let targetYear = now.getFullYear();

    let targetDate = new Date(`${targetYear}-10-05T00:00:00+05:00`);

    if (now > targetDate) {
        targetYear++;
        targetDate = new Date(`${targetYear}-10-05T00:00:00+05:00`);
    }

    const timer = setInterval(() => {
        const currentTime = new Date().getTime();
        const diff = targetDate.getTime() - currentTime;

        if (diff <= 0) {
        clearInterval(timer);
        console.log("5 октября наступило по Челябинскому времени!");
        return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        display.textContent = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
    }, 1000);
}

startCountdown();