"use strict"

document.addEventListener("mousemove", parallax);

let imagen = document.querySelector(".parallaxMouse");

let model = document.getElementById('model');

let rect = model.getBoundingClientRect();

function parallax(e) {
    let w = window.innerWidth / 2;
    let h = window.innerHeight / 2;
    let mouseX = e.clientX;
    let mouseY = e.clientY;

    // Parallax punto 5
    imagen.style.translate = `${-100 - (mouseX - w) * 0.01}px ${0 - (mouseY - h) * 0.01}px`;

    // Parallax punto 11
    let valor1 = (Math.round(mouseX / rect.width * 70)*-1)+7;
    let valor2 = (Math.round(window.innerHeight / rect.height * 90) - Math.round(   mouseY / rect.height * 90))+60;
    model.cameraOrbit = `${valor1}deg ` + `${valor2}deg auto`;
}