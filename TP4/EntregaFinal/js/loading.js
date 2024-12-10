'use strict';
document.addEventListener("DOMContentLoaded", () => {
    let personajes = document.querySelectorAll(".personajeCarga");
    let progreso = document.getElementById("progreso");
    let porcentajeProgreso = 0;
            let textoPorcentajeProgreso = document.getElementById("porcentajedeprogreso");
            let body = document.body;
            body.style.overflow = 'hidden';
            let personajeActual = 0;
            progreso.style.animation = "carga 5s linear forwards";
            let intervalo = setInterval(() => {
                porcentajeProgreso++;
                personajeActual = Math.floor(porcentajeProgreso/10);
                if(personajeActual > 0){
                    personajes[personajeActual-1].style.display = "none";
                }
                if(personajeActual<10){
                    personajes[personajeActual].style.display = "block";
                }else{
                    personajes[10].style.display = "block";
                }
                textoPorcentajeProgreso.textContent = porcentajeProgreso + "%";
                if (porcentajeProgreso >=100) {
                    clearInterval(intervalo);
                    setTimeout(cargaCompletada,200);
                }
            }, 50);
    
    function cargaCompletada(){
        window.location.href = "index.html";
    }
});