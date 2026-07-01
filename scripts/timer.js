let startTime   = null;   
let accumulated = 0;    
let rafId       = null;   
let running     = false;

const pad = (val, digits = 2) => String(val).padStart(digits, '0');

function format(ms) {
  const h   = Math.floor(ms / 3_600_000);
  const m   = Math.floor((ms % 3_600_000) / 60_000);
  const s   = Math.floor((ms % 60_000)    /  1_000);
  const mil =             ms % 1_000;

  return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(mil, 3)}`;
}

const display  = document.getElementById('display');
const startBtn = document.getElementById('start_btn');
const stopBtn  = document.getElementById('stop_btn');
const resetBtn = document.getElementById('reset_btn');

function tick() {
  const elapsed = accumulated + (Date.now() - startTime);
  display.textContent = format(elapsed);
  rafId = requestAnimationFrame(tick);
}

function startTimer() {
  if (running) return;
  running   = true;
  startTime = Date.now();
  rafId     = requestAnimationFrame(tick);

  startBtn.disabled = true;
  stopBtn.disabled  = false;
  resetBtn.disabled = true;
}

function stopTimer() {
  if (!running) return;
  running      = false;
  accumulated += Date.now() - startTime;
  cancelAnimationFrame(rafId);
  rafId = null;

  startBtn.disabled = false;
  stopBtn.disabled  = true;
  resetBtn.disabled = false;
}

function resetTimer() {
  running     = false;
  accumulated = 0;
  startTime   = null;
  cancelAnimationFrame(rafId);
  rafId = null;

  display.textContent = format(0);   
  startBtn.disabled = false;
  stopBtn.disabled  = true;
  resetBtn.disabled = true;
}

resetTimer()

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    document.getElementById('theme-label').textContent = isDark ? 'Day Mode' : 'Night Mode';
    document.getElementById('toggle-icon').innerHTML = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}