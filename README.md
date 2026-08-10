# LLM From Zero

从零理解大语言模型，并在 Apple Silicon Mac 上亲手训练一个小型 Transformer。

这个仓库记录一条面向 Agent 开发工程师的学习路线：不把数学当作开始学习的门槛，而是从可运行的现象出发，在需要时补齐数学，再亲手实现对应的模型组件。

## 学习目标

完成这条路线后，应该能够：

- 解释文本如何经过 tokenizer、embedding 和 Transformer 变成下一个 token
- 理解 softmax、attention、交叉熵、梯度下降和反向传播
- 从零实现一个简化的 GPT，并理解每个组件的作用
- 在 Apple Silicon M3 上训练并运行一个小型语言模型
- 从模型原理解释上下文、tool call、KV Cache、前缀缓存和常见 Agent 问题
- 为继续学习微调、推理优化、模型源码和论文打下基础

## 学习者起点

- 主要使用 Go，具备工程和部分编译原理基础
- 了解 Agent 上下文组织、function calling、tokenizer 和前缀缓存
- Python 基础入门
- 暂未系统学习线性代数、微积分、概率统计和机器学习
- 设备为 Apple Silicon M3

这里不会要求先学完一整套高等数学。数学知识会和模型组件一起出现：

| 数学概念 | 用来理解什么 |
| --- | --- |
| 向量与矩阵乘法 | Embedding、线性层、Attention |
| 概率分布 | 下一个 token 的预测和采样 |
| 指数与对数 | Softmax 和交叉熵 |
| 导数与偏导数 | 参数如何影响损失 |
| 链式法则 | 反向传播 |
| 均值与方差 | LayerNorm 和 RMSNorm |

## 学习方法

每一课遵循相同的顺序：

1. 先运行一个可以观察的现象
2. 用直觉解释现象
3. 学习刚好够用的数学
4. 从零实现核心代码
5. 修改参数并比较结果
6. 联系 Agent 开发中的实际问题
7. 用小练习验证是否真正理解

Python 是主要实验语言，因为 NumPy、PyTorch 和模型生态都以 Python 为主。涉及服务、并发和 Agent 架构时，会结合 Go 进行对照。

## 第一阶段：理解模型如何运行

这一阶段暂不训练 Transformer，重点跟踪一段文本在模型内部经历的完整流程。

| 课次 | 主题 | 可运行实验 | 状态 |
| --- | --- | --- | --- |
| 01 | 文本、Token 与词表 | 实现字符级 tokenizer，观察中英文和代码的编码结果 | 待开始 |
| 02 | Logit、概率与采样 | 实现 softmax、temperature、top-k 和 top-p | 待开始 |
| 03 | 向量、矩阵与 Embedding | 从循环开始实现矩阵乘法和 embedding lookup | 待开始 |
| 04 | 向量空间与相似度 | 计算点积和余弦相似度，观察向量之间的关系 | 待开始 |
| 05 | 神经元与线性层 | 实现 `y = Wx + b`，观察参数如何改变输出 | 待开始 |
| 06 | Self-Attention | 手算并实现单头 Attention，打印 Q、K、V 和权重 | 待开始 |
| 07 | Transformer Block | 组合 Attention、MLP、残差连接和归一化 | 待开始 |
| 08 | 自回归生成 | 实现简化 GPT 的 forward 和 token 生成循环 | 待开始 |
| 09 | 推理与缓存 | 实验 causal mask、KV Cache 和不同上下文长度 | 待开始 |
| 10 | 回到 Agent | 从模型视角分析 prompt、tool call 和前缀缓存 | 待开始 |

阶段验收：能够画出并解释下面这条完整链路。

```text
文本
  -> tokenizer
token IDs
  -> embedding
向量序列
  -> Transformer blocks
logits
  -> softmax 和 sampling
新 token
  -> 重复以上过程
最终文本或 tool call
```

## 第二阶段：从零训练小模型

这一阶段从随机参数开始，让模型通过 next-token prediction 学会生成文本。

| 课次 | 主题 | 可运行实验 | 状态 |
| --- | --- | --- | --- |
| 11 | 数据集与训练样本 | 把连续文本切分成输入和预测目标 | 待开始 |
| 12 | 损失函数 | 手算交叉熵，观察正确 token 概率与 loss 的关系 | 待开始 |
| 13 | 导数与梯度下降 | 用一个参数拟合简单函数并观察更新过程 | 待开始 |
| 14 | 计算图与反向传播 | 实现微型自动求导引擎 | 待开始 |
| 15 | Bigram 语言模型 | 训练第一个能够生成文本的模型 | 待开始 |
| 16 | Tiny Transformer | 训练、保存并运行一个小型 Transformer | 待开始 |

最终项目包含完整训练流水线：

```text
原始文本
  -> 构建词表和 tokenizer
  -> 生成训练集与验证集
  -> 初始化 Tiny Transformer
  -> forward
  -> 计算交叉熵
  -> backward
  -> 更新参数
  -> 保存 checkpoint
  -> 自回归生成文本
```

## Apple Silicon 环境

实验优先兼容 macOS 和 Apple Silicon，不依赖 NVIDIA CUDA。前期实验只需要 Python；训练阶段使用 PyTorch 的 MPS 后端加速，并保留 CPU 回退路径。

建议使用 Python 3.11 或 3.12。具体环境文件和安装命令会在第一课加入，避免在真正需要之前引入大量依赖。

## 学习图谱

仓库提供一个只读的 3D 学习图谱页面：

<https://luoliwoshang.github.io/llm-from-zero/>

页面从 [`web/learning-graph.json`](web/learning-graph.json) 读取节点和父子关系。教学过程中触达新的独立知识点或问题分支时，按照 [`AGENTS.md`](AGENTS.md) 的规则更新 JSON 并通过 Git 提交；[`process.md`](process.md) 继续记录当前教学状态和最新进展。

## 目录规划

```text
.
├── README.md
├── AGENTS.md
├── process.md
├── web/                  # GitHub Pages 的只读 3D 学习图谱
├── lessons/             # 每课的讲解、实验和练习
│   ├── 01-tokenizer/
│   ├── 02-sampling/
│   └── ...
├── llm_from_zero/       # 逐步实现的可复用代码
├── tests/               # 核心实现的自动化测试
├── data/                # 小型公开数据及下载说明
└── checkpoints/         # 本地训练产物，不提交大文件
```

目录会随着课程逐步创建。仓库不会提前放入尚未讲解的大段成品代码。

## 进度

- [x] 确定学习目标和两阶段路线
- [x] 建立学习仓库
- [ ] 第 01 课：文本、Token 与词表
- [ ] 完成第一阶段：理解推理
- [ ] 完成第二阶段：训练 Tiny Transformer

## 原则

- 每个新概念都必须有可运行、可修改、可观察的实验
- 不用 API 调用代替对核心机制的理解
- 不追求一开始就训练大模型，先确保每个组件都能解释
- 优先写清楚的教学代码，再讨论性能优化
- 数据集、依赖和实验结果尽量保持可复现

## 下一步

第 01 课将从最短的语言模型链路入口开始：文本为什么必须变成 token，以及 tokenizer 如何影响模型看到的世界。
