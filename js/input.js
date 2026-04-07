function addRecord(){
  const date = el('inDate').value || todayISO();
  const type = el('inType').value;
  const industry = el('inIndustry').value;
  const source = el('inSource').value.trim();
  const desc = el('inDesc').value.trim();
  const amount = toNum(el('inAmount').value);
  const note = el('inNote').value.trim();

  if (!amount || amount <= 0){
    alert('Nhập số tiền hợp lệ trước đã anh nhé.');
    return;
  }

  if (!desc && !source){
    alert('Nên có ít nhất số hiệu hoặc diễn giải để sau này tra cứu.');
    return;
  }

  const rec = normalizeRecord({
    date, type, industry, source, desc, amount, note
  });

  records.push(rec);
saveState(records);

renderAll();
renderEntrySummary();
renderDuyen(); // thêm dòng này

clearInputs(false);
}

function deleteRecord(id){
  if (!confirm('Xoá dòng này?')) return;

  records = records.filter(r => r.id !== id);

  saveState(records);

  renderAll();
  renderEntrySummary();
}

function clearInputs(keepDate=true){
  if (!keepDate) el('inDate').value = todayISO();
  if (keepDate && !el('inDate').value) el('inDate').value = todayISO();

  el('inType').value = 'thu';
  el('inIndustry').value = 'auto';
  el('inSource').value = '';
  el('inDesc').value = '';
  el('inAmount').value = '';
  el('inNote').value = '';

  el('inSource').focus();
}

function seedDemo(){
  const demo = [
    {date:todayISO(), type:'thu', industry:'dichvu', source:'SỐ-HIEU-001', desc:'Booking video short', amount:25000000, note:'Demo'},
    {date:todayISO(), type:'thu', industry:'dichvu', source:'SỐ-HIEU-002', desc:'Hoa hồng affiliate', amount:18000000, note:'Demo'},
    {date:todayISO(), type:'thu', industry:'thuongmai', source:'SỐ-HIEU-003', desc:'Doanh thu bán hàng', amount:42000000, note:'Demo'},
    {date:todayISO(), type:'chi', industry:'khac', source:'SỐ-HIEU-004', desc:'Ads + tools + nhân sự', amount:14000000, note:'Demo'},
    {date:todayISO(), type:'chi', industry:'khac', source:'SỐ-HIEU-005', desc:'Mẫu sản phẩm', amount:6000000, note:'Demo'},
  ].map(normalizeRecord);

  records = [...records, ...demo];

  saveState(records);

  renderAll();
  renderEntrySummary();
}

function exportCSV(){
  const rows = [
    ['Ngày','Loại','Ngành','Số hiệu','Diễn giải','Số tiền','GTGT','TNCN','Ghi chú'],
    ...records.map(r => [
      r.date,
      r.type,
      TAX[r.industry]?.label || r.industry,
      r.source,
      r.desc,
      r.amount,
      r.vat,
      r.pit,
      r.note
    ])
  ];

  const csv = rows
  .map(row => row
  .map(cell => `"${String(cell ?? '').replace(/"/g,'""')}"`)
  .join(','))
  .join('\n');

  const blob = new Blob(['\ufeff' + csv], { type:'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `S2A_KOC_${todayISO()}.csv`;
  a.click();

  URL.revokeObjectURL(url);
}

function saveHkdSettings(){
  const settings = {
    name: el('inHKDName').value.trim(),
    address: el('inHKDAddress').value.trim(),
    taxId: el('inHKDTaxId').value.trim(),
    place: el('inHKDPlace').value.trim(),
    period: el('inHKDPeriod').value.trim()
  };

  saveSettings(settings);

  renderS2A();
  renderEntrySummary();
}


// =============================
// SUMMARY FOOTER
// =============================

function renderEntrySummary(){

const table = document.querySelector("#tab-entry table");
if(!table) return;

let box = document.getElementById("entrySummary");

if(!box){
box = document.createElement("div");
box.id = "entrySummary";
table.after(box);   // luôn đặt sau bảng
}

const period = loadSettings().period;
const filtered = filterByPeriod(records, period);

let thu=0,chi=0,vat=0,pit=0;

filtered.forEach(r=>{

if(r.type==="thu"){
thu+=r.amount;
vat+=r.vat||0;
pit+=r.pit||0;
}

if(r.type==="chi"){
chi+=r.amount;
}

});

const profit = thu-chi-vat-pit;

box.innerHTML = `
<div style="
background:#f8fafc;
border:1px solid #e5e7eb;
border-radius:12px;
padding:14px 16px;
margin-top:12px;
">

<div style="font-size:12px;font-weight:700;color:#64748b;margin-bottom:8px;">
TỔNG HỢP KỲ ĐANG CHỌN
</div>

<div style="display:flex;justify-content:space-between;padding:4px 0;">
<span>Tổng thu</span>
<span style="color:#16a34a;font-weight:600">+ ${fmt(thu)}</span>
</div>

<div style="display:flex;justify-content:space-between;padding:4px 0;">
<span>Tổng chi</span>
<span style="color:#dc2626;font-weight:600">- ${fmt(chi)}</span>
</div>

<div style="display:flex;justify-content:space-between;padding:4px 0;">
<span>Thuế GTGT</span>
<span style="color:#dc2626;font-weight:600">- ${fmt(vat)}</span>
</div>

<div style="display:flex;justify-content:space-between;padding:4px 0;">
<span>Thuế TNCN</span>
<span style="color:#dc2626;font-weight:600">- ${fmt(pit)}</span>
</div>

<div style="border-top:1px dashed #cbd5e1;margin:8px 0;"></div>

<div style="display:flex;justify-content:space-between;font-weight:700;font-size:15px;">
<span>LỢI NHUẬN RÒNG</span>
<span style="color:${profit>=0 ? '#16a34a':'#dc2626'}">
${profit>=0?'+':'-'} ${fmt(Math.abs(profit))}
</span>
</div>

</div>
`;
}
