// 游戏入口：棋盘绘制已完成，移动与食物将在后续提交中补齐
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

  drawBoard();

  if (statusEl) {
    statusEl.textContent = "棋盘已就绪";
  }
})();
