/**
 * 千岛湖溯源 Demo - 按角色视角与向导组织交互
 * 政府监管 / 企业登记向导 / 消费者溯源
 */
(function () {
  const main = document.getElementById('main');
  const navEl = document.getElementById('nav-main');
  if (!main) return;

  function render(html) {
    main.innerHTML = html;
  }

  function qs(sel, el = main) {
    return el.querySelector(sel);
  }

  function escapeHtml(s) {
    if (s == null) return '';
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  const STEPS = [
    { path: 'subjects', title: '主体登记', pathName: 'subjects' },
    { path: 'farming', title: '养殖/捕捞', pathName: 'farming' },
    { path: 'processing', title: '加工批次', pathName: 'processing' },
    { path: 'inspection', title: '检测报告', pathName: 'inspection' },
    { path: 'trace-code', title: '溯源码绑定', pathName: 'trace-code' },
  ];

  function getStepIndex(path) {
    const i = STEPS.findIndex(s => s.pathName === path);
    return i >= 0 ? i : 0;
  }

  function renderNav(path) {
    if (!navEl) return;
    const isGov = path.indexOf('/gov') === 0;
    const isEnterprise = path.indexOf('/enterprise') === 0;
    const isConsumer = path.indexOf('/consumer') === 0;
    let html = '<a href="#/" class="nav-link">首页</a>';
    if (isGov) {
      html += '<a href="#/gov/subjects" class="nav-link">主体管理</a>';
      html += '<a href="#/gov/farming" class="nav-link">养殖批次</a>';
      html += '<a href="#/gov/processing" class="nav-link">加工批次</a>';
      html += '<a href="#/gov/inspection" class="nav-link">检测报告</a>';
      html += '<a href="#/gov/trace-code" class="nav-link">溯源码</a>';
      html += '<a href="#/gov/dashboard" class="nav-link">监管报表</a>';
    } else if (isEnterprise) {
      STEPS.forEach((s, i) => {
        html += `<a href="#/enterprise/step/${i + 1}" class="nav-link">${s.title}</a>`;
      });
    } else if (isConsumer) {
      html += '<a href="#/consumer" class="nav-link">溯源查询</a>';
    } else {
      html += '<a href="#/gov/dashboard" class="nav-link">政府监管</a>';
      html += '<a href="#/enterprise/step/1" class="nav-link">企业登记</a>';
      html += '<a href="#/consumer" class="nav-link">消费者溯源</a>';
    }
    navEl.innerHTML = html;
  }

  /* ---------- 首页：角色入口 ---------- */
  function homePage() {
    renderNav('/');
    render(`
      <div class="page-home gov-theme">
        <div class="hero">
          <h1 class="hero-title">千岛湖全鱼品溯源平台</h1>
          <p class="hero-desc">从水体到餐桌，全链路可追溯 · 请选择您的使用角色</p>
        </div>
        <div class="role-cards">
          <a href="#/gov/dashboard" class="role-card gov">
            <div class="role-icon">政</div>
            <h2>政府监管</h2>
            <p>主体与批次监管、检测与流向监控、报表与审计</p>
          </a>
          <a href="#/enterprise/step/1" class="role-card enterprise">
            <div class="role-icon">企</div>
            <h2>企业登记向导</h2>
            <p>按步骤完成：主体登记 → 养殖 → 加工 → 检测 → 溯源码绑定</p>
          </a>
          <a href="#/consumer" class="role-card consumer">
            <div class="role-icon">溯</div>
            <h2>消费者溯源</h2>
            <p>输入溯源码，查看「鱼的一生」全链路信息</p>
          </a>
        </div>
        <p class="page-footer-hint">Demo 数据仅存于浏览器，无后端 · 流通环节由蚂蚁数科已建成，本平台对接展示</p>
      </div>
    `);
  }

  /* ---------- 政府监管：各子页复用原有逻辑，仅包一层 gov 布局 ---------- */
  function govPage(subPath) {
    renderNav('/gov');
    const content = document.createElement('div');
    content.className = 'gov-layout';
    main.innerHTML = '<div class="gov-layout"><div class="gov-content" id="gov-content"></div></div>';
    const contentBox = document.getElementById('gov-content');
    if (!contentBox) return;

    const pages = {
      subjects: subjectsContent,
      farming: farmingContent,
      processing: processingContent,
      inspection: inspectionContent,
      'trace-code': traceCodeContent,
      dashboard: dashboardContent,
    };
    const fn = pages[subPath] || dashboardContent;
    contentBox.innerHTML = fn();
    bindGovForms(subPath, contentBox);
  }

  function subjectsContent() {
    const list = store.getSubjects();
    return `
      <div class="page-block">
        <h1 class="page-title">主体管理</h1>
        <p class="page-desc">主体注册、认证与链身份配置</p>
        <div class="toolbar">
          <button type="button" class="btn btn-primary" data-action="add-subject">新增主体</button>
        </div>
        <div class="card-block">
          <table class="table table-zebra">
            <thead><tr><th>名称</th><th>类型</th><th>区域</th><th>状态</th></tr></thead>
            <tbody>
              ${list.length ? list.map(s => `<tr><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.type)}</td><td>${escapeHtml(s.region || '-')}</td><td><span class="status-dot ok"></span>${s.status || '已通过'}</td></tr>`).join('') : '<tr><td colspan="4" class="empty">暂无数据</td></tr>'}
            </tbody>
          </table>
        </div>
        <div id="form-subject" class="form-drawer" style="display:none;">
          <h3 class="form-drawer-title">新增主体</h3>
          <form id="form-subject-f" class="form-grid">
            <div class="form-item"><label>名称</label><input type="text" name="name" required /></div>
            <div class="form-item"><label>类型</label><select name="type"><option value="养殖/捕捞企业">养殖/捕捞企业</option><option value="加工企业">加工企业</option><option value="检测机构">检测机构</option><option value="政府监管">政府监管</option></select></div>
            <div class="form-item"><label>区域</label><input type="text" name="region" placeholder="如淳安县/千岛湖" /></div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">保存</button>
              <button type="button" class="btn btn-default" data-action="cancel-subject">取消</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function farmingContent() {
    const list = store.getBatchesFarming();
    return `
      <div class="page-block">
        <h1 class="page-title">养殖/捕捞批次</h1>
        <p class="page-desc">保水渔业与 RAS 工厂化双模式登记</p>
        <div class="toolbar"><button type="button" class="btn btn-primary" data-action="add-farming">新增批次</button></div>
        <div class="card-block">
          <table class="table table-zebra">
            <thead><tr><th>批次号</th><th>模式</th><th>品种</th><th>数量</th><th>日期</th><th>水域</th></tr></thead>
            <tbody>
              ${list.length ? list.map(b => `<tr><td>${escapeHtml(b.batchNo)}</td><td>${escapeHtml(b.mode)}</td><td>${escapeHtml(b.variety)}</td><td>${escapeHtml(b.quantity)}</td><td>${escapeHtml(b.date)}</td><td>${escapeHtml(b.waterArea || '-')}</td></tr>`).join('') : '<tr><td colspan="6" class="empty">暂无数据</td></tr>'}
            </tbody>
          </table>
        </div>
        <div id="form-farming" class="form-drawer" style="display:none;">
          <h3 class="form-drawer-title">新增养殖/捕捞批次</h3>
          <form id="form-farming-f" class="form-grid"></form>
        </div>
      </div>
    `;
  }

  function processingContent() {
    const list = store.getBatchesProcessing();
    return `
      <div class="page-block">
        <h1 class="page-title">加工批次</h1>
        <p class="page-desc">传统路径与现代路径登记，关联上游养殖批次</p>
        <div class="toolbar"><button type="button" class="btn btn-primary" data-action="add-processing">新增加工批次</button></div>
        <div class="card-block">
          <table class="table table-zebra">
            <thead><tr><th>加工批次号</th><th>路径</th><th>关联上游</th><th>日期</th><th>产出量</th></tr></thead>
            <tbody>
              ${list.length ? list.map(b => `<tr><td>${escapeHtml(b.batchNo)}</td><td>${escapeHtml(b.pathType)}</td><td>${escapeHtml(b.upstreamBatchNo || '-')}</td><td>${escapeHtml(b.date)}</td><td>${escapeHtml(b.outputQty)}</td></tr>`).join('') : '<tr><td colspan="5" class="empty">暂无数据</td></tr>'}
            </tbody>
          </table>
        </div>
        <div id="form-processing" class="form-drawer" style="display:none;">
          <h3 class="form-drawer-title">新增加工批次</h3>
          <form id="form-processing-f" class="form-grid"></form>
        </div>
      </div>
    `;
  }

  function inspectionContent() {
    const list = store.getInspections();
    return `
      <div class="page-block">
        <h1 class="page-title">检测报告</h1>
        <p class="page-desc">关联批次、检测类型与结论</p>
        <div class="toolbar"><button type="button" class="btn btn-primary" data-action="add-inspection">新增检测</button></div>
        <div class="card-block">
          <table class="table table-zebra">
            <thead><tr><th>关联批次</th><th>检测类型</th><th>结论</th><th>日期</th></tr></thead>
            <tbody>
              ${list.length ? list.map(i => `<tr><td>${escapeHtml(i.batchNo)}</td><td>${escapeHtml(i.type)}</td><td>${i.conclusion === '合格' ? '<span class="badge badge-ok">合格</span>' : '<span class="badge badge-fail">不合格</span>'}</td><td>${escapeHtml(i.date)}</td></tr>`).join('') : '<tr><td colspan="4" class="empty">暂无数据</td></tr>'}
            </tbody>
          </table>
        </div>
        <div id="form-inspection" class="form-drawer" style="display:none;">
          <h3 class="form-drawer-title">新增检测报告</h3>
          <form id="form-inspection-f" class="form-grid"></form>
        </div>
      </div>
    `;
  }

  function traceCodeContent() {
    const codes = store.getTraceCodes();
    return `
      <div class="page-block">
        <h1 class="page-title">溯源码绑定</h1>
        <p class="page-desc">本平台生成溯源码并绑定批次；流通环节由蚂蚁数科已建成</p>
        <div class="toolbar"><button type="button" class="btn btn-primary" data-action="add-trace">生成溯源码并绑定</button></div>
        <div class="card-block">
          <table class="table table-zebra">
            <thead><tr><th>溯源码</th><th>绑定批次</th><th>绑定时间</th><th>操作</th></tr></thead>
            <tbody>
              ${codes.length ? codes.map(c => `<tr><td><code class="trace-code">${escapeHtml(c.code)}</code></td><td>${escapeHtml(c.batchNo)}</td><td>${escapeHtml(c.boundAt)}</td><td><a href="#/consumer?code=${encodeURIComponent(c.code)}" class="link">查看溯源</a></td></tr>`).join('') : '<tr><td colspan="4" class="empty">暂无溯源码</td></tr>'}
            </tbody>
          </table>
        </div>
        <div id="form-trace" class="form-drawer" style="display:none;">
          <h3 class="form-drawer-title">选择批次并生成溯源码</h3>
          <form id="form-trace-f" class="form-grid"></form>
        </div>
      </div>
    `;
  }

  function dashboardContent() {
    const subjects = store.getSubjects();
    const farming = store.getBatchesFarming();
    const processing = store.getBatchesProcessing();
    const inspections = store.getInspections();
    const codes = store.getTraceCodes();
    const okCount = inspections.filter(i => i.conclusion === '合格').length;
    const okRate = inspections.length ? (okCount / inspections.length * 100).toFixed(1) : '-';
    return `
      <div class="page-block">
        <h1 class="page-title">监管报表</h1>
        <p class="page-desc">主体、批次、检测与流向概览</p>
        <div class="stats-row">
          <div class="stat-card"><div class="stat-num">${subjects.length}</div><div class="stat-label">主体总数</div></div>
          <div class="stat-card"><div class="stat-num">${farming.length}</div><div class="stat-label">养殖批次</div></div>
          <div class="stat-card"><div class="stat-num">${processing.length}</div><div class="stat-label">加工批次</div></div>
          <div class="stat-card"><div class="stat-num">${inspections.length}</div><div class="stat-label">检测报告</div></div>
          <div class="stat-card"><div class="stat-num">${okRate}%</div><div class="stat-label">检测合格率</div></div>
          <div class="stat-card"><div class="stat-num">${codes.length}</div><div class="stat-label">溯源码</div></div>
        </div>
        <div class="card-block">
          <h3 class="block-title">批次与流向</h3>
          <table class="table table-zebra">
            <thead><tr><th>批次号</th><th>环节</th><th>品种/类型</th><th>日期</th></tr></thead>
            <tbody>
              ${farming.map(b => `<tr><td>${escapeHtml(b.batchNo)}</td><td>养殖/捕捞</td><td>${escapeHtml(b.variety)}</td><td>${escapeHtml(b.date)}</td></tr>`).join('')}
              ${processing.map(b => `<tr><td>${escapeHtml(b.batchNo)}</td><td>加工</td><td>${escapeHtml(b.processType || '-')}</td><td>${escapeHtml(b.date)}</td></tr>`).join('')}
              ${!farming.length && !processing.length ? '<tr><td colspan="4" class="empty">暂无批次数据</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function bindGovForms(subPath, container, refreshCallback) {
    const formPanel = container.querySelector('[id^="form-"]');
    const addBtn = container.querySelector('[data-action^="add-"]');
    const cancelBtn = container.querySelector('[data-action^="cancel-"]');
    const refresh = refreshCallback ? () => refreshCallback() : () => govPage(subPath);
    if (addBtn) addBtn.addEventListener('click', () => { if (formPanel) formPanel.style.display = 'block'; });
    if (cancelBtn) cancelBtn.addEventListener('click', () => { if (formPanel) formPanel.style.display = 'none'; });

    const subjects = store.getSubjects();
    const farming = store.getBatchesFarming();
    const processing = store.getBatchesProcessing();
    const inspections = store.getInspections();
    const allBatches = [...farming.map(b => ({ ...b, source: 'farming' })), ...processing.map(b => ({ ...b, source: 'processing' }))];
    const farmSubjects = subjects.filter(s => s.type === '养殖/捕捞企业' || s.type === '政府监管');
    const procSubjects = subjects.filter(s => s.type === '加工企业');

    if (subPath === 'subjects') {
      const form = container.querySelector('#form-subject-f');
      if (form) form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const list = store.getSubjects();
        list.push({ id: nextId('subject'), name: fd.get('name'), type: fd.get('type'), region: fd.get('region') || '', status: '已通过' });
        store.setSubjects(list);
        if (formPanel) formPanel.style.display = 'none';
        form.reset();
        refresh();
      });
    }

    if (subPath === 'farming') {
      const form = container.querySelector('#form-farming-f');
      if (form) {
        if (!refreshCallback) form.innerHTML = `
          <div class="form-item"><label>主体</label><select name="subjectId" required>${farmSubjects.length ? farmSubjects.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('') : '<option value="">请先添加养殖主体</option>'}</select></div>
          <div class="form-item"><label>模式</label><select name="mode"><option value="保水渔业">保水渔业</option><option value="RAS工厂化">RAS工厂化</option></select></div>
          <div class="form-item"><label>品种</label><input type="text" name="variety" placeholder="如鲢鱼、鳙鱼" required /></div>
          <div class="form-item"><label>数量</label><input type="text" name="quantity" placeholder="如 100 尾" required /></div>
          <div class="form-item"><label>日期</label><input type="date" name="date" required /></div>
          <div class="form-item"><label>水域</label><input type="text" name="waterArea" placeholder="如千岛湖XX区域" /></div>
          <div class="form-actions"><button type="submit" class="btn btn-primary">保存</button><button type="button" class="btn btn-default" data-action="cancel-farming">取消</button></div>
        `;
        form.querySelector('[data-action="cancel-farming"]')?.addEventListener('click', () => { if (formPanel) formPanel.style.display = 'none'; });
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const fd = new FormData(form);
          const list = store.getBatchesFarming();
          const sub = subjects.find(s => s.id === fd.get('subjectId'));
          const batchNo = nextBatchNo(sub ? sub.name.slice(0, 2) : 'QDL');
          list.push({ id: nextId('farm'), subjectId: fd.get('subjectId'), batchNo, mode: fd.get('mode'), variety: fd.get('variety'), quantity: fd.get('quantity'), date: fd.get('date'), waterArea: fd.get('waterArea') || '' });
          store.setBatchesFarming(list);
          if (formPanel) formPanel.style.display = 'none';
          form.reset();
          refresh();
        });
      }
    }

    if (subPath === 'processing') {
      const form = container.querySelector('#form-processing-f');
      if (form) {
        if (!refreshCallback) form.innerHTML = `
          <div class="form-item"><label>主体</label><select name="subjectId" required>${procSubjects.length ? procSubjects.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('') : '<option value="">请先添加加工企业</option>'}</select></div>
          <div class="form-item"><label>上游批次（养殖）</label><select name="upstreamBatchId">${farming.length ? farming.map(b => `<option value="${b.id}">${escapeHtml(b.batchNo)} ${b.variety}</option>`).join('') : '<option value="">无养殖批次</option>'}</select></div>
          <div class="form-item"><label>路径</label><select name="pathType"><option value="传统路径">传统路径</option><option value="现代路径">现代路径</option></select></div>
          <div class="form-item"><label>加工类型</label><input type="text" name="processType" placeholder="如分割、冷冻" /></div>
          <div class="form-item"><label>加工日期</label><input type="date" name="date" required /></div>
          <div class="form-item"><label>产出量</label><input type="text" name="outputQty" placeholder="如 50 箱" required /></div>
          <div class="form-actions"><button type="submit" class="btn btn-primary">保存</button><button type="button" class="btn btn-default" data-action="cancel-processing">取消</button></div>
        `;
        form.querySelector('[data-action="cancel-processing"]')?.addEventListener('click', () => { if (formPanel) formPanel.style.display = 'none'; });
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const fd = new FormData(form);
          const upstream = farming.find(b => b.id === fd.get('upstreamBatchId'));
          const list = store.getBatchesProcessing();
          list.push({ id: nextId('proc'), subjectId: fd.get('subjectId'), batchNo: nextBatchNo('JG'), upstreamBatchId: fd.get('upstreamBatchId') || null, upstreamBatchNo: upstream ? upstream.batchNo : '', pathType: fd.get('pathType'), processType: fd.get('processType') || '', date: fd.get('date'), outputQty: fd.get('outputQty') });
          store.setBatchesProcessing(list);
          if (formPanel) formPanel.style.display = 'none';
          refresh();
        });
      }
    }

    if (subPath === 'inspection') {
      const form = container.querySelector('#form-inspection-f');
      if (form) {
        if (!refreshCallback) form.innerHTML = `
          <div class="form-item"><label>关联批次</label><select name="batchId" required>${allBatches.length ? allBatches.map(b => `<option value="${b.id}" data-source="${b.source}">${escapeHtml(b.batchNo)}</option>`).join('') : '<option value="">无批次</option>'}</select></div>
          <div class="form-item"><label>检测类型</label><select name="type"><option value="药残">药残</option><option value="重金属">重金属</option><option value="感官">感官</option></select></div>
          <div class="form-item"><label>结论</label><select name="conclusion"><option value="合格">合格</option><option value="不合格">不合格</option></select></div>
          <div class="form-item"><label>检测日期</label><input type="date" name="date" required /></div>
          <div class="form-actions"><button type="submit" class="btn btn-primary">保存</button><button type="button" class="btn btn-default" data-action="cancel-inspection">取消</button></div>
        `;
        form.querySelector('[data-action="cancel-inspection"]')?.addEventListener('click', () => { if (formPanel) formPanel.style.display = 'none'; });
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const fd = new FormData(form);
          const opt = form.querySelector('select[name="batchId"]')?.options[form.querySelector('select[name="batchId"]').selectedIndex];
          const source = opt?.getAttribute('data-source') || 'farming';
          const batch = source === 'farming' ? farming.find(b => b.id === fd.get('batchId')) : processing.find(b => b.id === fd.get('batchId'));
          const list = store.getInspections();
          list.push({ id: nextId('ins'), batchId: fd.get('batchId'), batchNo: batch ? batch.batchNo : '-', batchSource: source, type: fd.get('type'), conclusion: fd.get('conclusion'), date: fd.get('date') });
          store.setInspections(list);
          if (formPanel) formPanel.style.display = 'none';
          refresh();
        });
      }
    }

    if (subPath === 'trace-code') {
      const form = container.querySelector('#form-trace-f');
      if (form) {
        if (!refreshCallback) {
          const farmOpts = farming.map(b => `<option value="farm:${b.id}">养殖 ${escapeHtml(b.batchNo)}</option>`).join('');
          const procOpts = processing.map(b => `<option value="proc:${b.id}">加工 ${escapeHtml(b.batchNo)}</option>`).join('');
          form.innerHTML = `
          <div class="form-item"><label>绑定批次</label><select name="batchId" required>${farmOpts}${procOpts}${!farmOpts && !procOpts ? '<option value="">请先登记养殖或加工批次</option>' : ''}</select></div>
          <div class="form-actions"><button type="submit" class="btn btn-primary">生成并绑定</button><button type="button" class="btn btn-default" data-action="cancel-trace">取消</button></div>
        `;
        }
        form.querySelector('[data-action="cancel-trace"]')?.addEventListener('click', () => { if (formPanel) formPanel.style.display = 'none'; });
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const fd = new FormData(form);
          const [source, id] = (fd.get('batchId') || '').split(':');
          const batch = source === 'farm' ? farming.find(b => b.id === id) : processing.find(b => b.id === id);
          if (!batch) return;
          const list = store.getTraceCodes();
          list.push({ code: nextTraceCode(), batchId: id, batchType: source, batchNo: batch.batchNo, boundAt: new Date().toLocaleString('zh-CN') });
          store.setTraceCodes(list);
          if (formPanel) formPanel.style.display = 'none';
          refresh();
        });
      }
    }
  }

  /* ---------- 企业端：向导步骤 ---------- */
  function enterpriseStepPage(stepNum) {
    renderNav('/enterprise');
    const stepIndex = Math.max(0, Math.min(parseInt(stepNum, 10) - 1, STEPS.length - 1));
    const currentPath = STEPS[stepIndex].pathName;

    let stepperHtml = '<div class="stepper">';
    STEPS.forEach((s, i) => {
      const done = i < stepIndex;
      const current = i === stepIndex;
      stepperHtml += `<a href="#/enterprise/step/${i + 1}" class="stepper-item ${done ? 'done' : ''} ${current ? 'current' : ''}"><span class="stepper-num">${i + 1}</span><span class="stepper-title">${s.title}</span></a>`;
      if (i < STEPS.length - 1) stepperHtml += '<span class="stepper-line"></span>';
    });
    stepperHtml += '</div>';

    main.innerHTML = `<div class="page-enterprise gov-theme"><div class="wizard-header">${stepperHtml}</div><div class="wizard-body" id="wizard-body"></div></div>`;
    const body = document.getElementById('wizard-body');
    if (!body) return;

    body.innerHTML = govPageContent(currentPath);
    bindGovForms(currentPath, body, () => enterpriseStepPage(stepIndex + 1));
  }

  function govPageContent(subPath) {
    const listSub = store.getSubjects();
    const listFarm = store.getBatchesFarming();
    const listProc = store.getBatchesProcessing();
    const listInsp = store.getInspections();
    const listCodes = store.getTraceCodes();
    const farmSubs = listSub.filter(s => s.type === '养殖/捕捞企业' || s.type === '政府监管');
    const procSubs = listSub.filter(s => s.type === '加工企业');
    const farming = store.getBatchesFarming();
    const processing = store.getBatchesProcessing();
    const allBatches = [...farming.map(b => ({ ...b, source: 'farming' })), ...processing.map(b => ({ ...b, source: 'processing' }))];

    switch (subPath) {
      case 'subjects':
        return `
          <div class="page-block">
            <h2 class="step-heading">第一步：主体登记</h2>
            <p class="page-desc">请先登记参与溯源的主体（养殖企业、加工企业、检测机构等）</p>
            <div class="toolbar"><button type="button" class="btn btn-primary" data-action="add-subject">新增主体</button></div>
            <div class="card-block">
              <table class="table table-zebra">
                <thead><tr><th>名称</th><th>类型</th><th>区域</th><th>状态</th></tr></thead>
                <tbody>
                  ${listSub.length ? listSub.map(s => `<tr><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.type)}</td><td>${escapeHtml(s.region || '-')}</td><td><span class="status-dot ok"></span>已通过</td></tr>`).join('') : '<tr><td colspan="4" class="empty">暂无数据，请点击「新增主体」</td></tr>'}
                </tbody>
              </table>
            </div>
            <div id="form-subject" class="form-drawer" style="display:none;">
              <h3 class="form-drawer-title">新增主体</h3>
              <form id="form-subject-f" class="form-grid">
                <div class="form-item"><label>名称</label><input type="text" name="name" required /></div>
                <div class="form-item"><label>类型</label><select name="type"><option value="养殖/捕捞企业">养殖/捕捞企业</option><option value="加工企业">加工企业</option><option value="检测机构">检测机构</option></select></div>
                <div class="form-item"><label>区域</label><input type="text" name="region" placeholder="如淳安县/千岛湖" /></div>
                <div class="form-actions"><button type="submit" class="btn btn-primary">保存</button><button type="button" class="btn btn-default" data-action="cancel-subject">取消</button></div>
              </form>
            </div>
            <div class="wizard-footer">
              <a href="#/enterprise/step/2" class="btn btn-primary">下一步：养殖/捕捞</a>
            </div>
          </div>
        `;
      case 'farming':
        return `
          <div class="page-block">
            <h2 class="step-heading">第二步：养殖/捕捞登记</h2>
            <p class="page-desc">登记养殖或捕捞批次，选择保水渔业或 RAS 工厂化模式</p>
            <div class="toolbar"><button type="button" class="btn btn-primary" data-action="add-farming">新增批次</button></div>
            <div class="card-block">
              <table class="table table-zebra">
                <thead><tr><th>批次号</th><th>模式</th><th>品种</th><th>数量</th><th>日期</th></tr></thead>
                <tbody>
                  ${listFarm.length ? listFarm.map(b => `<tr><td>${escapeHtml(b.batchNo)}</td><td>${escapeHtml(b.mode)}</td><td>${escapeHtml(b.variety)}</td><td>${escapeHtml(b.quantity)}</td><td>${escapeHtml(b.date)}</td></tr>`).join('') : '<tr><td colspan="5" class="empty">暂无数据</td></tr>'}
                </tbody>
              </table>
            </div>
            <div id="form-farming" class="form-drawer" style="display:none;">
              <h3 class="form-drawer-title">新增养殖/捕捞批次</h3>
              <form id="form-farming-f" class="form-grid">
                <div class="form-item"><label>主体</label><select name="subjectId" required>${farmSubs.length ? farmSubs.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('') : '<option value="">请先在步骤一添加养殖主体</option>'}</select></div>
                <div class="form-item"><label>模式</label><select name="mode"><option value="保水渔业">保水渔业</option><option value="RAS工厂化">RAS工厂化</option></select></div>
                <div class="form-item"><label>品种</label><input type="text" name="variety" placeholder="如鲢鱼、鳙鱼" required /></div>
                <div class="form-item"><label>数量</label><input type="text" name="quantity" placeholder="如 100 尾" required /></div>
                <div class="form-item"><label>日期</label><input type="date" name="date" required /></div>
                <div class="form-item"><label>水域</label><input type="text" name="waterArea" placeholder="如千岛湖XX区域" /></div>
                <div class="form-actions"><button type="submit" class="btn btn-primary">保存</button><button type="button" class="btn btn-default" data-action="cancel-farming">取消</button></div>
              </form>
            </div>
            <div class="wizard-footer">
              <a href="#/enterprise/step/1" class="btn btn-default">上一步</a>
              <a href="#/enterprise/step/3" class="btn btn-primary">下一步：加工批次</a>
            </div>
          </div>
        `;
      case 'processing':
        return `
          <div class="page-block">
            <h2 class="step-heading">第三步：加工批次登记</h2>
            <p class="page-desc">新增加工批次并关联上游养殖批次</p>
            <div class="toolbar"><button type="button" class="btn btn-primary" data-action="add-processing">新增加工批次</button></div>
            <div class="card-block">
              <table class="table table-zebra">
                <thead><tr><th>加工批次号</th><th>路径</th><th>关联上游</th><th>日期</th><th>产出量</th></tr></thead>
                <tbody>
                  ${listProc.length ? listProc.map(b => `<tr><td>${escapeHtml(b.batchNo)}</td><td>${escapeHtml(b.pathType)}</td><td>${escapeHtml(b.upstreamBatchNo || '-')}</td><td>${escapeHtml(b.date)}</td><td>${escapeHtml(b.outputQty)}</td></tr>`).join('') : '<tr><td colspan="5" class="empty">暂无数据</td></tr>'}
                </tbody>
              </table>
            </div>
            <div id="form-processing" class="form-drawer" style="display:none;">
              <h3 class="form-drawer-title">新增加工批次</h3>
              <form id="form-processing-f" class="form-grid">
                <div class="form-item"><label>主体</label><select name="subjectId" required>${procSubs.length ? procSubs.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('') : '<option value="">请先添加加工企业</option>'}</select></div>
                <div class="form-item"><label>上游批次（养殖）</label><select name="upstreamBatchId">${farming.length ? farming.map(b => `<option value="${b.id}">${escapeHtml(b.batchNo)} ${b.variety}</option>`).join('') : '<option value="">无养殖批次</option>'}</select></div>
                <div class="form-item"><label>路径</label><select name="pathType"><option value="传统路径">传统路径</option><option value="现代路径">现代路径</option></select></div>
                <div class="form-item"><label>加工类型</label><input type="text" name="processType" placeholder="如分割、冷冻" /></div>
                <div class="form-item"><label>加工日期</label><input type="date" name="date" required /></div>
                <div class="form-item"><label>产出量</label><input type="text" name="outputQty" placeholder="如 50 箱" required /></div>
                <div class="form-actions"><button type="submit" class="btn btn-primary">保存</button><button type="button" class="btn btn-default" data-action="cancel-processing">取消</button></div>
              </form>
            </div>
            <div class="wizard-footer">
              <a href="#/enterprise/step/2" class="btn btn-default">上一步</a>
              <a href="#/enterprise/step/4" class="btn btn-primary">下一步：检测报告</a>
            </div>
          </div>
        `;
      case 'inspection':
        return `
          <div class="page-block">
            <h2 class="step-heading">第四步：检测报告</h2>
            <p class="page-desc">为养殖或加工批次录入检测结果（可选步骤）</p>
            <div class="toolbar"><button type="button" class="btn btn-primary" data-action="add-inspection">新增检测</button></div>
            <div class="card-block">
              <table class="table table-zebra">
                <thead><tr><th>关联批次</th><th>检测类型</th><th>结论</th><th>日期</th></tr></thead>
                <tbody>
                  ${listInsp.length ? listInsp.map(i => `<tr><td>${escapeHtml(i.batchNo)}</td><td>${escapeHtml(i.type)}</td><td>${i.conclusion === '合格' ? '<span class="badge badge-ok">合格</span>' : '<span class="badge badge-fail">不合格</span>'}</td><td>${escapeHtml(i.date)}</td></tr>`).join('') : '<tr><td colspan="4" class="empty">暂无数据</td></tr>'}
                </tbody>
              </table>
            </div>
            <div id="form-inspection" class="form-drawer" style="display:none;">
              <h3 class="form-drawer-title">新增检测报告</h3>
              <form id="form-inspection-f" class="form-grid">
                <div class="form-item"><label>关联批次</label><select name="batchId" required>${allBatches.length ? allBatches.map(b => `<option value="${b.id}" data-source="${b.source}">${escapeHtml(b.batchNo)}</option>`).join('') : '<option value="">无批次</option>'}</select></div>
                <div class="form-item"><label>检测类型</label><select name="type"><option value="药残">药残</option><option value="重金属">重金属</option><option value="感官">感官</option></select></div>
                <div class="form-item"><label>结论</label><select name="conclusion"><option value="合格">合格</option><option value="不合格">不合格</option></select></div>
                <div class="form-item"><label>检测日期</label><input type="date" name="date" required /></div>
                <div class="form-actions"><button type="submit" class="btn btn-primary">保存</button><button type="button" class="btn btn-default" data-action="cancel-inspection">取消</button></div>
              </form>
            </div>
            <div class="wizard-footer">
              <a href="#/enterprise/step/3" class="btn btn-default">上一步</a>
              <a href="#/enterprise/step/5" class="btn btn-primary">下一步：溯源码绑定</a>
            </div>
          </div>
        `;
      case 'trace-code':
        const farmOpts = farming.map(b => `<option value="farm:${b.id}">养殖 ${escapeHtml(b.batchNo)}</option>`).join('');
        const procOpts = processing.map(b => `<option value="proc:${b.id}">加工 ${escapeHtml(b.batchNo)}</option>`).join('');
        return `
          <div class="page-block">
            <h2 class="step-heading">第五步：溯源码绑定</h2>
            <p class="page-desc">选择养殖或加工批次，生成溯源码并绑定，完成后消费者可扫码查询「鱼的一生」</p>
            <div class="toolbar"><button type="button" class="btn btn-primary" data-action="add-trace">生成溯源码并绑定</button></div>
            <div class="card-block">
              <table class="table table-zebra">
                <thead><tr><th>溯源码</th><th>绑定批次</th><th>绑定时间</th><th>操作</th></tr></thead>
                <tbody>
                  ${listCodes.length ? listCodes.map(c => `<tr><td><code class="trace-code">${escapeHtml(c.code)}</code></td><td>${escapeHtml(c.batchNo)}</td><td>${escapeHtml(c.boundAt)}</td><td><a href="#/consumer?code=${encodeURIComponent(c.code)}" class="link">查看溯源</a></td></tr>`).join('') : '<tr><td colspan="4" class="empty">暂无溯源码</td></tr>'}
                </tbody>
              </table>
            </div>
            <div id="form-trace" class="form-drawer" style="display:none;">
              <h3 class="form-drawer-title">选择批次并生成溯源码</h3>
              <form id="form-trace-f" class="form-grid">
                <div class="form-item"><label>绑定批次</label><select name="batchId" required>${farmOpts}${procOpts}${!farmOpts && !procOpts ? '<option value="">请先登记养殖或加工批次</option>' : ''}</select></div>
                <div class="form-actions"><button type="submit" class="btn btn-primary">生成并绑定</button><button type="button" class="btn btn-default" data-action="cancel-trace">取消</button></div>
              </form>
            </div>
            <div class="wizard-footer">
              <a href="#/enterprise/step/4" class="btn btn-default">上一步</a>
              <a href="#/consumer" class="btn btn-primary">去消费者溯源页查看</a>
            </div>
          </div>
        `;
      default:
        return '<div class="page-block">未知步骤</div>';
    }
  }

  /* ---------- 消费者：溯源查询 ---------- */
  function consumerPage() {
    renderNav('/consumer');
    const hash = location.hash;
    const codeFromQuery = (hash.indexOf('?code=') >= 0) ? decodeURIComponent(hash.replace(/^[^?]*\?code=/, '')) : '';
    render(`
      <div class="page-consumer gov-theme">
        <div class="consumer-hero">
          <h1 class="consumer-title">溯源查询 · 鱼的一生</h1>
          <p class="consumer-desc">请输入产品上的溯源码，查询从养殖到销售的全链路信息</p>
        </div>
        <div class="query-card">
          <div class="query-row">
            <input type="text" id="trace-input" class="input-lg" value="${escapeHtml(codeFromQuery)}" placeholder="请输入 12 位溯源码" maxlength="12" />
            <button type="button" class="btn btn-primary btn-lg" id="trace-search">查询</button>
          </div>
        </div>
        <div id="trace-result" class="trace-result"></div>
      </div>
    `);

    const input = qs('#trace-input');
    const resultEl = qs('#trace-result');

    function doSearch(code) {
      code = (code || (input && input.value) || '').trim().toUpperCase();
      if (!code) {
        resultEl.innerHTML = '<p class="tip">请输入溯源码</p>';
        return;
      }
      const traceCodes = store.getTraceCodes();
      const binding = traceCodes.find(c => c.code === code);
      if (!binding) {
        resultEl.innerHTML = '<p class="tip tip-error">未找到该溯源码，请确认后重试</p>';
        return;
      }

      const farming = store.getBatchesFarming();
      const processing = store.getBatchesProcessing();
      const inspections = store.getInspections();
      const subjects = store.getSubjects();
      const nodes = [];
      let currentBatch = binding.batchType === 'farm' ? farming.find(b => b.id === binding.batchId) : processing.find(b => b.id === binding.batchId);
      if (currentBatch) {
        const sub = subjects.find(s => s.id === currentBatch.subjectId);
        if (binding.batchType === 'farm') {
          nodes.push({ step: '养殖/捕捞', name: currentBatch.mode || '养殖', batchNo: currentBatch.batchNo, time: currentBatch.date, detail: `${currentBatch.variety} ${currentBatch.quantity}，水域 ${currentBatch.waterArea || '-'}`, subject: sub?.name });
          inspections.filter(i => i.batchId === currentBatch.id).forEach(i => nodes.push({ step: '检测', name: i.type, batchNo: i.batchNo, time: i.date, detail: `结论：${i.conclusion}`, subject: null }));
          const proc = processing.find(p => p.upstreamBatchId === currentBatch.id);
          if (proc) {
            const subP = subjects.find(s => s.id === proc.subjectId);
            nodes.push({ step: '加工', name: proc.pathType, batchNo: proc.batchNo, time: proc.date, detail: `${proc.processType || '-'}，产出 ${proc.outputQty}`, subject: subP?.name });
            inspections.filter(i => i.batchId === proc.id).forEach(i => nodes.push({ step: '检测', name: i.type, batchNo: i.batchNo, time: i.date, detail: `结论：${i.conclusion}`, subject: null }));
          }
        } else {
          nodes.push({ step: '加工', name: currentBatch.pathType, batchNo: currentBatch.batchNo, time: currentBatch.date, detail: `${currentBatch.processType || '-'}，产出 ${currentBatch.outputQty}`, subject: sub?.name });
          inspections.filter(i => i.batchId === currentBatch.id).forEach(i => nodes.push({ step: '检测', name: i.type, batchNo: i.batchNo, time: i.date, detail: `结论：${i.conclusion}`, subject: null }));
        }
      }
      nodes.push({ step: '流通', name: '储运/配送', batchNo: '-', time: '-', detail: '数据来自对接蚂蚁数科流通系统（Demo 模拟）', subject: '蚂蚁数科', mock: true });
      nodes.push({ step: '销售', name: '溯源码绑定', batchNo: binding.code, time: binding.boundAt, detail: '本批次已绑定溯源码，可扫码查询', subject: null });

      resultEl.innerHTML = `
        <div class="timeline-card">
          <h3 class="timeline-title">鱼的一生 · 溯源链</h3>
          <div class="timeline">
            ${nodes.map((n, i) => `
              <div class="timeline-node ${n.mock ? 'timeline-node-mock' : ''}">
                <div class="node-marker">${i + 1}</div>
                <div class="node-content">
                  <div class="node-step">${escapeHtml(n.step)} ${n.mock ? '<span class="badge badge-mock">对接蚂蚁数科</span>' : ''}</div>
                  <div class="node-name">${escapeHtml(n.name)} · ${escapeHtml(n.batchNo)}</div>
                  <div class="node-detail">${escapeHtml(n.detail)}</div>
                  ${n.subject ? `<div class="node-subject">主体：${escapeHtml(n.subject)}</div>` : ''}
                  <div class="node-time">${escapeHtml(n.time)}</div>
                </div>
              </div>
            `).join('')}
          </div>
          <p class="muted">链上核验：Demo 环境为模拟，正式环境将展示蚂蚁链存证核验结果。</p>
        </div>
      `;
    }

    qs('#trace-search')?.addEventListener('click', () => doSearch());
    if (codeFromQuery) doSearch(codeFromQuery);
  }

  function qs(sel, el) {
    return (el || document).querySelector(sel);
  }

  const routes = {
    '/': homePage,
    '/gov/subjects': () => govPage('subjects'),
    '/gov/farming': () => govPage('farming'),
    '/gov/processing': () => govPage('processing'),
    '/gov/inspection': () => govPage('inspection'),
    '/gov/trace-code': () => govPage('trace-code'),
    '/gov/dashboard': () => govPage('dashboard'),
    '/gov': () => govPage('dashboard'),
    '/enterprise/step/1': () => enterpriseStepPage(1),
    '/enterprise/step/2': () => enterpriseStepPage(2),
    '/enterprise/step/3': () => enterpriseStepPage(3),
    '/enterprise/step/4': () => enterpriseStepPage(4),
    '/enterprise/step/5': () => enterpriseStepPage(5),
    '/enterprise': () => enterpriseStepPage(1),
    '/consumer': consumerPage,
  };

  function route() {
    const hash = location.hash.slice(1) || '/';
    const path = hash.split('?')[0];
    const fn = routes[path];
    if (fn) fn();
    else homePage();
  }

  window.addEventListener('hashchange', route);
  route();
})();
