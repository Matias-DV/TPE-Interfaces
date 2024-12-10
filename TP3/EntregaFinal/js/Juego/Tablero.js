class Tablero{
    constructor(col,fil,ctx,imagen,tamanioCasillero,modoJuego){
        this.col = col;
        this.fil = fil;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.imagen = imagen;
        this.tamanioCasillero = tamanioCasillero;
        this.modoJuego = modoJuego;
        this.matriz = [[]];
        for (let fila = 0; fila < this.fil; fila++) {
            for (let columna = 0; columna < this.col; columna++) {
                this.matriz[[fila, columna]] = null;
            }
        }
    }

    /*
    Dibuja el tablero con sus respectivas fichas
    */
    dibujar(){
        columnasLlenas = [];
        // Estilos para el tablero entero y su borde
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(width/2-this.tamanioCasillero*(this.col/2),height/2-this.tamanioCasillero*(this.fil/2), this.col*this.tamanioCasillero, this.fil * this.tamanioCasillero);
        this.ctx.strokeStyle = "#013636";
        this.ctx.lineWidth = 7;
        this.ctx.stroke();
        this.ctx.closePath();
        for (let fila = 0; fila < this.fil; fila++) {
            for (let columna = 0; columna < this.col; columna++) {
                // Estilos para cada cuadrante del tablero
                this.ctx.beginPath();
                this.ctx.drawImage(this.imagen,width/2-this.tamanioCasillero*(this.col/2)+columna*this.tamanioCasillero,height/2-this.tamanioCasillero*(this.fil/2)+fila*this.tamanioCasillero, this.tamanioCasillero, this.tamanioCasillero);
                this.ctx.closePath();
                this.ctx.restore();
                // Dibujo la ficha y si es la ultima de la columna, agrego un true al arreglo columna llena
                if(this.matriz[[fila, columna]] != null){
                    if(fila == 0){
                        columnasLlenas.push(true);
                    }
                    this.matriz[[fila,columna]].dibujar();
                }else{
                    if(fila == 0){
                        columnasLlenas.push(false);
                    }
                }
            }
        }
    }

    /*
    Inserta la ficha en la matriz, en su fila correspondiente y anima su caída
    */
    insertarFicha(columna, ficha){
        for (let fila = this.fil-1; fila >= 0; fila--) {
            if(this.matriz[[fila, columna]] == null){
                this.matriz[[fila, columna]] = ficha;
                let x = (width/2-this.tamanioCasillero*(this.col/2)+columna*this.tamanioCasillero)+(this.tamanioCasillero/2);
                let y = (height/2-this.tamanioCasillero*(this.fil/2)+fila*this.tamanioCasillero)+(this.tamanioCasillero/2);
                this.matriz[[fila, columna]].soltarEn(x,y);
                break;
            }
        }
    }
    
    /*
    Verifica si hay X fichas iguales contiguas en todas las direcciones. (X depende del modo de Juego)
    */
    hayGanador(){
        // Direcciones de búsqueda: [fila, columna]
        const direcciones = [
            [0, 1],   // Derecha
            [1, 0],   // Abajo
            [1, 1],   // Diagonal descendente
            [1, -1]   // Diagonal ascendente
        ];
        for (let fila = 0; fila < this.fil; fila++) {
            for (let columna = 0; columna < this.col; columna++) {
                let fichaActual = this.matriz[[fila, columna]];
                if (fichaActual == null) {
                    continue;
                }
                // Revisar cada dirección a partir de la posición actual
                for (let [sigDirFila, sigDirCol] of direcciones) {
                    let contador = 1; // Contamos la ficha actual
                    // Verificar las siguientes posiciones en la dirección actual
                    for (let paso = 1; paso < this.modoJuego; paso++) {
                        let nuevaFila = fila + paso * sigDirFila;
                        let nuevaColumna = columna + paso * sigDirCol;
                        // Comprobamos si las coordenadas están dentro del tablero
                        if (nuevaFila < 0 || nuevaFila >= this.fil || nuevaColumna < 0 || nuevaColumna >= this.col) {
                            break;
                        }
                        // Comparamos con la ficha actual
                        if (fichaActual.esIgual(this.matriz[[nuevaFila, nuevaColumna]])) {
                            contador++;
                        } else {
                            break;
                        }
                    }
                    // Si encontramos X en línea, retornamos true
                    if (contador === this.modoJuego) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /*
    Verifica si el tablero está lleno
    */
    lleno(){
        console.log(columnasLlenas)
        for (let index = 0; index < columnasLlenas.length; index++) {
            if(!columnasLlenas[index]){
                return false;
            }
        }
        return true;
    }
}