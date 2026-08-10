# 教学进度

更新时间：2026-08-11

## 当前章节

- 章节：第 01 课：文本、Token 与词表
- 状态：进行中，尚未归档
- 当前主题：Attention 前置概念，正在补齐张量、关注权重、softmax 和 Loss

## 已确认掌握

- 文本需要先转换成 token ID，模型不能直接对字符串进行神经网络计算
- token ID 是词表中的索引，不代表数字大小或语义强弱
- Embedding 是通过 token ID 查出向量的表
- 能区分 `sequence length` 和 `embedding dimension`
- Go 的 `string` 是字节序列，`[]rune` 是 Unicode 码点序列
- byte tokenizer 与 rune tokenizer 的基本差异
- BPE 通过反复合并高频相邻 pair，减少常见文本的 token 数量
- tokenizer 训练阶段学习词表和合并规则，使用阶段应用已保存的规则
- `<EOS>` 用于表示生成结束，遇到它时推理程序可以停止并通常不展示该特殊 token

## 最近一次反馈

学习者判断：如果没有 mask，`<PAD>` 可能会被当作输入提供给大模型；并主动指出自己还不理解张量、Attention 中的关注权重、softmax 和 Loss。

## 待澄清

- `<PAD>` 为什么需要 mask，以及 mask 如何避免它参与有效计算
- `<PAD>` mask 与 causal mask 的区别
- 其他特殊 token 在不同模型中的实际使用差异
- tokenizer 的编码、解码和模型配套关系的章节验收
- 张量、Attention 关注权重、softmax 和 Loss 的基础解释与验收

## 实验状态

- 已完成真实 tokenizer 对比实验：UTF-8 byte、Unicode 字符、`r50k_base`、`cl100k_base`、`o200k_base`
- 实验脚本：`lessons/01-tokenizer/compare_tokenizers.py`
- 实验已提交到 `main`
- 当前没有新的课程实验在等待授权

## 教学节奏

继续保持小步讲解，先补齐 Attention 前置概念，再确认 `<PAD>` 和 mask，最后做第 01 课验收。暂不进入词向量 3D 可视化对应的第 02 课，也不提前归档第 01 课。
