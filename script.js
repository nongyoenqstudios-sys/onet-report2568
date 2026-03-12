// ── Data ──────────────────────────────────────────────────

const subjects = [
  {
    key: 'thai', label: 'ภาษาไทย', short: 'ภาษาไทย', icon: '📖',
    color: '#f59e0b',
    school: 27.75, province: 44.53, region: 45.79, country: 47.60, size: 44.52
  },
  {
    key: 'eng', label: 'ภาษาอังกฤษ', short: 'อังกฤษ', icon: '🌐',
    color: '#3b82f6',
    school: 22.92, province: 30.42, region: 30.19, country: 33.58, size: 27.96
  },
  {
    key: 'math', label: 'คณิตศาสตร์', short: 'คณิต', icon: '🔢',
    color: '#f43f5e',
    school: 21.67, province: 23.73, region: 23.58, country: 24.90, size: 21.93
  },
  {
    key: 'sci', label: 'วิทยาศาสตร์', short: 'วิทย์', icon: '🔬',
    color: '#10b981',
    school: 39.17, province: 34.01, region: 34.62, country: 35.43, size: 33.46
  },
];

const levelMeta = {
  country:  { label: 'ประเทศ',         key: 'country'  },
  province: { label: 'จังหวัด',         key: 'province' },
  region:   { label: 'ภาค',            key: 'region'   },
  size:     { label: 'ขนาดโรงเรียน',   key: 'size'     },
};

let curLevel = 'country';

const detailData = [
  {
    subject: 'ภาษาไทย', color: '#f59e0b',
    items: [
      { name: 'การอ่าน',                   school: 33.33, country: 50.25 },
      { name: 'การเขียน',                  school: 37.20, country: 47.93 },
      { name: 'การฟัง การดู และการพูด',    school: 22.22, country: 48.51 },
      { name: 'หลักการใช้ภาษาไทย',         school: 27.78, country: 43.15 },
      { name: 'วรรณคดีและวรรณกรรม',        school:  0.00, country: 49.49 },
    ],
  },
  {
    subject: 'ภาษาอังกฤษ', color: '#3b82f6',
    items: [
      { name: 'ภาษาเพื่อการสื่อสาร',       school: 21.21, country: 35.25 },
      { name: 'ภาษาและวัฒนธรรม',           school: 27.78, country: 28.53 },
      { name: 'ภาษากับชุมชนและโลก',         school: 25.00, country: 31.92 },
    ],
  },
  {
    subject: 'คณิตศาสตร์', color: '#f43f5e',
    items: [
      { name: 'จำนวนและพีชคณิต',           school: 27.81, country: 29.26 },
      { name: 'การวัดและเรขาคณิต',          school: 21.87, country: 21.22 },
      { name: 'สถิติและความน่าจะเป็น',      school:  0.00, country: 30.38 },
    ],
  },
  {
    subject: 'วิทยาศาสตร์', color: '#10b981',
    items: [
      { name: 'วิทยาศาสตร์ชีวภาพ',         school: 37.50, country: 29.41 },
      { name: 'วิทยาศาสตร์กายภาพ',          school: 44.44, country: 39.92 },
      { name: 'วิทยาศาสตร์โลกและอวกาศ',    school: 46.67, country: 38.42 },
      { name: 'เทคโนโลยี',                  school:  0.00, country: 19.75 },
    ],
  },
];

// ── Animate main bars ──────────────────────────────────────

function animateBars() {
  document.querySelectorAll('.bar').forEach(b => {
    const w = b.dataset.w;
    requestAnimationFrame(() => { setTimeout(() => { b.style.width = w + '%'; }, 120); });
  });
}

// ── Tab switching ──────────────────────────────────────────

function switchTab(t) {
  document.querySelectorAll('.tab').forEach((el, i) => {
    el.classList.toggle('active', ['overview', 'chart', 'detail'][i] === t);
  });
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + t).classList.add('active');
  if (t === 'chart')  buildChart();
  if (t === 'detail') buildDetail();
}

// ── Toggle sub-panel ──────────────────────────────────────

function toggleSub(id, e) {
  e.stopPropagation();
  const panel  = document.getElementById('sub-' + id);
  const btn    = document.getElementById('btn-' + id);
  const card   = panel.previousElementSibling;
  const isOpen = panel.classList.contains('open');

  panel.classList.toggle('open', !isOpen);
  card.style.borderRadius = isOpen ? '' : '20px 20px 0 0';
  btn.textContent = isOpen ? 'ดูรายสาระ ▾' : 'ซ่อน ▴';

  if (!isOpen) {
    panel.querySelectorAll('.sub-bar').forEach(b => {
      b.style.width = '0';
      requestAnimationFrame(() => { setTimeout(() => { b.style.width = b.dataset.w + '%'; }, 60); });
    });
  }
}

// ── Level filter ──────────────────────────────────────────

function setLevel(el, lvl) {
  curLevel = lvl;
  document.querySelectorAll('#level-filter .filter-btn').forEach(b => b.classList.remove('on'));
  el.classList.add('on');
  buildChart();
}

// ── Build bar chart + comparison table ────────────────────

function buildChart() {
  const meta   = levelMeta[curLevel];
  const maxH   = 175;

  document.getElementById('cl-label').textContent = meta.label;
  document.getElementById('th-cmp').textContent   = meta.label;

  // Bar chart
  const barsEl = document.getElementById('chart-bars');
  barsEl.innerHTML = '';

  subjects.forEach(s => {
    const sh = (s.school    / 100) * maxH;
    const ch = (s[meta.key] / 100) * maxH;

    const g = document.createElement('div');
    g.className = 'chart-group';
    g.innerHTML = `
      <div class="chart-cols">
        <div class="chart-col" style="background:${s.color};height:0" data-h="${sh}">
          <div class="c-tip">โรงเรียน: ${s.school}</div>
        </div>
        <div class="chart-col" style="background:#cbd5e1;height:0" data-h="${ch}">
          <div class="c-tip">${meta.label}: ${s[meta.key]}</div>
        </div>
      </div>
      <div class="chart-label">${s.icon} ${s.short}</div>
    `;
    barsEl.appendChild(g);

    requestAnimationFrame(() => {
      setTimeout(() => {
        g.querySelectorAll('.chart-col').forEach(c => { c.style.height = c.dataset.h + 'px'; });
      }, 80);
    });
  });

  // Comparison table
  const tbody = document.getElementById('comp-tbody');
  tbody.innerHTML = '';

  subjects.forEach(s => {
    const cmp  = s[meta.key];
    const diff = (s.school - cmp).toFixed(2);
    const pill = diff >= 0
      ? `<span class="badge-up">+${diff}</span>`
      : `<span class="badge-dn">${diff}</span>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.icon} ${s.label}</td>
      <td style="font-family:'K2D',sans-serif;font-weight:700;color:${s.color}">${s.school}</td>
      <td style="color:#64748b">${cmp}</td>
      <td>${pill}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ── Build detail view ─────────────────────────────────────

function buildDetail() {
  const el = document.getElementById('detail-rows');
  el.innerHTML = '';

  detailData.forEach(sub => {
    const block = document.createElement('div');
    block.style.marginBottom = '24px';
    block.innerHTML = `
      <div style="font-family:'K2D',sans-serif;font-weight:700;font-size:.96rem;
                  color:${sub.color};margin-bottom:10px;padding-bottom:6px;
                  border-bottom:1px solid rgba(0,0,0,.06)">
        ${sub.subject}
      </div>
    `;

    sub.items.forEach(item => {
      const diff  = item.school - item.country;
      const badge = diff >= 0
        ? `<span class="badge-up">+${diff.toFixed(1)}</span>`
        : `<span class="badge-dn">${diff.toFixed(1)}</span>`;

      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap;';
      row.innerHTML = `
        <span style="font-size:.88rem;min-width:160px;color:#334155">${item.name}</span>
        <div style="flex:1;min-width:140px;display:flex;flex-direction:column;gap:4px">
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:1.08rem;color:${sub.color};width:52px">โรงเรียน</span>
            <div style="flex:1;height:7px;background:rgba(0,0,0,.07);border-radius:99px;overflow:hidden">
              <div style="height:100%;background:${sub.color};border-radius:99px;width:0;
                          transition:width .9s cubic-bezier(.16,1,.3,1)"
                   class="anim-bar" data-w="${item.school}"></div>
            </div>
            <span style="font-family:'K2D',sans-serif;font-size:.85rem;font-weight:700;
                         color:${sub.color};width:28px;text-align:right">${item.school}</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:1.08rem;color:#94a3b8;width:52px">ประเทศ</span>
            <div style="flex:1;height:7px;background:rgba(0,0,0,.07);border-radius:99px;overflow:hidden">
              <div style="height:100%;background:#cbd5e1;border-radius:99px;width:0;
                          transition:width .9s cubic-bezier(.16,1,.3,1)"
                   class="anim-bar" data-w="${item.country}"></div>
            </div>
            <span style="font-family:'K2D',sans-serif;font-size:.85rem;font-weight:700;
                         color:#94a3b8;width:28px;text-align:right">${item.country}</span>
          </div>
        </div>
        <span style="width:50px;text-align:right">${badge}</span>
      `;
      block.appendChild(row);
    });

    el.appendChild(block);

    requestAnimationFrame(() => {
      setTimeout(() => {
        block.querySelectorAll('.anim-bar').forEach(b => { b.style.width = b.dataset.w + '%'; });
      }, 80);
    });
  });
}

// ── Init ──────────────────────────────────────────────────

window.addEventListener('load', animateBars);
