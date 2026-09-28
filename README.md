# 贪吃蛇

在浏览器中打开 `index.html` 即可试玩，不需要安装依赖。

## 操作说明

- 方向键或 `WASD`：控制蛇的方向
- 空格：暂停 / 继续
- `R`：重新开始
- 吃到橙色食物得 10 分，撞墙或撞到自己会结束
- 最高分会保存在浏览器本地

## Git 学习说明

本仓库用「功能分支 + 合并提交」模拟日常开发：

1. 从 `main` 拉出功能分支
2. 完成一小块功能后提交
3. 切回 `main`，用 `--no-ff` 合并，留下清晰的合并节点

对应分支：

| 分支 | 做了什么 |
| --- | --- |
| `feature/init-scaffold` | 页面骨架 |
| `feature/game-board` | 棋盘网格 |
| `feature/snake-control` | 蛇移动和按键 |
| `feature/food-and-score` | 食物和分数 |
| `feature/game-over` | 结束、暂停、重开 |
| `docs/git-workflow` | 这份说明 |

常用查看命令：

```bash
git log --oneline --graph --decorate --all
git branch
git show HEAD
```

自己再练一遍时，可以这样走：

```bash
git checkout main
git checkout -b feature/xxx
# 改代码
git add .
git commit -m "feat: 说明这次改动的原因"
git checkout main
git merge --no-ff feature/xxx -m "merge: 合并 xxx 到 main"
```
