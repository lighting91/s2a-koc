const API_URL = '';

async function syncPush(){
  if (!API_URL){ alert('Chưa dán API_URL.'); return; }
  try{
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ action:'push', records })
    });
    const txt = await res.text();
    el('syncState').textContent = 'Synced';
    alert('Đã đẩy dữ liệu lên API.');
    return txt;
  }catch(err){
    console.error(err);
    alert('Đẩy API lỗi: ' + err.message);
  }
}

async function syncPull(){
  if (!API_URL){ alert('Chưa dán API_URL.'); return; }
  try{
    const res = await fetch(API_URL, { method:'GET' });
    const data = await res.json();
    if (Array.isArray(data.records)) {
      records = data.records.map(normalizeRecord);
    } else if (Array.isArray(data)) {
      records = data.map(normalizeRecord);
    }
    saveState(records);
    renderAll();
    el('syncState').textContent = 'Synced';
    alert('Đã lấy dữ liệu từ API.');
  }catch(err){
    console.error(err);
    alert('Lấy API lỗi: ' + err.message);
  }
}
