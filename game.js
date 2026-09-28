// 游戏入口：棋盘、移动、食物、计分、结束/暂停/重开
(function () {
  const canvas = document.getElementById("game");
  const statusEl = document.getElementById("status");
  const scoreEl = document.getElementById("score");
  const bestEl = document.getElementById("best-score");
  const overlayEl = document.getElementById("overlay");
  const overlayTitleEl = document.getElementById("overlay-title");
  const overlaySubEl = document.getElementById("overlay-sub");

  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  const COLS = 20;
  const ROWS = 20;
  const CELL = canvas.width / COLS;
  const TICK_MS = 140;
  const BEST_KEY = "greedy-snake-best";

  const DIRS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  let snake = [];
  let direction = DIRS.right;
  let queuedDir = DIRS.right;
  let food = { x: 12, y: 10 };
  let score = 0;
  let bestScore = Number(localStorage.getItem(BEST_KEY) || 0);
  let timerId = null;
  let running = false;
  let paused = false;
  let over = false;

  function drawBoard() {
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(148, 163, 184, 0.18)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x += 1) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y += 1) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(canvas.width, y * CELL);
      ctx.stroke();
    }
  }

  function drawCell(x, y, color) {
    const pad = 1.5;
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL + pad, y * CELL + pad, CELL - pad * 2, CELL - pad * 2);
  }

  function drawSnake() {
    snake.forEach(function (part, index) {
      drawCell(part.x, part.y, index === 0 ? "#4ade80" : "#22c55e");
    });
  }

  function drawFood() {
    drawCell(food.x, food.y, "#f97316");
  }

  function render() {
    drawBoard();
    drawFood();
    drawSnake();
  }

  function updateHud() {
    if (scoreEl) {
      scoreEl.textContent = String(score);
    }
    if (bestEl) {
      bestEl.textContent = String(bestScore);
    }
  }

  function showOverlay(title, sub) {
    if (!overlayEl) {
      return;
    }
    overlayTitleEl.textContent = title;
    overlaySubEl.textContent = sub;
    overlayEl.classList.remove("hidden");
  }

  function hideOverlay() {
    if (overlayEl) {
      overlayEl.classList.add("hidden");
    }
  }

  function occupies(x, y, ignoreTail) {
    const lastIndex = snake.length - 1;
    return snake.some(function (part, index) {
      if (ignoreTail && index === lastIndex) {
        return false;
      }
      return part.x === x && part.y === y;
    });
  }

  function placeFood() {
    const empty = [];
    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        if (!occupies(x, y, false)) {
          empty.push({ x: x, y: y });
        }
      }
    }
    if (empty.length === 0) {
      food = { x: -1, y: -1 };
      return;
    }
    food = empty[Math.floor(Math.random() * empty.length)];
  }

  function addScore(value) {
    score += value;
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem(BEST_KEY, String(bestScore));
    }
    updateHud();
  }

  function resetSnake() {
    snake = [
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 }
    ];
    direction = DIRS.right;
    queuedDir = DIRS.right;
    score = 0;
    placeFood();
    updateHud();
  }

  function isOpposite(a, b) {
    return a.x + b.x === 0 && a.y + b.y === 0;
  }

  function isInside(x, y) {
    return x >= 0 && x < COLS && y >= 0 && y < ROWS;
  }

  function setStatus(text) {
    if (statusEl) {
      statusEl.textContent = text;
    }
  }

  function stopLoop() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    running = false;
  }

  function startLoop() {
    if (timerId) {
      clearInterval(timerId);
    }
    timerId = setInterval(step, TICK_MS);
    running = true;
  }

  function endGame(title) {
    over = true;
    paused = false;
    stopLoop();
    setStatus("已结束");
    showOverlay(title, "按 R 重新开始");
  }

  function startGame() {
    over = false;
    paused = false;
    hideOverlay();
    resetSnake();
    render();
    startLoop();
    setStatus("进行中");
  }

  function togglePause() {
    if (over) {
      return;
    }
    if (!paused) {
      paused = true;
      stopLoop();
      setStatus("已暂停");
      showOverlay("已暂停", "按空格继续");
      return;
    }
    paused = false;
    hideOverlay();
    startLoop();
    setStatus("进行中");
  }

  function step() {
    if (!isOpposite(direction, queuedDir)) {
      direction = queuedDir;
    }

    const head = snake[0];
    const next = {
      x: head.x + direction.x,
      y: head.y + direction.y
    };

    if (!isInside(next.x, next.y)) {
      endGame("撞到墙壁");
      return;
    }

    const growing = next.x === food.x && next.y === food.y;
    if (occupies(next.x, next.y, !growing)) {
      endGame("撞到自己");
      return;
    }

    snake.unshift(next);
    if (growing) {
      addScore(10);
      placeFood();
      if (food.x < 0) {
        render();
        endGame("全部吃完了");
        return;
      }
    } else {
      snake.pop();
    }
    render();
  }

  function handleKey(event) {
    const key = event.key.toLowerCase();
    const map = {
      arrowup: DIRS.up,
      w: DIRS.up,
      arrowdown: DIRS.down,
      s: DIRS.down,
      arrowleft: DIRS.left,
      a: DIRS.left,
      arrowright: DIRS.right,
      d: DIRS.right
    };

    if (map[key]) {
      event.preventDefault();
      if (!over && !paused) {
        queuedDir = map[key];
      }
      return;
    }

    if (key === " " || key === "spacebar") {
      event.preventDefault();
      togglePause();
      return;
    }

    if (key === "r") {
      startGame();
    }
  }

  startGame();
  window.addEventListener("keydown", handleKey);
})();
