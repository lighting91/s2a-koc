const API_URL = "https://script.google.com/macros/s/AKfycbzxdCOU8VsvW7M4oL45Byhy2eHiMsos0sWQAfvMfvY/dev";


async function syncPush(){

try{

const res = await fetch(API_URL,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
records:records
})
});

alert("Đã lưu Google Sheet");

}catch(e){
alert("Lỗi sync push");
console.error(e);
}

}



async function syncPull(){

try{

const res = await fetch(API_URL);
const data = await res.json();

records = data.records || [];

saveState(records);
renderAll();
syncPull();

alert("Đã tải dữ liệu");

}catch(e){
alert("Lỗi sync pull");
console.error(e);
}

}
