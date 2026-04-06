const STORAGE_KEY = 's2a_koc_records_v1';
const SETTINGS_KEY = 's2a_koc_settings_v1';

function loadState(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch(e){ return []; }
}
function saveState(records){ localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
function saveSettings(obj){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(obj)); }
function loadSettings(){
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); }
  catch(e){ return {}; }
}
