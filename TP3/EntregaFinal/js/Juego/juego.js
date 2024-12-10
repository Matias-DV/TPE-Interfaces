"use strict"
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('juego');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
let height = canvas.height;
let width = canvas.width;

// Constantes //

const tamanioGrupoFichas = 90; // para el cuadrado que contiene el monton de fichas

// Variables de configuracion general//

let volumen = 0.1;
let modosDeJuegos = [
    {
        "nombre": 4,
        "columnas": 7,
        "filas": 6,
        "tamanioCasillero": 60
    },
    {
        "nombre": 5,
        "columnas": 8,
        "filas": 7,
        "tamanioCasillero": 50
    },
    {
        "nombre": 6,
        "columnas": 9,
        "filas": 8,
        "tamanioCasillero": 45
    },
    {
        "nombre": 7,
        "columnas": 10,
        "filas": 9,
        "tamanioCasillero": 40
    }
];
let filas = 6;
let columnas = 7;
let tamanioCasillero = 60;
let radioFicha;
let tiempo = 300;

// Variables de funciones //

let itemsCargados = 0;
let itemsTotales = 0;
let pantalla; //0 para el Jugar, 1 para Seleccion de Modo, 2 para la Seleccion de Personaje, 3 para el Juego y 4 en caso de Empate en la partida
let modoDeJuego;// Modo de Juego Seleccionado
let personajes;
let jugador;
let personajeJugador1;
let personajeJugador2;
let fichaDelPersonaje1 = null;
let fichaDelPersonaje2 = null;
let tablero;
let fichas = [[], []];
let turno = -1; // -1 para cuando no se especificó un turno, 0 para el jugador 1, y 1 para el jugador 2
let fichaSeleccionada = null; // ficha que el jugador quiere mover
let ganador;
let temporizador;
let muteado = false;
let pausado;
let hintCaida;
let posHint = {
    "x": width / 2 - 10,
    "y": -60
};
let columnasLlenas;//En caso de que la columna llegue a su tope no se muestra el hint, ni tampoco se agregan fichas



// Botones //

let botones = {
    "modoJuego": [
        {
            "x": width / 4.5,
            "y": height / 1.36,
            "radio": 35
        },
        {
            "x": width / 2.54,
            "y": height / 1.32,
            "radio": 35
        },
        {
            "x": width / 1.69,
            "y": height / 1.32,
            "radio": 35
        },
        {
            "x": width / 1.27,
            "y": height / 1.36,
            "radio": 35
        }
    ],
    "reiniciar": [
        { // Pantalla pausa
            "x": width / 2.5,
            "y": height / 2,
            "width": 200,
            "height": 50
        },
        { // Pantalla juego terminado
            "x": width / 1.3,
            "y": height / 1.2,
            "width": 200,
            "height": 50
        }
    ],
    "nuevoJuego": [
        { // Pantalla opening
            "x": width / 2 - 100,
            "y": height / 1.1,
            "width": 200,
            "height": 50
        },
        { // Pantalla pausa
            "x": width / 2.5,
            "y": height / 2.6,
            "width": 200,
            "height": 50
        },
        { // Pantalla juego terminado
            "x": width / 1.3,
            "y": height / 1.4,
            "width": 200,
            "height": 50
        }
    ],
    "pausa": {
        "x": 10,
        "y": 10,
        "width": 30,
        "height": 30
    },
    "desactivarSonido": {
        "x": width - 40,
        "y": 10,
        "width": 30,
        "height": 30
    },


}

// Verificacion carga de items //

/*
Cada vez que se agrega un nuevo recurso, hay que llamar a esta funcion para que asincronicamente vaya 
sumando el contador cuando se termina de cargar cada uno y lo compare con la cantidad total de recursos,
para llamar a la pantalla de Juego
*/
function cargaCompleta() {
    itemsCargados++;
    if (itemsCargados < itemsTotales) {
        dibujarProgresoCarga();
    } else { //Se quitan los eventos de los audios, para que no se disparen, en caso de cambiar su timepo 
        audioJuego.removeEventListener("canplaythrough", cargaCompleta);
        audioMenu.removeEventListener("canplaythrough", cargaCompleta);
        audioSeleccionJake.removeEventListener("canplaythrough", cargaCompleta);
        audioSeleccionBmo.removeEventListener("canplaythrough", cargaCompleta);
        audioSeleccionDulcePrincesa.removeEventListener("canplaythrough", cargaCompleta);
        audioSeleccionFinn.removeEventListener("canplaythrough", cargaCompleta);
        audioSeleccionMentita.removeEventListener("canplaythrough", cargaCompleta);
        audioSeleccionReyHelado.removeEventListener("canplaythrough", cargaCompleta);
        audioAgarrarFicha.removeEventListener("canplaythrough", cargaCompleta);
        audioSoltarFicha.removeEventListener("canplaythrough", cargaCompleta);
        audioGanador.removeEventListener("canplaythrough", cargaCompleta);
        audioEmpate.removeEventListener("canplaythrough", cargaCompleta);
        opening();
    }
}

/*
Dependiendo de los items cargados, va dibujando una barra con el porcentaje actual
*/
function dibujarProgresoCarga() {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "White";
    ctx.fillRect(width / 4, height / 2 - 10, (width / 2) * (itemsCargados / itemsTotales), 20);
    let texto = itemsCargados + "/" + itemsTotales;
    let anchoTexto = ctx.measureText(texto).width;
    ctx.font = '20px Arial';
    ctx.fillText(texto, width / 2 - anchoTexto / 2, height / 1.8)
    ctx.restore();
}

// Carga de items //

// Fondos

let fondoOpening = new Image();
fondoOpening.src = "./img/Juego/fondoOpening.jpg";
itemsTotales++;
fondoOpening.addEventListener("load", cargaCompleta);

let pantallaModoDeJuego = new Image();
pantallaModoDeJuego.src = "./img/Juego/modosJuego.png";
itemsTotales++;
pantallaModoDeJuego.addEventListener("load", cargaCompleta);

let fondo = new Image();
fondo.src = "./img/Juego/fondoTablero.jpg";
itemsTotales++;
fondo.addEventListener("load", cargaCompleta);

let imagenCeldaTablero = new Image();
imagenCeldaTablero.src = "./img/Juego/Fichas/secciontablero.jpg";
itemsTotales++;
imagenCeldaTablero.addEventListener("load", cargaCompleta);

let fondoMadera = new Image();
fondoMadera.src = "./img/Juego/fondoMadera.png";
itemsTotales++;
fondoMadera.addEventListener("load", cargaCompleta);

let imagenJugadorGanador = new Image();
imagenJugadorGanador.src = "./img/Juego/fondoGanador.jpeg";
itemsTotales++;
imagenJugadorGanador.addEventListener("load", cargaCompleta);

let imagenEmpate = new Image();
imagenEmpate.src = "./img/Juego/empate.png";
itemsTotales++;
imagenEmpate.addEventListener("load", cargaCompleta);

// Botones

let imagenJugar = new Image();
imagenJugar.src = "./img/Juego/Botones/jugar.png";
itemsTotales++;
imagenJugar.addEventListener("load", cargaCompleta);

let imagenActivarSonido = new Image();
imagenActivarSonido.src = "./img/Juego/Botones/sonido.png";
itemsTotales++;
imagenActivarSonido.addEventListener("load", cargaCompleta);

let imagenDesactivarSonido = new Image();
imagenDesactivarSonido.src = "./img/Juego/Botones/mutear.png";
itemsTotales++;
imagenDesactivarSonido.addEventListener("load", cargaCompleta);

let imagenPausar = new Image();
imagenPausar.src = "./img/Juego/Botones/pause.png";
itemsTotales++;
imagenPausar.addEventListener("load", cargaCompleta);

let imagenReanudar = new Image();
imagenReanudar.src = "./img/Juego/Botones/inpause.png";
itemsTotales++;
imagenReanudar.addEventListener("load", cargaCompleta);

let imagenReiniciar = new Image();
imagenReiniciar.src = "./img/Juego/Botones/reiniciar.png";
itemsTotales++;
imagenReiniciar.addEventListener("load", cargaCompleta);

// Personajes seleccionables (pj es de personaje)

let pjBmo = new Image();
pjBmo.src = "./img/Juego/Personajes/bmo.png";
itemsTotales++;
pjBmo.addEventListener("load", cargaCompleta);

let pjDulcePrincesa = new Image();
pjDulcePrincesa.src = "./img/Juego/Personajes/dulcePrincesa.png";
itemsTotales++;
pjDulcePrincesa.addEventListener("load", cargaCompleta);

let pjFinn = new Image();
pjFinn.src = "./img/Juego/Personajes/finn.png";
itemsTotales++;
pjFinn.addEventListener("load", cargaCompleta);

let pjJake = new Image();
pjJake.src = "./img/Juego/Personajes/jake.png";
itemsTotales++;
pjJake.addEventListener("load", cargaCompleta);

let pjMentita = new Image();
pjMentita.src = "./img/Juego/Personajes/mentita.png";
itemsTotales++;
pjMentita.addEventListener("load", cargaCompleta);

let pjReyHelado = new Image();
pjReyHelado.src = "./img/Juego/Personajes/reyHelado.png";
itemsTotales++;
pjReyHelado.addEventListener("load", cargaCompleta);

// Audios

let audioMenu = new Audio();
audioMenu.src = "./audio/Juego/menu.mp3";
audioMenu.loop = true;
audioMenu.volume = volumen;
itemsTotales++;
audioMenu.addEventListener("canplaythrough", cargaCompleta);

let audioSeleccionBmo = new Audio();
audioSeleccionBmo.src = "./audio/Juego/seleccionBmo.mp3";
audioSeleccionBmo.volume = 1;
itemsTotales++;
audioSeleccionBmo.addEventListener("canplaythrough", cargaCompleta);

let audioSeleccionDulcePrincesa = new Audio();
audioSeleccionDulcePrincesa.src = "./audio/Juego/seleccionDulcePrincesa.mp3";
audioSeleccionDulcePrincesa.volume = 1;
itemsTotales++;
audioSeleccionDulcePrincesa.addEventListener("canplaythrough", cargaCompleta);

let audioSeleccionFinn = new Audio();
audioSeleccionFinn.src = "./audio/Juego/seleccionFinn.mp3";
audioSeleccionFinn.volume = 1;
itemsTotales++;
audioSeleccionFinn.addEventListener("canplaythrough", cargaCompleta);

let audioSeleccionJake = new Audio();
audioSeleccionJake.src = "./audio/Juego/seleccionJake.mp3";
audioSeleccionJake.volume = 1;
itemsTotales++;
audioSeleccionJake.addEventListener("canplaythrough", cargaCompleta);

let audioSeleccionMentita = new Audio();
audioSeleccionMentita.src = "./audio/Juego/seleccionMentita.mp3";
audioSeleccionMentita.volume = 1;
itemsTotales++;
audioSeleccionMentita.addEventListener("canplaythrough", cargaCompleta);

let audioSeleccionReyHelado = new Audio();
audioSeleccionReyHelado.src = "./audio/Juego/seleccionReyHelado.mp3";
audioSeleccionReyHelado.volume = 1;
itemsTotales++;
audioSeleccionReyHelado.addEventListener("canplaythrough", cargaCompleta);

let audioJuego = new Audio();
audioJuego.src = "./audio/Juego/juego.mp3";
audioJuego.loop = true;
audioJuego.volume = volumen;
itemsTotales++;
audioJuego.addEventListener("canplaythrough", cargaCompleta);

let audioAgarrarFicha = new Audio();
audioAgarrarFicha.src = "./audio/Juego/agarrarFicha.mp3";
audioAgarrarFicha.volume = volumen;
itemsTotales++;
audioAgarrarFicha.addEventListener("canplaythrough", cargaCompleta);

let audioSoltarFicha = new Audio();
audioSoltarFicha.src = "./audio/Juego/soltarFicha.mp3";
audioSoltarFicha.volume = volumen;
itemsTotales++;
audioSoltarFicha.addEventListener("canplaythrough", cargaCompleta);

let audioGanador = new Audio();
audioGanador.src = "./audio/Juego/ganador.mp3";
audioGanador.volume = volumen;
itemsTotales++;
audioGanador.addEventListener("canplaythrough", cargaCompleta);

let audioEmpate = new Audio();
audioEmpate.src = "./audio/Juego/empate.mp3";
audioEmpate.volume = volumen;
itemsTotales++;
audioEmpate.addEventListener("canplaythrough", cargaCompleta);

//Fichas

let fichaBmo = new Image()
fichaBmo.src = "./img/Juego/Fichas/fichaBmo.png";
itemsTotales++;
fichaBmo.addEventListener("load", cargaCompleta);

let fichaDulcePrincesa = new Image()
fichaDulcePrincesa.src = "./img/Juego/Fichas/fichaDulce.png";
itemsTotales++;
fichaDulcePrincesa.addEventListener("load", cargaCompleta);

let fichaFinn = new Image()
fichaFinn.src = "./img/Juego/Fichas/fichaFinn.png";
itemsTotales++;
fichaFinn.addEventListener("load", cargaCompleta);

let fichaJake = new Image()
fichaJake.src = "./img/Juego/Fichas/fichaJake.png";
itemsTotales++;
fichaJake.addEventListener("load", cargaCompleta);

let fichaMentita = new Image()
fichaMentita.src = "./img/Juego/Fichas/fichaMentita.png";
itemsTotales++;
fichaMentita.addEventListener("load", cargaCompleta);

let fichaReyHelado = new Image()
fichaReyHelado.src = "./img/Juego/Fichas/fichaReyHelado.png";
itemsTotales++;
fichaReyHelado.addEventListener("load", cargaCompleta);

// Misceláneo

let hint = new Image();
hint.src = "./img/Juego/hint.png";
itemsTotales++;
hint.addEventListener("load", cargaCompleta);

// Funciones //

/* 
Setea la pantalla en 0, y llama a dibujar la pantalla principal
*/
function opening() {
    pantalla = 0;
    dibujarOpening();
}

/* 
Dibuja la pantalla principal y el botón de new game
*/
function dibujarOpening() {
    ctx.drawImage(fondoOpening, 0, 0, width, height);
    ctx.drawImage(imagenJugar, botones.nuevoJuego[0].x, botones.nuevoJuego[0].y, botones.nuevoJuego[0].width, botones.nuevoJuego[0].height)
}

/*
Evento para cuando el usuario presiona el click
*/
canvas.addEventListener("mousedown", (e) => { mousedown(e) });

/*
El click hace una accion distinta dependiendo de en que pantalla se encuentra el jugador y donde se ubicaba el puntero
*/
function mousedown(e) {
    let x = e.offsetX;
    let y = e.offsetY;
    switch (pantalla) {
        case 0: // Opening
            if (mouseDentroArea(x, y, botones.nuevoJuego[0].x, botones.nuevoJuego[0].y, botones.nuevoJuego[0].width, botones.nuevoJuego[0].height)) { //Cuando el usuario da click a New Game lo manda a la pantalla de Seleccion de Modo
                seleccionarModo();
                animarHint();
            }
            break;
        case 1: // Seleccion de modo de juego
            for (let index = 0; index < botones.modoJuego.length; index++) {
                let distancia = distanciaEntreDosPuntos(x, y, botones.modoJuego[index].x, botones.modoJuego[index].y);
                if (distancia <= botones.modoJuego[index].radio) { //cuando el usuario hace click para seleccionar el modo, le baja el volumne a la musica y muestra los personajes
                    cambiarModoDeJuego(index);
                    audioMenu.volume = 0.015;
                    seleccionarPersonaje();
                }
            }
            break;
        case 2: // Seleccion de personaje
            for (let index = 0; index < personajes.length; index++) {
                if (mouseDentroArea(x, y, width / personajes.length * index, height / 2 - height / 1.3 / 2 + 50, width / personajes.length, height / 1.3 - 105)) { //Cuando el jugador activo da click en el personaje se lo asigna, cuando ambos seleccionan su personaje, empieza la partida
                    if (personajes[index].jugador <= 0) {
                        if (personajeJugador1 == null) {
                            jugador = 1;
                            asignarPersonaje(index);
                        } else if (personajeJugador2 == null) {
                            personajeJugador1.sonido.pause();
                            personajeJugador1.sonido.currentTime = 0;
                            jugador = 2;
                            asignarPersonaje(index);
                            setTimeout(() => {
                                audioMenu.pause();
                                audioMenu.currentTime = 0;
                                iniciarJuego()
                            },
                                personajeJugador2.sonido.duration * 1000 + 200);
                        }
                    }
                }
            }
            break;
        case 3: // Juego
            if (turno != -1) { //Selecciona la ficha del jugador activo cuando el juego no está pausado, mostrando como resultado un Hint Animado de donde puede ubicarse la ficha
                let ficha = fichas[turno][fichas[turno].length - 1];
                if (ficha.mouseDentro(x, y) && !ficha.isBloqueada() && !pausado) {
                    fichaSeleccionada = ficha;
                    fichas[turno].pop();
                    audioAgarrarFicha.play();

                }
            }
            if (mouseDentroArea(x, y, botones.desactivarSonido.x, botones.desactivarSonido.y, botones.desactivarSonido.width, botones.desactivarSonido.height)) { //Activa o desactiva el sonido del Juego
                if (muteado) {
                    audioJuego.volume = volumen;
                    muteado = false;
                } else {
                    audioJuego.volume = 0;
                    muteado = true;
                }
                reDibujar();
            }
            if (mouseDentroArea(x, y, botones.pausa.x, botones.pausa.y, botones.pausa.width, botones.pausa.height) && fichaSeleccionada == null) { //Activa o desactiva la pausa del Juego
                if (pausado) {
                    pausado = false;
                    temporizador.reanudar();
                } else {
                    pausado = true;
                    temporizador.pausar();
                }
                reDibujar();
            }
            if (pausado) {
                if (mouseDentroArea(x, y, botones.nuevoJuego[1].x, botones.nuevoJuego[1].y, botones.nuevoJuego[1].width, botones.nuevoJuego[1].height)) {// Empieza una nueva partida si el Juego está Pausado
                    pausado = false;
                    audioJuego.pause();
                    audioJuego.currentTime = 0;
                    audioMenu.currentTime = 0;
                    seleccionarModo();
                }
                if (mouseDentroArea(x, y, botones.reiniciar[0].x, botones.reiniciar[0].y, botones.reiniciar[0].width, botones.reiniciar[0].height)) {// Reinicia la partida si el Juego está pausado 
                    pausado = false;
                    audioJuego.currentTime = 0;
                    iniciarJuego();
                }
            }
            break;
        case 4: // Ganador y empate
            if (mouseDentroArea(x, y, botones.nuevoJuego[2].x, botones.nuevoJuego[2].y, botones.nuevoJuego[2].width, botones.nuevoJuego[2].height)) { //Inicia una nueva partida si hay un ganador o empatan
                pausado = false;
                audioEmpate.pause();
                audioGanador.pause();
                audioEmpate.currentTime = 0;
                audioGanador.currentTime = 0;
                seleccionarModo();
            }
            if (mouseDentroArea(x, y, botones.reiniciar[1].x, botones.reiniciar[1].y, botones.reiniciar[1].width, botones.reiniciar[1].height)) { //Reinicia una nueva partida si hay un ganador o empatan
                pausado = false;
                audioEmpate.pause();
                audioGanador.pause();
                audioEmpate.currentTime = 0;
                audioGanador.currentTime = 0;
                iniciarJuego();
            }
            break;
    }
}

/*
Evento para cuando el usuario mueve el mouse
*/
canvas.addEventListener("mousemove", (e) => { mousemove(e) });

/*
Actualiza la posicion de la ficha y redibuja lo demás
*/
function mousemove(e) {

    let x = e.offsetX;
    let y = e.offsetY;
    switch (pantalla) {
        case 1: // Seleccionar modo de juego
            audioMenu.play();
            for (let index = 0; index < botones.modoJuego.length; index++) { //Muestra el Home y los botones para seleccionar el modo
                let distancia = distanciaEntreDosPuntos(x, y, botones.modoJuego[index].x, botones.modoJuego[index].y);
                if (distancia <= botones.modoJuego[index].radio) {
                    dibujarBotonModoJuego(botones.modoJuego[index].x, botones.modoJuego[index].y, modosDeJuegos[index].nombre, "#FBBC05")
                }
                else {
                    dibujarBotonModoJuego(botones.modoJuego[index].x, botones.modoJuego[index].y, modosDeJuegos[index].nombre, "white")
                }
            }
            break;
        case 2: // Seleccionar personaje
            if (personajeJugador2 == null) {
                for (let index = 0; index < personajes.length; index++) {
                    if (mouseDentroArea(x, y, width / personajes.length * index, height / 2 - height / 1.3 / 2 + 50, width / personajes.length + 1, height / 1.3 - 105)) { //muestra el hover de los personajes y sus nombres
                        for (let index2 = 0; index2 < personajes.length; index2++) {
                            if (index2 != index && personajes[index2].jugador == 0) {
                                personajes[index2].jugador = -1;
                            }
                            else if (index2 == index && personajes[index2].jugador == -1) {
                                personajes[index2].jugador = 0;
                            }
                        }
                        dibujarSeleccionPersonaje();
                        let texto;
                        if (personajeJugador1 == null) {
                            texto = personajes[index].nombre;
                        } else {
                            texto = personajeJugador1.nombre + " VS " + personajes[index].nombre;
                        }
                        ctx.save();
                        ctx.fillStyle = "white";
                        let anchoTexto = ctx.measureText(texto).width;
                        ctx.fillText(texto, width / 2 - anchoTexto / 2, height - 50);
                        ctx.restore();
                        return;
                    }
                }
                for (let index2 = 0; index2 < personajes.length; index2++) {
                    if (personajes[index2].jugador == 0) {
                        personajes[index2].jugador = -1;
                        dibujarSeleccionPersonaje();
                    }

                }
            }
            break;
        case 3: // Juego
            if (fichaSeleccionada != null && !pausado) { //Mueve la ficha seleccionada a la posicion del mouse
                fichaSeleccionada.setPos(x, y);
            }
            break;
    }

}

/*
Evento para cuando el usuario levanta el click
*/
canvas.addEventListener("mouseup", (e) => { mouseUp(e) });

/*
Pregunta si el usuario quiere soltar la ficha en la zona correcta y la inserta, de caso contrario, la
vuelve a poner en la pila correspondiente
*/
function mouseUp(e) {
    if (fichaSeleccionada != null && !pausado && pantalla == 3) {
        let x = e.offsetX;
        let y = e.offsetY;
        if (zonaParaSoltarFicha(x, y) && colocarFicha(e)) {
            audioSoltarFicha.play();
            fichaSeleccionada.setBloqueada(true);
        } else {
            fichas[turno].push(fichaSeleccionada);
            reDibujar();
        }
        fichaSeleccionada = null;
    }
}

/* 
Corrobora que el mouse esta dentro de un area rectangular
*/
function mouseDentroArea(x, y, x2, y2, w, h) {
    return (x > x2 && x < x2 + w && y > y2 && y < y2 + h);
}

/* 
Dibuja la pantalla de seleccionar modo, al setearse el valor en 1, el personaje elegido por cada jugador pasa a null y la música vuelve a default
*/
function seleccionarModo() {
    audioMenu.volume = volumen;
    pantalla = 1;
    audioMenu.play();
    audioMenu.currentTime = 0;
    personajeJugador1 = null;
    personajeJugador2 = null;
    dibujarSeleccionModo();
}

/* 
Dibuja el fondo y los botones en el Menu de Selección de Modo
*/
function dibujarSeleccionModo() {
    ctx.drawImage(pantallaModoDeJuego, 0, 0, width, height);
    document.fonts.load('10pt "Concert One"').then(() => {
        ctx.font = '35px "Concert One"';
        ctx.fillStyle = "black";
        ctx.fillText("Elige el modo de juego!", width / 3.2, 70);
        dibujarBotonesModoJuego();
    })
    audioMenu.play();
}

function dibujarBotonesModoJuego(){
    for (let index = 0; index < botones.modoJuego.length; index++) {
        dibujarBotonModoJuego(botones.modoJuego[index].x, botones.modoJuego[index].y, modosDeJuegos[index].nombre, "white");
    }
}

/* 
Dibuja el botón para seleccionar Modo
*/
function dibujarBotonModoJuego(x, y, m, fondo) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2, true);
    ctx.lineWidth = 3;
    ctx.fillStyle = fondo;
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.fillText(m, x - 10, y + 10);
    ctx.stroke();
    ctx.closePath();
    ctx.clip();
    ctx.restore();
}

/*
Calcula la distancia entre dos puntos usando sus coordenadas
*/
function distanciaEntreDosPuntos(x, y, x2, y2) {
    let dx = x - x2;
    let dy = y - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

/* 
Cambia el modo de juego y el tamaño de la ficha en relacion con el tamaño de casilleros de cada modo de juego
*/
function cambiarModoDeJuego(modo) {
    modoDeJuego = modo;
    radioFicha = (41 * modosDeJuegos[modoDeJuego].tamanioCasillero / 100);
}

/* 
Setea la pantalla en 2, carga los personajes, resetea las variables utilizadas y llama a dibujar la Selección de Personajes
*/
function seleccionarPersonaje() {
    pantalla = 2;
    cargarPersonajes();
    fichaDelPersonaje1 = null;
    fichaDelPersonaje2 = null;
    personajeJugador1 = null;
    personajeJugador2 = null;
    dibujarSeleccionPersonaje();
}

/* 
Carga los personajes con sus respectivos atributos(Jugador=-1, significa que no está seleccionado y no esta el mosue encima de el)
*/
function cargarPersonajes() {
    personajes = [];
    personajes.push({
        "imagen": pjBmo,
        "nombre": "BMO",
        "jugador": -1,
        "ficha": fichaBmo,
        "sonido": audioSeleccionBmo,
        "x": 0,
        "y": 0,
        "w": 0,
        "h": 0
    });
    personajes.push({
        "imagen": pjDulcePrincesa,
        "nombre": "Dulce Princesa",
        "jugador": -1,
        "ficha": fichaDulcePrincesa,
        "sonido": audioSeleccionDulcePrincesa,
        "x": 0,
        "y": 0,
        "w": 0,
        "h": 0
    });
    personajes.push({
        "imagen": pjFinn,
        "nombre": "Finn el humano",
        "jugador": -1,
        "ficha": fichaFinn,
        "sonido": audioSeleccionFinn,
        "x": 0,
        "y": 0,
        "w": 0,
        "h": 0
    });
    personajes.push({
        "imagen": pjJake,
        "nombre": "Jake el perro",
        "jugador": -1,
        "ficha": fichaJake,
        "sonido": audioSeleccionJake,
        "x": 0,
        "y": 0,
        "w": 0,
        "h": 0
    });
    personajes.push({
        "imagen": pjMentita,
        "nombre": "Mentita",
        "jugador": -1,
        "ficha": fichaMentita,
        "sonido": audioSeleccionMentita,
        "x": 0,
        "y": 0,
        "w": 0,
        "h": 0
    });
    personajes.push({
        "imagen": pjReyHelado,
        "nombre": "Rey Helado",
        "jugador": -1,
        "ficha": fichaReyHelado,
        "sonido": audioSeleccionReyHelado,
        "x": 0,
        "y": 0,
        "w": 0,
        "h": 0
    });
}

/* 
Dibuja cada personaje y dependiendo de si esta siendo seleccionado o no, realiza un desenfocado y oscurecimiento
*/
function dibujarSeleccionPersonaje() {
    ctx.save();
    for (let index = 0; index < personajes.length; index++) {// primero deja con las mismas posiciones a los seleccionados para que funcione la animacion
        let posX = personajes[index].x;
        let posY = personajes[index].y;
        let pjWidth = personajes[index].w;
        let pjHeight = personajes[index].h;
        if (personajes[index].x == 0 && personajes[index].y == 0 && personajes[index].w == 0 && personajes[index].h == 0) { //setea la posicion en pantalla de cada personaje, sin seleccionar
            posX = width / personajes.length * index;
            posY = height / 2 - height / 1.3 / 2;
            pjWidth = width / personajes.length;
            pjHeight = height / 1.3;
            personajes[index].x = posX;
            personajes[index].y = posY;
            personajes[index].w = pjWidth;
            personajes[index].h = pjHeight;
        }
        ctx.save()
        ctx.fillStyle = "black";
        ctx.fillRect(width / personajes.length * index, height / 2 - height / 1.3 / 2, width / personajes.length, height / 1.3);
        ctx.drawImage(personajes[index].imagen, posX, posY, pjWidth, pjHeight);
        if (personajes[index].jugador == -1) { //le da los efectos a los no seleccionados
            ctx.restore();
            ctx.save();
            ctx.filter = 'blur(2px)';
            ctx.drawImage(personajes[index].imagen, posX + 2, posY + 2, pjWidth - 4, pjHeight - 4);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(posX, posY, pjWidth, pjHeight);
            ctx.restore();
        }
        ctx.beginPath();
        ctx.rect(posX, posY, pjWidth, pjHeight);
        ctx.fillStyle = "black";
        ctx.stroke();
        ctx.closePath();

    }
    ctx.beginPath();// creo los óvalos de la parte superior e inferior para dar la sensacion de carrusel
    ctx.ellipse(width / 2, 0, width / 1.5, width / 8, 0, 0, 2 * Math.PI);
    ctx.fillStyle = "#004D4D";
    ctx.ellipse(width / 2, height, width / 1.5, width / 8, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = "white";
    let texto = "Elige tu personaje";
    let anchoTexto = ctx.measureText(texto).width;
    ctx.fillText("Elige tu personaje", width / 2 - anchoTexto / 2, 70)
    ctx.restore();
    dibujarFichasDeLosPersonajes();
    if (personajeJugador2 != null) { // Si se eligieron los 2 personajes, se presenta el versus con las elecciones finales
        texto = personajeJugador1.nombre + " VS " + personajeJugador2.nombre;
        ctx.save();
        ctx.fillStyle = "white";
        anchoTexto = ctx.measureText(texto).width;
        ctx.fillText(texto, width / 2 - anchoTexto / 2, height - 50);
        ctx.restore();
    }
}

/*
Dibuja las fichas de ambos personajes y les pone el texto arriba de la ficha para indicar a que jugador pertenece
*/
function dibujarFichasDeLosPersonajes() {
    if (fichaDelPersonaje1 != null) {
        ctx.save();
        ctx.fillStyle = "white";
        let texto = "Jugador 1";
        let anchoTexto = ctx.measureText(texto).width;
        ctx.fillText(texto, (personajeJugador1.x + personajeJugador1.w / 2) - anchoTexto / 2, height / 3);
        ctx.restore();
        fichaDelPersonaje1.dibujar();
    }
    if (fichaDelPersonaje2 != null) {
        ctx.save();
        ctx.fillStyle = "white";
        let texto = "Jugador 2";
        let anchoTexto = ctx.measureText(texto).width;
        ctx.fillText(texto, (personajeJugador2.x + personajeJugador2.w / 2) - anchoTexto / 2, height / 3);
        ctx.restore();
        fichaDelPersonaje2.dibujar();
    }
}

/* 
Asigna el personaje dependiendo del jugador activo y reproduce el sonido de este
*/
function asignarPersonaje(index) {
    if (jugador == 1) {
        personajeJugador1 = personajes[index];
        animacionDesplazarPersonajeJugador1();

    } else {
        personajeJugador2 = personajes[index];
        animacionDesplazarPersonajeJugador2();

    }
    personajes[index].jugador = jugador;
    personajes[index].sonido.play();
}

/* 
Desplaza hacia arriba el personaje del jugador 1 y muestra su ficha
*/
function animacionDesplazarPersonajeJugador1() {
    let tope = 0 - personajeJugador1.h;
    if (personajeJugador1.y > tope) {
        personajeJugador1.y -= 20;
        dibujarSeleccionPersonaje();
        requestAnimationFrame(animacionDesplazarPersonajeJugador1);
    } else {
        fichaDelPersonaje1 = asignarFichaJugador(personajeJugador1.ficha, 1)[0];
        fichaDelPersonaje1.setPos(personajeJugador1.x + personajeJugador1.w / 2, height / 2);
        fichaDelPersonaje1.setRadio(0);
        animacionMostrarFichaJugador1();
    }
}

/* 
Desplaza hacia arriba el personaje del jugador 2 y muestra su ficha
*/
function animacionDesplazarPersonajeJugador2() {
    let tope = 0 - personajeJugador2.h;
    if (personajeJugador2.y > tope) {
        personajeJugador2.y -= 20;
        dibujarSeleccionPersonaje();
        requestAnimationFrame(animacionDesplazarPersonajeJugador2);
    } else {
        fichaDelPersonaje2 = asignarFichaJugador(personajeJugador2.ficha, 1)[0];
        fichaDelPersonaje2.setPos(personajeJugador2.x + personajeJugador2.w / 2, height / 2);
        fichaDelPersonaje2.setRadio(0);
        animacionMostrarFichaJugador2();
    }
}

/*
Animacion para mostrar la ficha del jugador 1, se hace mas grande hasta un tope
*/
function animacionMostrarFichaJugador1() {
    if (fichaDelPersonaje1.radio < personajeJugador1.w / 4) {
        fichaDelPersonaje1.setRadio(fichaDelPersonaje1.radio += 2);
        dibujarFichasDeLosPersonajes();
        requestAnimationFrame(animacionMostrarFichaJugador1)
    }
}

/*
Animacion para mostrar la ficha del jugador 2, se hace mas grande hasta un tope
*/
function animacionMostrarFichaJugador2() {
    if (fichaDelPersonaje2.radio < personajeJugador2.w / 4) {
        fichaDelPersonaje2.setRadio(fichaDelPersonaje2.radio += 2);
        dibujarFichasDeLosPersonajes();
        requestAnimationFrame(animacionMostrarFichaJugador2)
    }
}

/*
Cambia a la pantalla 3, asigna las fichas, el tablero, el turno inicial y dibuja los componentes
*/
function iniciarJuego() {
    pantalla = 3;
    audioJuego.currentTime = 0;
    audioJuego.play();
    fichas[0] = asignarFichaJugador(personajeJugador1.ficha, 1);
    fichas[1] = asignarFichaJugador(personajeJugador2.ficha, 2);
    tablero = new Tablero(modosDeJuegos[modoDeJuego].columnas, modosDeJuegos[modoDeJuego].filas, ctx, imagenCeldaTablero, modosDeJuegos[modoDeJuego].tamanioCasillero, modosDeJuegos[modoDeJuego].nombre);
    temporizador = new Temporizador(tiempo, ctx, imagenEmpate);
    temporizador.iniciar();
    reDibujar();
    cambioTurno();
};

/*
Crea las fichas para cada jugador
*/
function asignarFichaJugador(imagen, nombreJugador) {
    let fichasAsignadas = [];
    for (let i = 0; i < modosDeJuegos[modoDeJuego].columnas * modosDeJuegos[modoDeJuego].filas / 2; i++) {
        let fichaAAsignar = new Ficha(0, 0, radioFicha, imagen, ctx, nombreJugador, true)
        fichasAsignadas.push(fichaAAsignar);
    }
    return fichasAsignadas;
}

/*
Redibuja todos los componentes
*/
function reDibujar() {
    dibujarFondo();
    tablero.dibujar();
    dibujarGruposFichas();
    temporizador.dibujar();
    if (pausado) {
        dibujarJuegoPausado();
        dibujarBotonNuevoJuego();
        dibujarBotonReiniciar();
    }
    dibujarBotones();
    dibujarHint();

}

/*
Dibuja el fondo a partir de una imagen, aplicandole blur y oscureciendola
*/
function dibujarFondo() {
    ctx.save();
    ctx.filter = 'blur(2px)';
    ctx.drawImage(fondo, 0, 0, width, height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
};

/*
Dibuja ambos grupos de fichas y asigna las coordenadas de cada uno (el contenedor de las fichas de cada jugador)
*/
function dibujarGruposFichas() {
    dibujarGrupoFichas(75, height / 2.63, fichas[0]);
    dibujarGrupoFichas((width - tamanioGrupoFichas) - 75, height / 2.63, fichas[1]);
}

/*
Dibuja el contenedor para las fichas y las ubica una arriba de la otra
*/
function dibujarGrupoFichas(x, y, fichas) {
    ctx.drawImage(fondoMadera, x, y, tamanioGrupoFichas, tamanioGrupoFichas);
    for (let i = 0; i < fichas.length; i++) {
        fichas[i].setPos(x + tamanioGrupoFichas / 2, (y - i * 3) + tamanioGrupoFichas / 2);
        fichas[i].dibujar()
    }
};

/*
Dibuja el juego pausado
*/
function dibujarJuegoPausado() {
    ctx.save();
    ctx.filter = 'blur(2px)';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FBBC05";
    ctx.filter = 'none';
    let texto = "Juego pausado";
    let anchoTexto = ctx.measureText(texto).width;
    ctx.fillText("Juego pausado", width / 2 - anchoTexto / 2, height / 4)
    ctx.restore();
}

/*
Dibuja el boton de nuevo juego
*/
function dibujarBotonNuevoJuego() {
    let index = 2;
    if (pausado) {
        index = 1;
    }
    ctx.drawImage(imagenJugar, botones.nuevoJuego[index].x, botones.nuevoJuego[index].y, botones.nuevoJuego[index].width, botones.nuevoJuego[index].height);
}

/*
Dibuja el boton de reiniciar
*/
function dibujarBotonReiniciar() {
    let index = 1;
    if (pausado) {
        index = 0;
    }
    ctx.drawImage(imagenReiniciar, botones.reiniciar[index].x, botones.reiniciar[index].y, botones.reiniciar[index].width, botones.reiniciar[index].height);
}

/*
Dibuja los botones de desactivar/activar sonido y de reanudar/pausar segun corresponda
*/
function dibujarBotones() {
    if (muteado) {
        dibujarBotonDesactivarSonido();
    } else {
        dibujarBotonActivarSonido();
    }
    if (pausado) {
        dibujarBotonReanudar();
    } else {
        dibujarBotonPausa();
    }
}

/*
Dibuja el boton de desactivar sonido
*/
function dibujarBotonDesactivarSonido() {
    ctx.drawImage(imagenDesactivarSonido, botones.desactivarSonido.x, botones.desactivarSonido.y, botones.desactivarSonido.width, botones.desactivarSonido.height);
}

/*
Dibuja el boton de activar sonido
*/
function dibujarBotonActivarSonido() {
    ctx.drawImage(imagenActivarSonido, botones.desactivarSonido.x, botones.desactivarSonido.y, botones.desactivarSonido.width, botones.desactivarSonido.height);
}

/*
Dibuja el boton de reanudar
*/
function dibujarBotonReanudar() {
    ctx.drawImage(imagenReanudar, botones.pausa.x, botones.pausa.y, botones.pausa.width, botones.pausa.height);
}

/*
Dibuja el boton de pausa
*/
function dibujarBotonPausa() {
    ctx.drawImage(imagenPausar, botones.pausa.x, botones.pausa.y, botones.pausa.width, botones.pausa.height);
}

/*
Setea el turno principal de forma aleatoria, alterna los siguientes y desbloquea la ficha del jugador activo para que pueda moverla
*/
function cambioTurno() {
    if (turno == -1) {
        turno = Math.floor(Math.random() * 2);
    } else
        if (turno == 0) {
            turno = 1;
        } else {
            turno = 0;
        }
    fichas[turno][fichas[turno].length - 1].setBloqueada(false);
    reDibujar();
};

/*
Anima el hint haciendo que suba y baje hasta un tope, tambien dibuja la ficha para que no desaparezca en la animacion
*/
function animarHint() {
    requestAnimationFrame(animarHint);
    if (fichaSeleccionada != null) {
        if (posHint.y == 0) {
            hintCaida = false
        }
        if (posHint.y == -60) {
            hintCaida = true;
        }
        if (hintCaida) {
            posHint.y++;
        } else {
            posHint.y--;
        }
        reDibujar();
        fichaSeleccionada.dibujar();
    }
    else {
        if (posHint.y > -60) {
            posHint.y--;
            reDibujar();
        }
    }
}

/*
Dibuja el hint dependiendo de si está la columna llena o no
*/
function dibujarHint() {
    let hintX = (width / 2 - modosDeJuegos[modoDeJuego].columnas * modosDeJuegos[modoDeJuego].tamanioCasillero / 2) + 10;
    for (let index = 0; index < modosDeJuegos[modoDeJuego].columnas; index++) {
        if (!columnasLlenas[index])
            ctx.drawImage(hint, hintX + modosDeJuegos[modoDeJuego].tamanioCasillero * index, posHint.y, 40, 60);
    }
}

/*
Calcula si la posición que el usuario quiere soltar la ficha es valida (utiliza una formula para saber si el mouse está arriba del tablero y dentro del width de éste)
*/
function zonaParaSoltarFicha(x, y) {
    return (x > width / 2 - modosDeJuegos[modoDeJuego].tamanioCasillero * (modosDeJuegos[modoDeJuego].columnas / 2) && x < width / 2 + modosDeJuegos[modoDeJuego].tamanioCasillero * (modosDeJuegos[modoDeJuego].columnas / 2) && y > 0 && y < height / 2 - modosDeJuegos[modoDeJuego].tamanioCasillero * (modosDeJuegos[modoDeJuego].filas / 2));
};

/*
Calcula en que columna quiere el usuario colocar la ficha y la ubica en su posicion correspondiente, tambien retorna si se pudo insertar o no
*/
function colocarFicha(e) {
    let x = e.offsetX;
    if (!hayGanador()) {
        for (let i = modosDeJuegos[modoDeJuego].columnas - 1; i >= 0; i--) {
            if (x > width / 2 - modosDeJuegos[modoDeJuego].tamanioCasillero * (modosDeJuegos[modoDeJuego].columnas / 2) + i * modosDeJuegos[modoDeJuego].tamanioCasillero) {
                if (columnasLlenas[i]) {
                    return false;
                }
                tablero.insertarFicha(i, fichaSeleccionada);
                ganador = fichaSeleccionada;
                reDibujar();
                if (hayGanador()) {
                    setTimeout(() => {
                        terminarJuego(ganador);
                    }, 1000);
                } else {
                    if (tablero.lleno()) {
                        setTimeout(() => {
                            empate();
                        }, 1000);
                        return true;
                    }
                    cambioTurno();
                }
                return true;
            }
        }
    }
};

/*
Le pregunta al tablero si hay un ganador
*/
function hayGanador() {
    return tablero.hayGanador();
}

/*
Cambia la pantalla al 4 y presenta al ganador con los botones para resetear o empezar una nueva partida
*/
function terminarJuego(ficha) {
    pantalla = 4;
    audioJuego.pause();
    audioJuego.currentTime = 0;
    audioGanador.play();
    dibujarFondo();
    ctx.save();
    ctx.drawImage(imagenJugadorGanador, 0, 0, width, height);
    document.fonts.load('10pt "Concert One"').then(() => {
        ctx.font = '35px "Concert One"';
        ctx.drawImage(fondoMadera, width / 2 - 125, height / 2.2, 250, 220);
        ctx.fillStyle = 'black';
        let texto = "Ganador:";
        let anchoTexto = ctx.measureText(texto).width;
        ctx.fillText(texto, width / 2 - anchoTexto / 2, height / 1.9);
        ctx.restore();
        temporizador.pausar();
        mostrarGanador(ficha);
    });
    dibujarBotonNuevoJuego();
    dibujarBotonReiniciar();
};

/*
Muestra la ficha del ganador
*/
function mostrarGanador(ficha) {
    ficha.setPos(width / 2, height / 1.5);
    ficha.setRadio(0);
    ficha.dibujar();
    ganador = ficha;
    animarFichaGanador();
}

/*
Animacion para la ficha del ganador, se hace mas grande hasta llegar al tope
*/
function animarFichaGanador() {
    if (pantalla == 4) {
        requestAnimationFrame(animarFichaGanador);
        if (ganador.getRadio() <= 50) {
            ganador.setRadio(ganador.getRadio() + 1);
            ganador.dibujar();
        }
    }
}

/*
Cambia la pantalla a 4, reproduce el audio correspondiente y dibuja el empate
*/
function empate() {
    pantalla = 4;
    audioJuego.pause();
    audioJuego.currentTime = 0;
    audioEmpate.play();
    ctx.save();
    ctx.drawImage(imagenEmpate, 0, 0, width, height);
    document.fonts.load('10pt "Concert One"').then(() => {
        ctx.font = '35px "Concert One"';
        ctx.fillText('Empate', width / 2 - 90, height / 2 - 140);
        dibujarBotonNuevoJuego();
        dibujarBotonReiniciar();
        ctx.restore();
        temporizador.pausar();
    });
}