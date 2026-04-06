(function(){

function fmt(n){
return Number(n||0).toLocaleString("vi-VN");
}

function get(id){
return document.getElementById(id);
}

function getRange(){

const type = get("duyenPeriodType")?.value || "all";
const val = get("duyenPeriodValue")?.value;

if(type==="all" || !val) return null;

const d = new Date(val);

if(type==="month"){
return {
start:new Date(d.getFullYear(),d.getMonth(),1),
end:new Date(d.getFullYear(),d.getMonth()+1,0)
};
}

if(type==="quarter"){
const q = Math.floor(d.getMonth()/3);
return {
start:new Date(d.getFullYear(),q*3,1),
end:new Date(d.getFullYear(),q*3+3,0)
};
}

if(type==="year"){
return {
start:new Date(d.getFullYear(),0,1),
end:new Date(d.getFullYear(),11,31)
};
}

return null;
}

window.renderDuyen = function(){

try{

if(!window.records) return;

const range = getRange();

let thu=0,chi=0,vat=0,pit=0;

records.forEach(r=>{

const d = new Date(r.date);

if(range){
if(d<range.start || d>range.end) return;
}

if(r.type==="thu"){
thu+=r.amount||0;
vat+=r.vat||0;
pit+=r.pit||0;
}else{
chi+=r.amount||0;
}

});

const percent = Number(get("duyenReservePercent")?.value||0);
const amount = Number(get("duyenReserveAmount")?.value||0);

let reserve = amount || (thu-chi-vat-pit)*percent/100;

const profit = thu-chi-vat-pit-reserve;
const duyen = profit*0.1;

if(get("duyenThu")) get("duyenThu").textContent = fmt(thu);
if(get("duyenChi")) get("duyenChi").textContent = "-"+fmt(chi);
if(get("duyenTax")) get("duyenTax").textContent = "-"+fmt(vat+pit);
if(get("duyenReserve")) get("duyenReserve").textContent = "-"+fmt(reserve);
if(get("duyenProfit")) get("duyenProfit").textContent = fmt(duyen);

}catch(e){
console.log("duyen render skip");
}

};

document.addEventListener("change",e=>{
if(e.target.id?.includes("duyen")){
window.renderDuyen();
}
});

setTimeout(()=>{
window.renderDuyen();
},500);

})();