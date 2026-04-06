function cryptoId(){
  if (window.crypto?.randomUUID) return crypto.randomUUID();
  return 'id_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const el = (id) => document.getElementById(id);
const fmt = (n) => new Intl.NumberFormat('vi-VN').format(Math.round(Number(n || 0)));
const toNum = (v) => {
  if (typeof v === 'number') return v;
  if (!v) return 0;
  return Number(String(v).replace(/[^0-9,.-]/g,'').replace(/,/g,'')) || 0;
};
const pad2 = (n) => String(n).padStart(2, '0');
const asDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return `${pad2(d.getDate())}/${pad2(d.getMonth()+1)}/${d.getFullYear()}`;
};
const todayISO = () => {
  const d = new Date();
  const m = pad2(d.getMonth()+1); const day = pad2(d.getDate());
  return `${d.getFullYear()}-${m}-${day}`;
};

function escapeHtml(str){
  return String(str ?? '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

function normalizeRecord(raw){
  const type = raw.type === 'chi' ? 'chi' : 'thu';
  const amount = toNum(raw.amount);
  let industry = raw.industry || 'auto';
  if (industry === 'auto') industry = inferIndustry(raw.source, raw.desc, raw.note);
  if (!TAX[industry]) industry = 'khac';
  const tax = type === 'thu' ? calcTaxByIndustry(industry, amount) : { vat:0, pit:0, label: (TAX[industry]||TAX.khac).label };
  return {
    id: raw.id || cryptoId(),
    date: raw.date || todayISO(),
    type,
    industry,
    source: raw.source || '',
    desc: raw.desc || '',
    amount,
    note: raw.note || '',
    vat: tax.vat,
    pit: tax.pit,
    createdAt: raw.createdAt || new Date().toISOString()
  };
}
function filterByPeriod(list){

  const s = loadSettings();
  const period = s.period;

  if(!period) return list;

  const year = Number(period.split('-')[1]);

  if(period.startsWith('Q')){

    const q = Number(period[1]);

    return list.filter(r=>{

      const d = new Date(r.date);
      const rq = Math.ceil((d.getMonth()+1)/3);

      return rq === q && d.getFullYear() === year;

    });

  }

  if(period.startsWith('Y')){

    return list.filter(r=>{
      return new Date(r.date).getFullYear() === year;
    });

  }

  return list;

}