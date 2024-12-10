class Temporizador {
    constructor(tiempo, ctx) {
        this.tiempo = tiempo;
        this.ctx = ctx;
        this.pausado = true;
    }

    /*
    Dibuja el temporizador con el tiempo actual
    */
    dibujar() {
        this.ctx.save();
        document.fonts.load('10pt "Concert One"').then(() => {
            this.ctx.font = '35px "Concert One"';
            ctx.drawImage(fondoMadera, width / 2 - 70, height - 60, 140, 50);
            this.ctx.fillStyle = 'black';
            let anchoTexto = this.ctx.measureText(this.tiempo).width;
            this.ctx.fillText(this.tiempo, width / 2 - anchoTexto/2, height - 25);
        });
    }

    /*
    Inicia el temporizador
    */
    iniciar() {
        this.pausado = false;
        this.decrementarTiempo();
    }

    /*
    Pausa el temporizador
    */
    pausar() {
        this.pausado = true;
    }

    /*
    Reanuda el temporizador
    */
    reanudar() {
        this.pausado = false;
    }

    /*
    Cada 1 segundo reduce el tiempo en 1 y dibuja el temporizador
    */
    decrementarTiempo() {
        if (this.tiempo == 0) {
            empate();
        } else {
            if (!this.pausado) {
                this.tiempo--;
                this.dibujar();
            }
            setTimeout(() => {
                this.decrementarTiempo();
            }, 1000);
        }
    }
}