"use strict"

let menuHamburguesaBtn = document.getElementById("menuHamburguesa");
let menuDesplegable = document.getElementById("menuDesplegable");
let h2 = document.querySelectorAll("#menuDesplegable h2")

let index = 0;

menuHamburguesaBtn.addEventListener("click", ()=>{
    if(menuHamburguesaBtn.classList.contains("mostrar")){
        menuHamburguesaBtn.classList.remove("mostrar");
        menuHamburguesaBtn.classList.add("ocultar");
        index = h2.length-1;
        setTimeout(ocultarItem,500);
    }else{
        menuHamburguesaBtn.classList.remove("ocultar");
        menuHamburguesaBtn.classList.add("mostrar");
        setTimeout(desplegarMenu,500);
    }
})
function desplegarMenu(){
    index = 0;
    menuDesplegable.classList.remove("oculto");
    setTimeout(mostrarItem,500)
}

function mostrarItem(){
    if(index<h2.length){
        h2[index].classList.remove("oculto")
        index++;
        setTimeout(mostrarItem, 100);
    }
}

function ocultarItem(){
    if(index>=0){
        h2[index].classList.add("oculto")
        index--;
        setTimeout(ocultarItem, 100);
    }else{
        setTimeout(ocultarMenu, 100);
    }
}

function ocultarMenu(){
    index = 0;
    menuDesplegable.classList.add("oculto");
}
