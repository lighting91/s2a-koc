function showLogin(){
document.getElementById("loginRoot").style.display="flex";
document.getElementById("appRoot").style.display="none";
}

function showApp(){
document.getElementById("loginRoot").style.display="none";
document.getElementById("appRoot").style.display="block";
}

function checkAuth(){
const auth = localStorage.getItem("auth");

if(!auth){
showLogin();
}else{
showApp();
}
}

function login(){

const user = document.getElementById("loginUser").value;
const pass = document.getElementById("loginPass").value;

if(user==="admin" && pass==="123456"){
localStorage.setItem("auth","ok");
showApp();
return;
}

alert("Sai tài khoản");
}

function logout(){
localStorage.removeItem("auth");
location.reload();
}

document.addEventListener("DOMContentLoaded",checkAuth);
function buildPeriodOptions(){
  const elSelect = document.getElementById('inHKDPeriod');
  if(!elSelect) return;

  const now = new Date().getFullYear();

  const years = [];
  for(let y = now-2; y <= now+3; y++){
    years.push(y);
  }

  let html = '';

  years.forEach(y=>{
    html += `<option value="Y-${y}">Năm ${y}</option>`;

    for(let q=1;q<=4;q++){
      html += `<option value="Q${q}-${y}">Quý ${q}/${y}</option>`;
    }
  });

  elSelect.innerHTML = html;
}
let records = loadState();

function updateSettingsUI(){
  const s = loadSettings();
  el('inHKDName').value = s.name || '';
  el('inHKDAddress').value = s.address || '';
  el('inHKDTaxId').value = s.taxId || '';
  el('inHKDPlace').value = s.place || '';
  el('inHKDPeriod').value = s.period || '';

  el('s2aName').textContent = s.name || '...................................';
  el('s2aAddr').textContent = s.address || '...................................';
  el('s2aTaxId').textContent = s.taxId || '...................................';
  el('s2aPlace').textContent = s.place || '...................................';
  el('s2aPeriod').textContent = s.period || '...................................';
}

function renderAll(){
  saveState(records);
  el('todayText').textContent = asDate(todayISO());
  renderTable();
  renderDashboard();
  renderS2A();
  renderDuyen();
  updateSettingsUI();
}

document.addEventListener('DOMContentLoaded', () => {
buildPeriodOptions();
  el('inDate').value = todayISO();

  const s = loadSettings();
  if (!s.name){
    saveSettings({
      name: '',
      address: '',
      taxId: '',
      place: '',
      period: ''
    });
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
      if (btn.dataset.tab === 'tab-dashboard') renderDashboard();
      if (btn.dataset.tab === 'tab-s2a') renderS2A();
    });
  });

  el('btnAdd').addEventListener('click', addRecord);
  el('btnClearAll').addEventListener('click', () => {
    if (!confirm('Xoá toàn bộ dữ liệu hiện có?')) return;
    records = [];
    saveState(records);
    renderAll();
  });
  el('btnSeedDemo').addEventListener('click', () => {
    if (!confirm('Nạp dữ liệu demo để test?')) return;
    seedDemo();
  });
  el('btnExportCSV').addEventListener('click', exportCSV);
  el('btnPrintS2A').addEventListener('click', printS2A);
  el('btnRefreshS2A').addEventListener('click', renderS2A);
  el('btnSyncPush').addEventListener('click', syncPush);
  el('btnSyncPull').addEventListener('click', syncPull);
  el('btnSaveSettings').addEventListener('click', saveHkdSettings);

  ['inHKDName','inHKDAddress','inHKDTaxId','inHKDPlace','inHKDPeriod'].forEach(id => {
    el(id).addEventListener('change', saveHkdSettings);
    el(id).addEventListener('blur', saveHkdSettings);
  });

  window.addEventListener('resize', () => { renderDashboard(); });

  ['inSource','inDesc','inAmount','inNote'].forEach(id => {
    el(id).addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addRecord();
      }
    });
  });

  renderAll();
});
renderEntrySummary();
