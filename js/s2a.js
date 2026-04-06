function renderTable(){
  const tbody = el('txBody');
  const arr = [...records].sort((a,b) => (a.date > b.date ? -1 : 1) || (a.createdAt > b.createdAt ? -1 : 1));
  el('recordCount').textContent = fmt(arr.length);
  el('emptyState').style.display = arr.length ? 'none' : 'block';

  tbody.innerHTML = arr.map(r => `
    <tr>
      <td>${asDate(r.date)}</td>
      <td><span class="badge ${r.type}">${r.type === 'thu' ? 'Thu' : 'Chi'}</span></td>
      <td>${TAX[r.industry]?.label || 'Không tính thuế'}</td>
      <td>${escapeHtml(r.source || '')}</td>
      <td>${escapeHtml(r.desc || '')}</td>
      <td class="num">${fmt(r.amount)}</td>
      <td class="num">${r.type === 'thu' ? fmt(r.vat) : '-'}</td>
      <td class="num">${r.type === 'thu' ? fmt(r.pit) : '-'}</td>
      <td>${escapeHtml(r.note || '')}</td>
      <td><button class="btn danger mini" onclick="deleteRecord('${r.id}')">X</button></td>
    </tr>
  `).join('');
}

function renderS2A(){
  const wrap = el('s2aRender');
  const settings = loadSettings();

  const name = settings.name || '...................................';
  const address = settings.address || '...................................';
  const taxId = settings.taxId || '...................................';
  const place = settings.place || '...................................';
  const periodText = settings.period || '...................................';

  el('s2aName').textContent = name;
  el('s2aAddr').textContent = address;
  el('s2aTaxId').textContent = taxId;
  el('s2aPlace').textContent = place;
  el('s2aPeriod').textContent = periodText;

  const income = filterByPeriod(
  records.filter(r => r.type === 'thu')
);
  const order = ['dichvu','thuongmai','sanxuat','khac'];
  const groupedByIndustry = groupByIndustry(income);

  let totalVat = 0;
  let totalPit = 0;
  let tbodyHtml = '';
  let rowIndex = 0;

  order.forEach((key, idx) => {
    const items = groupedByIndustry[key] || [];
    if (!items.length) return;

    const industryLabel = TAX[key]?.label || 'Không tính thuế';
    const totalAmount = items.reduce((s, r) => s + r.amount, 0);
    const vat = items.reduce((s, r) => s + r.vat, 0);
    const pit = items.reduce((s, r) => s + r.pit, 0);

    totalVat += vat;
    totalPit += pit;

    tbodyHtml += `
      <tr>
        <td></td>
        <td></td>
        <td class="desc-cell" style="font-weight:800;text-align:center;">
          ${idx + 1}. Ngành nghề: ${escapeHtml(industryLabel)}
        </td>
        <td class="num"></td>
      </tr>
    `;

    items.forEach((r) => {
      rowIndex += 1;
      tbodyHtml += `
        <tr>
          <td class="voucher-code">${escapeHtml(r.source || ('CT-' + rowIndex))}</td>
          <td class="voucher-date">${asDate(r.date)}</td>
          <td class="desc-cell">
            <div class="desc-text">${escapeHtml(r.desc || '')}</div>
          </td>
          <td class="num">${fmt(r.amount)}</td>
        </tr>
      `;
    });

    tbodyHtml += `
      <tr>
        <td></td>
        <td></td>
        <td class="desc-cell" style="text-align:center;">Tổng cộng (${idx + 1})</td>
        <td class="num"><strong>${fmt(totalAmount)}</strong></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td class="desc-cell" style="text-align:center;">Thuế GTGT</td>
        <td class="num">${fmt(vat)}</td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td class="desc-cell" style="text-align:center;">Thuế TNCN</td>
        <td class="num">${fmt(pit)}</td>
      </tr>
    `;
  });

  if (!tbodyHtml){
    tbodyHtml = `
      <tr>
        <td class="voucher-code">---</td>
        <td class="voucher-date">--/--/----</td>
        <td class="desc-cell">
          <div class="desc-text">Chưa có giao dịch Thu</div>
        </td>
        <td class="num">0</td>
      </tr>
    `;
  }

  wrap.innerHTML = `
    <div class="s2a-paper">
      <table class="s2a-table">
        <thead>
          <tr>
            <th colspan="2" style="text-align:center;">Chứng từ</th>
            <th rowspan="2" style="text-align:center;">Diễn giải<br><span class="muted">(C)</span></th>
            <th rowspan="2" class="num" style="text-align:center;">Số tiền<br><span class="muted">(1)</span></th>
          </tr>
          <tr>
            <th style="width:22%; text-align:center;">(A) Số hiệu</th>
            <th style="width:18%; text-align:center;">(B) Ngày, tháng</th>
          </tr>
        </thead>
        <tbody>
          ${tbodyHtml}
<tr>
            <td></td>
            <td></td>
            <td class="desc-cell" style="text-align:center;font-weight:800;">Tổng số thuế GTGT phải nộp</td>
            <td class="num"><strong>${fmt(totalVat)}</strong></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td class="desc-cell" style="text-align:center;font-weight:800;">Tổng số thuế TNCN phải nộp</td>
            <td class="num"><strong>${fmt(totalPit)}</strong></td>
          </tr>
        </tbody>
      </table>
          
    </div>
  `;
}