const API_URL = "GOOGLE_SCRIPT_URL";

function showLogin(){
appRoot.style.display="none";
loginRoot.style.display="flex";
}

function showApp(){
loginRoot.style.display="none";
appRoot.style.display="block";
}

async function login(){

const res = await fetch(API_URL,{
method:"POST",
body:JSON.stringify({
action:"login",
username:loginUser.value,
password:loginPass.value
})
});

const data = await res.json();

if(!data.ok){
alert("Sai tài khoản");
return;
}

localStorage.setItem("auth",JSON.stringify(data));

showApp();
syncPull();
}

function checkAuth(){

const auth = localStorage.getItem("auth");

if(!auth){
showLogin();
return;
}

showApp();
}

checkAuth();
