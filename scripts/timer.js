
(function () {
  "use strict";
  // --- Elements ---------------------------------------------
  const elMain   = document.querySelector("[data-main]");
  const elFrac   = document.querySelector("[data-frac]");
  const elSweep  = document.querySelector("[data-sweep]");
  const elStatus = document.querySelector("[data-status]");
  const elLabel  = document.querySelector("[data-status-label]");

  const btnStart = document.querySelector("[data-start]");
  const btnStop  = document.querySelector("[data-stop]");
  const btnReset = document.querySelector("[data-reset]");
  // --- State ------------------------------------------------
  let running    = false;
  let startStamp = 0;   // performance.now() when the current run began
  let elapsed    = 0;   // ms accumulated from previous runs
  let frameId    = null;

  // --- Time helpers -----------------------------------------
  function currentMs() {
    return elapsed + (running ? performance.now() - startStamp : 0);
  }

  function pad(n, width) {
    return String(n).padStart(width, "0");
  }

  function format(ms) {
    const totalCs  = Math.floor(ms / 10);          // centiseconds
    const cs       = totalCs % 100;
    const totalSec = Math.floor(totalCs / 100);
    const sec      = totalSec % 60;
    const totalMin = Math.floor(totalSec / 60);
    const min      = totalMin % 60;
    const hrs      = Math.floor(totalMin / 60);

    const main = hrs > 0
      ? `${pad(hrs, 2)}:${pad(min, 2)}:${pad(sec, 2)}`
      : `${pad(min, 2)}:${pad(sec, 2)}`;

    return { main, frac: `.${pad(cs, 2)}` };
  }

  // --- Render -----------------------------------------------
  function render() {
    const ms = currentMs();
    const { main, frac } = format(ms);
    elMain.textContent = main;
    elFrac.textContent = frac;
    // sweep fills once every second (0–100%)
    elSweep.style.width = `${((ms % 1000) / 1000) * 100}%`;
  }

  function loop() {
    render();
    if (running) frameId = requestAnimationFrame(loop);
  }

  // --- Status + button availability -------------------------
  function setStatus(state, label) {
    elStatus.setAttribute("data-state", state);
    elLabel.textContent = label;
  }

  function syncButtons() {
    btnStart.disabled = running;
    btnStop.disabled  = !running;
    btnReset.disabled = running || currentMs() === 0;
  }

  // --- Actions ----------------------------------------------
  function start() {
    if (running) return;
    running = true;
    startStamp = performance.now();
    setStatus("running", "Running");
    syncButtons();
    loop();
  }

  function stop() {
    if (!running) return;
    elapsed += performance.now() - startStamp;
    running = false;
    if (frameId) cancelAnimationFrame(frameId);
    render();
    setStatus("paused", "Paused");
    syncButtons();
  }

  function reset() {
    running = false;
    if (frameId) cancelAnimationFrame(frameId);
    elapsed = 0;
    startStamp = 0;
    elSweep.style.width = "0%";
    render();
    setStatus("ready", "Ready");
    syncButtons();
  }

  // --- Wiring -----------------------------------------------
  btnStart.addEventListener("click", start);
  btnStop.addEventListener("click", stop);
  btnReset.addEventListener("click", reset);

  document.addEventListener("keydown", (e) => {
    // ignore if the user is typing somewhere
    if (e.target.matches("input, textarea")) return;

    if (e.code === "Space") {
      e.preventDefault();
      running ? stop() : start();
    } else if (e.key === "r" || e.key === "R") {
      reset();
    }
  });

  // --- Init -------------------------------------------------
  reset();
})();