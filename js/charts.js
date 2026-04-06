function fitCanvas(canvas){
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(300, Math.floor(rect.width * dpr));
  const h = Math.max(220, Math.floor(rect.height * dpr));
  if (canvas.width !== w || canvas.height !== h){ canvas.width = w; canvas.height = h; }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);
  return ctx;
}

function drawLineChart(id, timeline){
  const canvas = el(id);
  if (!canvas) return;
  const ctx = fitCanvas(canvas);
  const width = canvas.getBoundingClientRect().width;
  const height = canvas.getBoundingClientRect().height;
  ctx.clearRect(0,0,width,height);

  const pad = {l:54,r:18,t:18,b:44};
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;

  ctx.save();
  ctx.strokeStyle = '#e5edf7';
  ctx.lineWidth = 1;
  for (let i=0;i<=4;i++){
    const y = pad.t + (h/4)*i;
    ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(pad.l+w,y); ctx.stroke();
  }
  ctx.restore();

  if (!timeline.length){
    ctx.fillStyle = '#64748b'; ctx.font = '14px Inter, sans-serif';
    ctx.fillText('Chưa có dữ liệu để vẽ biểu đồ.', pad.l, pad.t + 24);
    return;
  }

  const labels = timeline.map(x => x.date.slice(5));
  const valuesThu = timeline.map(x => x.thu);
  const valuesChi = timeline.map(x => x.chi);
  const valuesNet = timeline.map(x => x.thu - x.chi - x.vat - x.pit);
  const maxV = Math.max(1, ...valuesThu, ...valuesChi, ...valuesNet);
  const yMap = (v) => pad.t + h - (v / maxV) * h;
  const xMap = (i) => pad.l + (timeline.length === 1 ? w/2 : (w/(timeline.length-1)) * i);

  function drawLine(values, color, widthLine=3){
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = widthLine; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath();
    values.forEach((v,i)=>{
      const x = xMap(i), y = yMap(v);
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.stroke();
    values.forEach((v,i)=>{
      const x = xMap(i), y = yMap(v);
      ctx.fillStyle = '#fff'; ctx.strokeStyle = color; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x,y,4.5,0,Math.PI*2); ctx.fill(); ctx.stroke();
    });
    ctx.restore();
  }

  drawLine(valuesThu, '#2563eb', 3);
  drawLine(valuesChi, '#f97316', 3);
  drawLine(valuesNet, '#16a34a', 3.4);

  ctx.save();
  ctx.fillStyle = '#475569'; ctx.font = '12px Inter, sans-serif';
  ctx.textAlign = 'center';
  labels.forEach((lb,i)=>{
    const x = xMap(i);
    ctx.fillText(lb, x, height - 14);
  });
  ctx.textAlign = 'right';
  for (let i=0;i<=4;i++){
    const v = maxV*(1 - i/4);
    const y = pad.t + (h/4)*i;
    ctx.fillText(fmt(v), pad.l - 10, y + 4);
  }
  ctx.textAlign = 'left';
  const legends = [
    ['Thu', '#2563eb'],
    ['Chi', '#f97316'],
    ['Lợi nhuận', '#16a34a']
  ];
  let lx = pad.l; const ly = 18;
  legends.forEach(([name,color]) => {
    ctx.fillStyle = color; ctx.fillRect(lx, ly-9, 14, 14);
    ctx.fillStyle = '#0f172a'; ctx.fillText(name, lx + 20, ly+2);
    lx += 120;
  });
  ctx.restore();
}

function drawPieChart(id, data){
  const canvas = el(id);
  if (!canvas) return;
  const ctx = fitCanvas(canvas);
  const width = canvas.getBoundingClientRect().width;
  const height = canvas.getBoundingClientRect().height;
  ctx.clearRect(0,0,width,height);

  if (!data.length){
    ctx.fillStyle = '#64748b'; ctx.font = '14px Inter, sans-serif';
    ctx.fillText('Chưa có doanh thu Thu.', 18, 28);
    return;
  }

  const total = data.reduce((s,x)=>s+x[1],0);
  const colors = ['#2563eb','#16a34a','#f97316','#8b5cf6'];
  const cx = width * 0.36;
  const cy = height * 0.48;
  const r = Math.min(width, height) * 0.26;
  let start = -Math.PI/2;

  data.forEach((item, i) => {
    const val = item[1];
    const angle = (val/total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + angle);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    start += angle;
  });

  ctx.beginPath();
  ctx.fillStyle = '#fff';
  ctx.arc(cx, cy, r * 0.58, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#e5edf7'; ctx.lineWidth = 1; ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(fmt(total), cx, cy - 4);
  ctx.font = '12px Inter, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Tổng doanh thu', cx, cy + 18);

  const legX = width * 0.7;
  let y = 52;
  ctx.textAlign = 'left';
  data.forEach((item, i) => {
    const [name,val] = item;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(legX, y-10, 14, 14);
    ctx.fillStyle = '#0f172a';
    ctx.font = '700 13px Inter, sans-serif';
    ctx.fillText(name, legX + 20, y + 2);
    ctx.fillStyle = '#475569';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText(`${fmt(val)} (${Math.round(val/total*100)}%)`, legX, y + 20);
    y += 58;
  });
}
