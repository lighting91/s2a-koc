function groupByIndustry(list){
  return list.reduce((acc, r) => {
    if (!acc[r.industry]) acc[r.industry] = [];
    acc[r.industry].push(r);
    return acc;
  }, {});
}

function computeStats(){

  const filtered = filterByPeriod(records);

  const revenue = filtered.filter(r => r.type === 'thu').reduce((s,r) => s + r.amount, 0);
  const expense = filtered.filter(r => r.type === 'chi').reduce((s,r) => s + r.amount, 0);
  const vat = filtered.filter(r => r.type === 'thu').reduce((s,r) => s + r.vat, 0);
  const pit = filtered.filter(r => r.type === 'thu').reduce((s,r) => s + r.pit, 0);
  const profit = revenue - expense - vat - pit;

  const byDate = new Map();
  for (const r of records){
    const key = r.date || todayISO();
    if (!byDate.has(key)) byDate.set(key, { date:key, thu:0, chi:0, vat:0, pit:0 });
    const row = byDate.get(key);
    if (r.type === 'thu') { row.thu += r.amount; row.vat += r.vat; row.pit += r.pit; }
    else row.chi += r.amount;
  }
  const timeline = [...byDate.values()].sort((a,b) => a.date.localeCompare(b.date));

  const industryRevenue = [
    ['Dịch vụ', records.filter(r => r.type==='thu' && r.industry==='dichvu').reduce((s,r)=>s+r.amount,0)],
    ['Thương mại', records.filter(r => r.type==='thu' && r.industry==='thuongmai').reduce((s,r)=>s+r.amount,0)],
    ['Sản xuất', records.filter(r => r.type==='thu' && r.industry==='sanxuat').reduce((s,r)=>s+r.amount,0)],
    ['Không thuế', records.filter(r => r.type==='thu' && r.industry==='khac').reduce((s,r)=>s+r.amount,0)]
  ].filter(x => x[1] > 0);

  return { revenue, expense, vat, pit, profit, timeline, industryRevenue };
}

function renderDashboard(){
  const stats = computeStats();
  el('kpiRevenue').textContent = fmt(stats.revenue);
  el('kpiExpense').textContent = fmt(stats.expense);
  el('kpiVat').textContent = fmt(stats.vat);
  el('kpiPit').textContent = fmt(stats.pit);
  el('kpiProfit').textContent = fmt(stats.profit);
  drawLineChart('lineChart', stats.timeline);
  drawPieChart('pieChart', stats.industryRevenue);
}
