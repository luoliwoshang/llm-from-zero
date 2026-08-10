const TYPE_LABELS = {
  course: "课程",
  chapter: "章节",
  concept: "概念",
  question: "问题",
  experiment: "实验",
};

const STATUS_LABELS = {
  learning: "学习中",
  understood: "已理解",
  planned: "待学习",
  archived: "已归档",
};

const TYPE_COLORS = {
  course: "#e6ae5b",
  chapter: "#e6ae5b",
  concept: "#71c4ad",
  question: "#f1846b",
  experiment: "#86a9df",
};

const state = {
  data: null,
  graph: null,
  selectedId: null,
  query: "",
  type: "all",
  status: "all",
  timeIndex: 0,
};

const $ = (selector) => document.querySelector(selector);

function formatDate(value, includeTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "未记录";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

function matchesQuery(node) {
  if (!state.query) return true;
  const haystack = [node.title, node.summary, ...(node.tags || [])].join(" ").toLowerCase();
  return haystack.includes(state.query.toLowerCase());
}

function cutoffDate() {
  const dates = [...new Set(state.data.nodes.map((node) => node.createdAt))].sort();
  return state.timeIndex >= dates.length ? Infinity : new Date(dates[state.timeIndex]).valueOf();
}

function isVisible(node) {
  const isBeforeCutoff = new Date(node.createdAt).valueOf() <= cutoffDate();
  const matchesType = state.type === "all" || node.type === state.type;
  const matchesStatus = state.status === "all" || node.status === state.status;
  return isBeforeCutoff && matchesType && matchesStatus && matchesQuery(node);
}

function updateTimeline() {
  const dates = [...new Set(state.data.nodes.map((node) => node.createdAt))].sort();
  const range = $("#timeline-range");
  range.max = String(dates.length);
  range.value = String(state.timeIndex);
  const dateLabel = $("#timeline-date");
  dateLabel.textContent = state.timeIndex >= dates.length ? "全部节点" : `截至 ${formatDate(dates[state.timeIndex])}`;
  $("#updated-at").textContent = `数据更新 ${formatDate(state.data.updatedAt)}`;
}

function updateGraphVisibility() {
  if (!state.graph) return;
  state.graph.nodeVisibility(isVisible);
  state.graph.linkVisibility((link) => {
    const source = typeof link.source === "object" ? link.source : state.data.nodes.find((node) => node.id === link.source);
    const target = typeof link.target === "object" ? link.target : state.data.nodes.find((node) => node.id === link.target);
    return Boolean(source && target && isVisible(source) && isVisible(target));
  });
  const count = state.data.nodes.filter(isVisible).length;
  $("#visible-count").textContent = `${count} 个节点`;
}

function showDetail(node) {
  state.selectedId = node.id;
  $("#detail").classList.add("open");
  $(".detail-empty").hidden = true;
  $(".detail-content").hidden = false;
  $("#detail-type").textContent = TYPE_LABELS[node.type] || node.type;
  $("#detail-title").textContent = node.title;
  $("#detail-summary").textContent = node.summary || "暂无摘要";
  $("#detail-created").textContent = formatDate(node.createdAt, true);
  $("#detail-status").textContent = STATUS_LABELS[node.status] || node.status;
  $("#detail-lesson").textContent = node.lesson || "课程总览";
  $("#detail-tags").replaceChildren(...(node.tags || []).map((tag) => {
    const element = document.createElement("span");
    element.textContent = `#${tag}`;
    return element;
  }));
  state.graph.nodeColor((item) => item.id === node.id ? "#f4d6a0" : TYPE_COLORS[item.type] || "#a4afa0");
  state.graph.cameraPosition({ x: node.x * 1.4, y: node.y * 1.4, z: node.z * 1.4 }, node, 900);
}

function closeDetail() {
  state.selectedId = null;
  $("#detail").classList.remove("open");
  state.graph.nodeColor((node) => TYPE_COLORS[node.type] || "#a4afa0");
}

function installControls() {
  $("#search").addEventListener("input", (event) => {
    state.query = event.target.value.trim();
    updateGraphVisibility();
  });
  $("#type-filter").addEventListener("change", (event) => {
    state.type = event.target.value;
    updateGraphVisibility();
  });
  $("#status-filter").addEventListener("change", (event) => {
    state.status = event.target.value;
    updateGraphVisibility();
  });
  $("#timeline-range").addEventListener("input", (event) => {
    state.timeIndex = Number(event.target.value);
    updateTimeline();
    updateGraphVisibility();
  });
  $("#fit-graph").addEventListener("click", () => state.graph.zoomToFit(700, 80));
  $("#close-detail").addEventListener("click", closeDetail);
  window.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== $("#search")) {
      event.preventDefault();
      $("#search").focus();
    }
    if (event.key === "Escape") closeDetail();
  });
}

function createGraph(data) {
  state.data = data;
  state.timeIndex = new Set(data.nodes.map((node) => node.createdAt)).size;
  state.graph = ForceGraph3D({
    rendererConfig: { antialias: true, alpha: true, preserveDrawingBuffer: true },
  })( $("#graph") )
    .backgroundColor("#0d1210")
    .showNavInfo(false)
    .dagMode("td")
    .dagLevelDistance(115)
    .nodeLabel((node) => `${node.title}<br><small>${TYPE_LABELS[node.type] || node.type} · ${STATUS_LABELS[node.status] || node.status}</small>`)
    .nodeColor((node) => TYPE_COLORS[node.type] || "#a4afa0")
    .nodeRelSize(5)
    .nodeVal((node) => node.type === "course" ? 12 : node.type === "chapter" ? 8 : node.type === "question" ? 5.5 : 4)
    .linkColor((link) => link.kind === "raises" || link.kind === "leads-to" ? "rgba(241,132,107,.75)" : "rgba(164,175,160,.42)")
    .linkWidth((link) => link.kind === "raises" ? 1.5 : 0.8)
    .linkDirectionalArrowLength(4)
    .linkDirectionalArrowRelPos(1)
    .onNodeClick(showDetail)
    .graphData(data);

  state.graph.d3Force("charge").strength(-180);
  state.graph.d3Force("link").distance(82);
  state.graph.onEngineStop(() => state.graph.zoomToFit(800, 100));
  window.setTimeout(() => state.graph.zoomToFit(800, 120), 1400);
  updateTimeline();
  updateGraphVisibility();
}

async function boot() {
  installControls();
  try {
    const response = await fetch("./learning-graph.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    createGraph(await response.json());
    $("#loading").hidden = true;
  } catch (error) {
    console.error(error);
    $("#loading").hidden = true;
    $("#error").hidden = false;
  }
}

boot();
