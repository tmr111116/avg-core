## 已知BUG
1. PrepareTransition当含有正在动作的子精灵，且该子精灵会移动超出边界时，会出现显示范围不断改变的问题。


## 与BKEngine的差异
1. 执行单独一条`action`指令时，不会立即生效（即任何情况下，Action都需要手动执行start才会启动）。

## TODO