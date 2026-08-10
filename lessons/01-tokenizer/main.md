# 第 01 课：文本、Token 与词表

状态：进行中

## 本章目标

- 理解文本为什么需要先转换成 token ID
- 区分 byte、Unicode 字符和 token
- 理解词表、Embedding 查表和向量序列之间的关系
- 理解 BPE 通过合并高频相邻单位减少 token 数量的基本思路
- 观察不同真实 tokenizer 对同一段文本的切分差异

## 当前学习记录

- token ID 是词表中的编号，不是有语义大小的数字
- Embedding 使用 token ID 查出固定维度的向量
- `sequence length` 是 token 数量，`embedding dimension` 是每个向量的维度
- Go 的 `string` 是字节序列，`[]rune` 是 Unicode 码点序列
- byte tokenizer 可以表示任意 UTF-8 文本，但序列可能更长
- BPE 从基础单位开始，反复合并高频相邻 pair
- tokenizer 训练阶段学习词表和合并规则，使用阶段只应用已保存规则

## 实验

对比脚本位于当前章节目录：

```bash
python3 lessons/01-tokenizer/compare_tokenizers.py
python3 lessons/01-tokenizer/compare_tokenizers.py --text '你好，世界！' --details
```

脚本对比 UTF-8 byte、Unicode 字符，以及 `r50k_base`、`cl100k_base`、`o200k_base` 三套真实 BPE 编码。

## 章节归档

本章尚未归档。归档前需要完成后续讨论和验收；归档动作必须在学习者明确确认本章结束后进行。
