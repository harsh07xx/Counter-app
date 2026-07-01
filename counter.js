  // ── State ──
  let count = 0;
  let step = 1;
  let goal = null;
  let history = [];
  let undoStack = [];
  let allValues = [0];
  let totalTaps = 0;
  let sessionStart = Date.now();
  const MAX_DOTS = 36;
  const MILESTONES = [10, 25, 50, 100, 250, 500, 1000];

  // ── Elements ──
  const display   = document.getElementById('display');
  const deltaEl   = document.getElementById('delta');
  const histEl    = document.getElementById('history');
  const glow      = document.getElementById('glow');
  const card      = document.getElementById('card');
  const toast     = document.getElementById('toast');
  const progBar   = document.getElementById('progress-bar');
  const goalPct   = document.getElementById('goal-pct');
  const statTotal = document.getElementById('stat-total');
  const statMax   = document.getElementById('stat-max');
  const statMin   = document.getElementById('stat-min');
  const statAvg   = document.getElementById('stat-avg');
  const sessionBadge = document.getElementById('session-badge');

  // ── Session timer ──
  setInterval(() => {
    const s = Math.floor((Date.now() - sessionStart) / 1000);
    const m = Math.floor(s / 60).toString().padStart(1,'0');
    const sec = (s % 60).toString().padStart(2,'0');
    sessionBadge.textContent = `Session ${m}:${sec}`;
  }, 1000);

  // ── Particle canvas ──
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 55; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.35 + 0.05,
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,255,87,${p.alpha})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  // ── Helpers ──
  function showToast(msg, duration = 1800) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }

  let toastTimeout;
  function showDelta(dir, amount) {
    deltaEl.className = 'delta';
    void deltaEl.offsetWidth;
    deltaEl.textContent = (dir === 'up' ? '+' : '−') + amount;
    deltaEl.classList.add(dir === 'up' ? 'show-up' : 'show-down');
  }

  function updateGlow() {
    if (count > 0) {
      glow.style.background = `radial-gradient(circle, rgba(200,255,87,${Math.min(0.12, 0.04 + count/2000)}) 0%, transparent 70%)`;
    } else if (count < 0) {
      glow.style.background = `radial-gradient(circle, rgba(255,87,87,${Math.min(0.12, 0.04 + Math.abs(count)/2000)}) 0%, transparent 70%)`;
    } else {
      glow.style.background = `radial-gradient(circle, rgba(200,255,87,0.07) 0%, transparent 70%)`;
    }
  }

  function updateStats() {
    totalTaps++;
    allValues.push(count);
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);
    const avg = Math.round(allValues.reduce((a,b) => a+b, 0) / allValues.length);
    statTotal.textContent = totalTaps;
    statMax.textContent   = max;
    statMin.textContent   = min;
    statAvg.textContent   = avg;
  }

  function updateProgress() {
    if (goal === null) { progBar.style.width = '0%'; goalPct.textContent = '—'; return; }
    const pct = Math.min(100, Math.round((count / goal) * 100));
    progBar.style.width = pct + '%';
    goalPct.textContent = pct + '%';
    if (count >= goal) {
      progBar.style.background = 'linear-gradient(90deg, var(--gold), #FFAB00)';
    } else {
      progBar.style.background = 'linear-gradient(90deg, var(--accent), #80FF00)';
    }
  }

  function checkMilestone(prev, curr) {
    for (const m of MILESTONES) {
      if (prev < m && curr >= m) {
        card.classList.add('milestone-flash');
        showToast(`🎉 Milestone: ${m}!`, 2200);
        setTimeout(() => card.classList.remove('milestone-flash'), 500);
      }
    }
    if (goal && prev < goal && curr >= goal) {
      showToast(`🏆 Goal reached: ${goal}!`, 2800);
    }
  }

  function updateDisplay(dir) {
    display.textContent = count;
    display.classList.remove('negative', 'zero', 'milestone', 'bump');
    if (count < 0)     display.classList.add('negative');
    else if (count === 0) display.classList.add('zero');
    void display.offsetWidth;
    display.classList.add('bump');
    updateGlow();
    updateProgress();
  }

  function addDot(dir) {
    history.push(dir);
    if (history.length > MAX_DOTS) history.shift();
    histEl.innerHTML = history.map(d => `<div class="hist-dot ${d}"></div>`).join('');
  }

  // ── Actions ──
  function increment() {
    const prev = count;
    undoStack.push(count);
    count += step;
    updateDisplay('up');
    updateStats();
    addDot('up');
    showDelta('up', step);
    checkMilestone(prev, count);
  }

  function decrement() {
    undoStack.push(count);
    count -= step;
    updateDisplay('down');
    updateStats();
    addDot('down');
    showDelta('down', step);
  }

  function undo() {
    if (!undoStack.length) { showToast('Nothing to undo'); return; }
    count = undoStack.pop();
    updateDisplay('undo');
    history.pop();
    histEl.innerHTML = history.map(d => `<div class="hist-dot ${d}"></div>`).join('');
    showToast('↩ Undone');
  }

  function reset() {
    count = 0; history = []; undoStack = [];
    allValues = [0]; totalTaps = 0; sessionStart = Date.now();
    statTotal.textContent = '0'; statMax.textContent = '0';
    statMin.textContent = '0'; statAvg.textContent = '0';
    histEl.innerHTML = '';
    updateDisplay('reset');
    updateProgress();
    showToast('Counter reset');
  }

  // ── Buttons ──
  document.getElementById('inc').addEventListener('click', increment);
  document.getElementById('dec').addEventListener('click', decrement);
  document.getElementById('undo').addEventListener('click', undo);
  document.getElementById('reset').addEventListener('click', reset);

  document.getElementById('step-pills').addEventListener('click', e => {
    const pill = e.target.closest('.step-pill');
    if (!pill) return;
    step = parseInt(pill.dataset.step);
    document.querySelectorAll('.step-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });

  // ── Goal modal ──
  document.getElementById('open-goal').addEventListener('click', () => {
    document.getElementById('modal-overlay').classList.add('open');
    document.getElementById('goal-input').focus();
  });
  document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('modal-overlay').classList.remove('open');
  });
  document.getElementById('confirm-goal').addEventListener('click', () => {
    const val = parseInt(document.getElementById('goal-input').value);
    if (!isNaN(val) && val > 0) {
      goal = val;
      updateProgress();
      showToast(`Goal set: ${val}`);
    }
    document.getElementById('modal-overlay').classList.remove('open');
  });
  document.getElementById('goal-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('confirm-goal').click();
  });
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay'))
      document.getElementById('modal-overlay').classList.remove('open');
  });

  // ── Keyboard ──
  document.addEventListener('keydown', e => {
    if (document.getElementById('modal-overlay').classList.contains('open')) return;
    if (e.key === 'ArrowUp'   || e.key === '+' || e.key === '=') increment();
    else if (e.key === 'ArrowDown' || e.key === '-') decrement();
    else if (e.key === 'z' || e.key === 'Z') undo();
    else if (e.key === 'r' || e.key === 'R') reset();
    else if (e.key === 'g' || e.key === 'G') document.getElementById('open-goal').click();
    else if (['1','2','3','4'].includes(e.key)) {
      document.querySelectorAll('.step-pill')[parseInt(e.key)-1]?.click();
    }
  });
