"use strict"

let btnFlechaIzquierda = document.getElementById("flechaIzquierda");
let btnFlechaDerecha = document.getElementById("flechaDerecha");
let cards = document.getElementsByClassName("card-principal");
let cardActual = 0;

btnFlechaDerecha.addEventListener("click", avanzar);
btnFlechaIzquierda.addEventListener("click", retroceder);


function avanzar(){
    cards[cardActual].classList.remove("mostrarCardRetroceso");
    cards[cardActual].classList.remove("esconderCardRetroceso");
    cards[cardActual].classList.remove("mostrarCardAvance");
    cards[cardActual].classList.add("esconderCardAvance");
    if(cardActual == cards.length-1){
        cardActual = 0;
    }else{
        cardActual++;
    }
    cards[cardActual].classList.remove("mostrarCardRetroceso");
    cards[cardActual].classList.remove("esconderCardRetroceso");
    cards[cardActual].classList.remove("esconderCardAvance");
    cards[cardActual].classList.add("mostrarCardAvance");
}

function retroceder(){
    cards[cardActual].classList.remove("mostrarCardAvance");
    cards[cardActual].classList.remove("esconderCardAvance");
    cards[cardActual].classList.remove("mostrarCardRetroceso");
    cards[cardActual].classList.add("esconderCardRetroceso");
    if(cardActual == 0){
        cardActual = cards.length-1;
    }else{
        cardActual--;
    }
    cards[cardActual].classList.remove("mostrarCardAvance");
    cards[cardActual].classList.remove("ocultarCardAvance");
    cards[cardActual].classList.remove("esconderCardRetroceso");
    cards[cardActual].classList.add("mostrarCardRetroceso");
}

