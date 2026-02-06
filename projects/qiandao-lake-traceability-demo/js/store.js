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
