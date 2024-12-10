"use strict"

let btn = document.getElementById("btn-registrarse");
btn.addEventListener("click", (e)=>{
    e.preventDefault();
    setTimeout(redireccionar, 1500);
})

function redireccionar() {
        window.location.href = "index.html";
}