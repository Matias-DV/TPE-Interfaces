"use strict"
document.addEventListener("DOMContentLoaded", () => {
    let sombrapersonaje1 = document.querySelector('.sombrapersonaje1');
    let sombrapersonaje2 = document.querySelector('.sombrapersonaje2');
    let sombrapersonaje3 = document.querySelector('.sombrapersonaje3');
    let logohero = document.querySelector('.logohero');
    let arbol1 = document.querySelector('.arbol1');
    let piedra2 = document.querySelector('.piedra2');
    let arbusto4 = document.querySelector('.arbusto4');
    let planta3 = document.querySelector('.planta3');
    let personaje1 = document.querySelector('.personaje1');
    let personaje2 = document.querySelector('.personaje2');
    let personaje3 = document.querySelector('.personaje3');
    let planta1 = document.querySelector('.planta1');
    let piedra3 = document.querySelector('.piedra3');
    let piedra4 = document.querySelector('.piedra4');
    let piedra1 = document.querySelector('.piedra1');
    let arbol2 = document.querySelector('.arbol2');
    let planta2 = document.querySelector('.planta2');
    let arbol3 = document.querySelector('.arbol3');
    let nav = document.querySelector('nav');
    let logonav = document.querySelector('#logonav');
    
    let titulo = document.querySelector('.laappmasdivertida h1');
    let descripcion = document.querySelector('.laappmasdivertida h2')
    let bordeCard = document.querySelector('.laappmasdivertida .bordeCard')
    let card = document.querySelector('.laappmasdivertida #card')
    let personaje5 = document.querySelector('.laappmasdivertida .numero5')
    let personaje4 = document.querySelector('.laappmasdivertida .numero4')
    let cardsSecundarias = document.querySelectorAll('.laappmasdivertida figure');

    let video = document.querySelector('.miraelvideo iframe');
    let miraelvideopersonaje = document.querySelector('.miraelvideo img');

    window.addEventListener('scroll', () => {
        let value = window.scrollY;
        moverLogoYNav(value);
        moverCapasHero(value);
        moverCapasLaAppMasDivertida(value);
        mostrarCardsSecundarias(value);
        moverCapasMiraElVideo(value);
    })
    
    function moverLogoYNav(value){  
        logohero.style.translate = "0 " + value * 0.807 + 'px';
        logohero.style.scale = 1 - value/1200;
        if(value == 0){
            logonav.style.display = "none";
            nav.classList.remove('sticky');
        }else{
            if(value >= 867){
                logohero.style.scale = 0;
                logonav.style.display = "block";
            }else{
                logonav.style.display = "none";
            }
            nav.classList.add('sticky');
        }
    }

    function moverCapasHero(value){
        sombrapersonaje1.style.translate = value * -0.1 + "px " + value * 0 + 'px';
        sombrapersonaje2.style.translate = value * 0 + "px " + value * 0 + 'px';
        sombrapersonaje3.style.translate = value * 0.1 + "px " + value * 0 + 'px';
        personaje2.style.translate = value * 0 + "px " + value * 0.10 + 'px';
        planta1.style.translate = value * 0.105 + "px " + value * 0 + 'px';
        arbol3.style.translate = value * 0.11 + "px " + value * 0 + 'px';
        personaje3.style.translate = value * 0.1 + "px " + value * -0.15 + 'px';
        planta2.style.translate = value * 0.12 + "px " + value * 0 + 'px';
        arbol2.style.translate = value * 0.13 + "px " + value * 0 + 'px';
        piedra3.style.translate = value * 0.14 + "px " + value * 0 + 'px';
        personaje1.style.translate = value * -0.1 + "px " + value * -0.15 + 'px';
        piedra1.style.translate = value * 0.155 + "px " + value * 0 + 'px';
        piedra4.style.translate = value * 0.15 + "px " + value * 0 + 'px';
        arbusto4.style.translate = value * -0.15 + "px " + value * 0 + 'px';
        arbol1.style.translate = value * -0.16 + "px " + value * 0 + 'px';
        piedra2.style.translate = value * -0.17 + "px " + value * 0 + 'px';
        planta3.style.translate = value * -0.2 + "px " + value * 0 + 'px';
    }

    function moverCapasLaAppMasDivertida(value){
        titulo.style.translate = value * 0.08 + "px " + value * 0.07 + 'px';
        descripcion.style.translate = value * 0.1 + "px " + value * 0.08 + 'px';
        bordeCard.style.translate = value * 0.1 + "px " + value * 0.1 + 'px';
        card.style.translate = value * 0.1 + "px " + value * 0.1 + 'px';
        personaje4.style.translate = value * 0.1 + "px " + value * 0 + 'px';
        personaje5.style.translate = value * -0.1 + "px " + value * 0 + 'px';
    }

    function mostrarCardsSecundarias(value) {
        if (value > 1600) {
            cardsSecundarias.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('mostrar');
                }, index * 300);
            });
        } else {
            cardsSecundarias.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.remove('mostrar');
                }, index * 300);
            });
        }
    }

    function moverCapasMiraElVideo(value){
        let yVideo = video.getBoundingClientRect().top-window.innerHeight;
        if(yVideo<0 && yVideo >-500){
            video.style.translate = yVideo * 1 + "px " + yVideo * 0.05 + 'px';
            miraelvideopersonaje.style.translate = yVideo * 0 + "px " + yVideo * 2.5 + 'px';
        }
    }
});
