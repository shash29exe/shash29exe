const bioWindow = document.getElementById("bio-window");
const shashver = document.getElementById("shashver-window");
const output = document.getElementById("output");
const input = document.getElementById("input");
const terminal = document.getElementById("terminal");

function clear_terminal() {
    output.innerHTML = '';
    input.value = "";
}

function closeWindow() {
    clear_terminal();
    bioWindow.style.display = "none";
}

function okShashver() {
    bioWindow.style.display = "block";
}

const commands = {
    help: `
help      - shows this text<br><br>
about     - about<br>
socials   - show socials<br>
sites     - show my websites<br><br>
echo      - outputs text<br>
whoami    - shows your username<br>
date      - shows current date<br>
ipconfig  - shows your IP<br>
cls       - clears terminal<br>
exit      - close terminal
    `.replace(/ /g, '&nbsp;'),

    date: () => new Date().toString(),
    echo: (args) => args.join(" "),
    whoami: "shash29",
        about: `
I'm a programmer from Chelyabinsk.<br>
I program in Python, HTML, CSS and a bit of JavaScript.<br>
I use Debian and Arch btw
    `,
    socials:
        '<a style="color:#ccc" href="https://github.com/shash29exe" target="_blank">GitHub</a><br>' +
        '<a style="color:#ccc" href="https://t.me/shash29_sh" target="_blank">Telegram</a>',
    sites:
        '<a style="color:#ccc" href="/old/" target="_blank">Old 1</a><br>' +
        '<a style="color:#ccc" href="/old2/" target="_blank">Old 2</a><br>' +
        '<a style="color:#ccc" href="https://site.shash29.ru" target="_blank">Site</a><br>' +
        '<a style="color:#ccc" href="https://linus-torvalds.shash29.ru" target="_blank">Linus Torvalds prank</a><br>' +
        '<a style="color:#ccc" href="https://newtab.shash29.ru/" target="_blank">new-tab</a><br>' +
        '<a style="color:#ccc" href="https://shashon-bio.shash29.ru" target="_blank">shashon-bio</a><br>',
    ipconfig: async () => {
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            return `your IP: ${data.ip}`;
        } catch {
            return "error fetching IP";
        }
    }
};

input.addEventListener("keydown", async e => {
    if (e.key !== "Enter") return;
    const value = input.value.trim();
    if (!value) return;
    const [cmd, ...args] = value.split(" ");

    if (cmd === "cls") { clear_terminal(); return; }
    if (cmd === "exit") { closeWindow(); return; }

    let result = commands[cmd];
    if (!result) result = `command not found: ${cmd}`;
    else if (typeof result === "function") result = await result(args);

    output.innerHTML += `shash29@shash29.ru&gt; ${value}<br>${result}<br><br>`;
    output.scrollTop = output.scrollHeight;
    input.value = "";
});

const CHAR_W = 8;
const CHAR_H = 16;
const WINDOW_W = 120 * CHAR_W;
const WINDOW_H = 30 * CHAR_H;

let terminalState = "fullscreen";
let savedRect = null;

function setWindowed() {
    if (terminalState === "windowed") return;
    if (!savedRect) savedRect = bioWindow.getBoundingClientRect();

    bioWindow.style.position = "absolute";
    bioWindow.style.width = WINDOW_W + "px";
    bioWindow.style.height = WINDOW_H + "px";
    bioWindow.style.left = savedRect.left + "px";
    bioWindow.style.top = savedRect.top + "px";
    bioWindow.style.margin = "0";

    terminal.style.width = "100%";
    terminal.style.height = "calc(100% - 23px)";

    terminalState = "windowed";
    bringToFront(bioWindow);
}

function setFullscreen() {
    if (terminalState === "fullscreen") return;

    savedRect = {
        left: parseInt(bioWindow.style.left),
        top: parseInt(bioWindow.style.top)
    };

    bioWindow.style.position = "fixed";
    bioWindow.style.left = "0";
    bioWindow.style.top = "0";
    bioWindow.style.width = "100vw";
    bioWindow.style.height = "100vh";

    terminal.style.width = "100vw";
    terminal.style.height = "calc(100vh - 33px)";

    terminalState = "fullscreen";
    bringToFront(bioWindow);
}

function toggleTerminal() {
    terminalState === "fullscreen" ? setWindowed() : setFullscreen();
}

function makeDraggable(win, header, onlyWindowed = false) {
    let dragging = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;

    try { header.style.touchAction = 'none'; } catch(e) {}

    function ensureAbsolute() {
        if (getComputedStyle(win).position !== 'absolute') {
            const left = win.offsetLeft;
            const top = win.offsetTop;
            win.style.position = 'absolute';
            win.style.left = left + 'px';
            win.style.top = top + 'px';
            win.style.margin = '0';
        }
    }

    function startDrag(clientX, clientY) {
        startX = clientX;
        startY = clientY;
        startLeft = parseFloat(win.style.left) || 0;
        startTop = parseFloat(win.style.top) || 0;
        dragging = true;
        bringToFront(win);
    }

    function moveDrag(clientX, clientY) {
        if (!dragging) return;
        const dx = clientX - startX;
        const dy = clientY - startY;
        win.style.left = (startLeft + dx) + 'px';
        win.style.top  = (startTop  + dy) + 'px';
    }

    function endDrag() {
        dragging = false;
    }

    header.addEventListener('pointerdown', e => {
        if (onlyWindowed && terminalState !== 'windowed') return;
        if (e.target.closest('.buttons')) return;
        if (e.button && e.button !== 0) return;

        ensureAbsolute();
        try { header.setPointerCapture && header.setPointerCapture(e.pointerId); } catch(_) {}
        startDrag(e.clientX, e.clientY);
        e.preventDefault();
    });

    document.addEventListener('pointermove', e => moveDrag(e.clientX, e.clientY));
    document.addEventListener('pointerup', e => {
        try { header.releasePointerCapture && header.releasePointerCapture(e.pointerId); } catch(_) {}
        endDrag();
    });

    header.addEventListener('mousedown', e => {
        if (onlyWindowed && terminalState !== 'windowed') return;
        if (e.target.closest('.buttons')) return;
        if (e.button && e.button !== 0) return;

        ensureAbsolute();
        startDrag(e.clientX, e.clientY);
        e.preventDefault();
    });

    document.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
    document.addEventListener('mouseup', endDrag);
}

let zCounter = 10;
function bringToFront(win) {
    if (win === bioWindow && terminalState === "fullscreen") {
        bioWindow.style.zIndex = 1000;
        shashver.style.zIndex = 1;
        return;
    }
    win.style.zIndex = ++zCounter;
}

document.querySelector("#bio-window .header").addEventListener("dblclick", e => {
    if (e.target.closest(".buttons")) return;
    toggleTerminal();
});

document.querySelector("#bio-window .collapse").addEventListener("click", () => {
    terminalState === "fullscreen" ? setWindowed() : setFullscreen();
});

makeDraggable(bioWindow, document.querySelector("#bio-window .header"), true);
makeDraggable(shashver, document.querySelector("#shashver-window .header"), false);

bioWindow.addEventListener('mousedown', e => {
    if (e.target.closest('.buttons')) return;
    bringToFront(bioWindow);
});

shashver.addEventListener('mousedown', e => {
    if (e.target.closest('.buttons')) return;
    bringToFront(shashver);
});

let isSelecting = false;
let selStartX = 0, selStartY = 0;
let selEl = null;
const selectableWindows = [bioWindow, shashver];

function clearSelection() {
    selectableWindows.forEach(w => w.classList.remove('selected'));
}

document.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    if (e.target.closest('.bio-window') || e.target.closest('.shashver-window') || e.target.closest('.buttons') || e.target.closest('input, textarea') || e.target.closest('#terminal')) return;

    isSelecting = true;
    selStartX = e.clientX;
    selStartY = e.clientY;
    selEl = document.createElement('div');
    selEl.className = 'selection-rect';
    selEl.style.left = selStartX + 'px';
    selEl.style.top = selStartY + 'px';
    selEl.style.width = '0px';
    selEl.style.height = '0px';
    document.body.appendChild(selEl);
    e.preventDefault();
});

document.addEventListener('mousemove', e => {
    if (!isSelecting || !selEl) return;
    const x = Math.min(e.clientX, selStartX);
    const y = Math.min(e.clientY, selStartY);
    const w = Math.abs(e.clientX - selStartX);
    const h = Math.abs(e.clientY - selStartY);
    selEl.style.left = x + 'px';
    selEl.style.top = y + 'px';
    selEl.style.width = w + 'px';
    selEl.style.height = h + 'px';
});

document.addEventListener('mouseup', e => {
    if (!isSelecting) return;
    const rect = selEl.getBoundingClientRect();
    const dx = Math.abs(e.clientX - selStartX);
    const dy = Math.abs(e.clientY - selStartY);

    if (dx < 6 && dy < 6) {
        clearSelection();
    } else {
        selectableWindows.forEach(w => {
            const r = w.getBoundingClientRect();
            if (!(r.right < rect.left || r.left > rect.right || r.bottom < rect.top || r.top > rect.bottom)) {
                w.classList.add('selected');
            } else {
                w.classList.remove('selected');
            }
        });
    }

    isSelecting = false;
    if (selEl && selEl.parentNode) selEl.parentNode.removeChild(selEl);
    selEl = null;
});


document.addEventListener('contextmenu', e => {
    if (e.target.closest('input, textarea') || e.target.isContentEditable) return;
    e.preventDefault();
});

setFullscreen();