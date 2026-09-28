// 游戏入口：后续功能会在此文件逐步补齐
(function () {
  const canvas = document.getElementById("game");
  const statusEl = document.getElementById("status");

  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (statusEl) {
    statusEl.textContent = "骨架已就绪";
  }
})();
