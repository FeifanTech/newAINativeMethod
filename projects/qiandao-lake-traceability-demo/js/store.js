/**
 * 千岛湖溯源 Demo - 浏览器临时存储（localStorage）
 * 键前缀 trace_demo_ 避免与其它应用冲突
 */
const STORAGE_PREFIX = 'trace_demo_';

const KEYS = {
  subjects: STORAGE_PREFIX + 'subjects',
  batchesFarming: STORAGE_PREFIX + 'batches_farming',
  batchesProcessing: STORAGE_PREFIX + 'batches_processing',
  inspections: STORAGE_PREFIX + 'inspections',
  traceCodes: STORAGE_PREFIX + 'trace_codes',
  circulationMock: STORAGE_PREFIX + 'circulation_mock',
};

function load(key, defaultValue = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 解析数量字符串为 { num, unit }（如 "100 尾" -> { num: 100, unit: "尾" }）
 * 与 PRD v0.4 上下游数量约束、技术方案 4.3 对齐
 */
function parseQuantityStr(str) {
  if (!str || typeof str !== 'string') return null;
  const trimmed = str.trim();
  const match = trimmed.match(/^([\d.]+)\s*(.*)$/);
  if (!match) return null;
  const num = parseFloat(match[1]);
  if (Number.isNaN(num)) return null;
  return { num, unit: (match[2] || '').trim() || '—' };
}

/**
 * 计算某养殖批次「已关联下游累计消耗」与「剩余可用数量」（同单位口径，Demo 不做换算）
 * 与 PRD v0.4 4.C.1 / 4.D.1、技术方案 3.2 上下游数量约束对齐
 */
function getUpstreamConsumption(farmingBatchId, farmingList, processingList) {
  const farming = (farmingList || load(KEYS.batchesFarming)).find(b => b.id === farmingBatchId);
  if (!farming) return { consumedStr: '—', remainingStr: '—', remainingNum: 0, unit: '' };
  const parsed = parseQuantityStr(farming.quantity);
  if (!parsed) return { consumedStr: '—', remainingStr: farming.quantity || '—', remainingNum: 0, unit: '' };
  const totalNum = parsed.num;
  const unit = parsed.unit;
  const processings = (processingList || load(KEYS.batchesProcessing)).filter(p => p.upstreamBatchId === farmingBatchId);
  let consumedNum = 0;
  processings.forEach(p => {
    if (!p.consumedUpstreamQty) return;
    const c = parseQuantityStr(p.consumedUpstreamQty);
    if (c && c.unit === unit) consumedNum += c.num;
  });
  const remainingNum = Math.max(0, totalNum - consumedNum);
  return {
    consumedStr: consumedNum > 0 ? consumedNum + ' ' + unit : '0 ' + unit,
    remainingStr: remainingNum + ' ' + unit,
    remainingNum,
    unit,
    totalNum,
  };
}

const store = {
  getSubjects: () => load(KEYS.subjects),
  setSubjects: (list) => save(KEYS.subjects, list),

  getBatchesFarming: () => load(KEYS.batchesFarming),
  setBatchesFarming: (list) => save(KEYS.batchesFarming, list),

  getBatchesProcessing: () => load(KEYS.batchesProcessing),
  setBatchesProcessing: (list) => save(KEYS.batchesProcessing, list),

  getInspections: () => load(KEYS.inspections),
  setInspections: (list) => save(KEYS.inspections, list),

  getTraceCodes: () => load(KEYS.traceCodes),
  setTraceCodes: (list) => save(KEYS.traceCodes, list),

  getCirculationMock: () => load(KEYS.circulationMock),
  setCirculationMock: (list) => save(KEYS.circulationMock, list),

  /** 解析数量字符串；与 PRD v0.4 上下游数量约束对齐 */
  parseQuantityStr,
  /** 计算养殖批次已关联下游累计消耗与剩余可用数量 */
  getUpstreamConsumption,
};

/** 生成唯一 ID */
function nextId(prefix = 'id') {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
}

/** 批次号：QDL-简码-日期-序号 */
function nextBatchNo(prefix = 'QDL') {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const seq = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `${prefix}-${date}-${seq}`;
}

/** 溯源码：数字+字母 */
function nextTraceCode() {
  const s = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 12; i++) code += s[Math.floor(Math.random() * s.length)];
  return code;
}
