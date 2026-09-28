// 游戏入口：棋盘、蛇移动与按键控制已完成，食物与结束判定将在后续提交中补齐
(function () {
  const canvas = document.getElementById("game");
  const statusEl = document.getElementById("status");

  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  const COLS = 20;
  const ROWS = 20;
  const CELL = canvas.width / COLS;
  const TICK_MS = 140;

  const DIRS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  let snake = [];
  let direction = DIRS.right;
  let queuedDir = DIRS.right;
  let timerId = null;

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

  function render() {
    drawBoard();
    drawSnake();
  }

  function resetSnake() {
    snake = [
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 }
    ];
    direction = DIRS.right;
    queuedDir = DIRS.right;
  }

  function isOpposite(a, b) {
    return a.x + b.x === 0 && a.y + b.y === 0;
  }

  function isInside(x, y) {
    return x >= 0 && x < COLS && y >= 0 && y < ROWS;
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

    // 撞墙时先停在原地，结束画面会在后续功能中补上
    if (!isInside(next.x, next.y)) {
      if (statusEl) {
        statusEl.textContent = "撞墙（结束逻辑待补）";
      }
      return;
    }

    snake.unshift(next);
    snake.pop();
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
      queuedDir = map[key];
    }
  }

  function startLoop() {
    if (timerId) {
      clearInterval(timerId);
    }
    timerId = setInterval(step, TICK_MS);
  }

  resetSnake();
  render();
  startLoop();
  window.addEventListener("keydown", handleKey);

  if (statusEl) {
    statusEl.textContent = "进行中";
  }
})();
