"use strict"

let btnMenuHamburguesa = document.getElementById("btn-menuHamburguesa");
let btnMenuUsuario = document.getElementById("btn-menuUsuario");
let btnMenuCarrito = document.getElementById("btn-menuCarrito");

let idMenuHamburguesa = "menuHamburguesa";
let idMenuUsuario = "menuUsuario";
let idMenuCarrito = "menuCarrito";


btnMenuHamburguesa.addEventListener("click",()=>{
    if(!isOculto(idMenuCarrito)){
        mostrar(idMenuCarrito);
    }
    if(!isOculto(idMenuUsuario)){
        mostrar(idMenuUsuario);
    }
    mostrar(idMenuHamburguesa);
});
btnMenuUsuario.addEventListener("click",()=>{
    if(!isOculto(idMenuCarrito)){
        mostrar(idMenuCarrito);
    }
    if(!isOculto(idMenuHamburguesa)){
        mostrar(idMenuHamburguesa);
    }
    mostrar(idMenuUsuario);
});
btnMenuCarrito.addEventListener("click",()=>{
    if(!isOculto(idMenuHamburguesa)){
        mostrar(idMenuHamburguesa);
    }
    if(!isOculto(idMenuUsuario)){
        mostrar(idMenuUsuario);
    }
    mostrar(idMenuCarrito);
});

function mostrar(id){
    let menu = document.getElementById(id);
    menu.classList.toggle("menu-oculto");
}

function isOculto(id){
    let menu = document.getElementById(id);
    return menu.classList.contains("menu-oculto");
}
