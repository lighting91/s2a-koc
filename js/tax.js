const TAX = {
  dichvu:   { label: 'Dịch vụ',     vat: 0.05,  pit: 0.02 },
  thuongmai:{ label: 'Thương mại',   vat: 0.01,  pit: 0.005 },
  sanxuat:  { label: 'Sản xuất',     vat: 0.03,  pit: 0.015 },
  khac:     { label: 'Không tính thuế', vat: 0, pit: 0 }
};

function inferIndustry(source='', desc='', note=''){
  const text = `${source} ${desc} ${note}`.toLowerCase();
  if (/xưởng|sản xuất|gia công|manufact|sx/.test(text)) return 'sanxuat';
  if (/bán hàng|thương mại|shop|trading|bán lẻ/.test(text)) return 'thuongmai';
  if (/affiliate|booking|kol|koc|tiktok|shop|hoa hồng|content|video|livestream|dịch vụ/.test(text)) return 'dichvu';
  return 'khac';
}

function calcTaxByIndustry(industry, amount){
  const tax = TAX[industry] || TAX.khac;
  return {
    vat: amount * tax.vat,
    pit: amount * tax.pit,
    label: tax.label
  };
}
