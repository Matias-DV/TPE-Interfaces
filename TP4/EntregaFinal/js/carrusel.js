"use strict"

// Carrusel la app mas divertida

let cards = [
    "img/card1.png",
    "img/card2.png",
    "img/card3.png",
    "img/card4.png"
];
let cardActual = 0;
let card = document.getElementById("card");

function cambiarCard(){
    if(cardActual<cards.length-1){
        cardActual++
    }else{
        cardActual = 0;
    }
    card.style.background = 'url("' + cards[cardActual] + '") lightgray 50% / cover no-repeat';
    setTimeout(cambiarCard,3000);
}

cambiarCard();