class Ficha {
    constructor(posX, posY, radio, fondo, ctx, nombre, bloqueada) {
        this.posX = posX;
        this.posY = posY;
        this.radio = radio;
        this.fondo = fondo;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.nombre = nombre;
        this.bloqueada = bloqueada;
        this.caerEn;
    }

    /*
    Dibujo la ficha y le doy un borde distinto dependiendo si se puede mover o no
    */
    dibujar() {
        this.ctx.save();
        if (!this.bloqueada) {
            this.ctx.strokeStyle = "red";
            this.ctx.lineWidth = 7;
        } else {
            this.ctx.lineWidth = 3;
        }
        this.ctx.beginPath();
        this.ctx.arc(this.posX, this.posY, this.radio, 0, Math.PI * 2, true);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.clip();
        this.ctx.drawImage(this.fondo, this.posX - this.radio, this.posY - this.radio, this.radio * 2, this.radio * 2);
        this.ctx.restore();
    }
    /* 
    Setea en que coordenadas caerá la ficha
    */
    soltarEn(x, y) {
        this.caerEn = y;
        this.posX = x;
        this.caer();
    }

    /*
    Animación de caída
    */
    caer() {
        if (this.posY < this.caerEn) {
            this.posY += 20;
            reDibujar();
            requestAnimationFrame(() => this.caer());
        } if (this.posY > this.caerEn) {
            this.posY = this.caerEn;
            reDibujar();
        }
    }

    /*
    Setea la posicion de la ficha por otra
    */
    setPos(x, y) {
        this.posX = x;
        this.posY = y;
    }

    /*
    Setea el radio de la ficha por otra
    */
    setRadio(radio) {
        this.radio = radio;
    }

    /*
    Retorna el radio de la ficha
    */
    getRadio() {
        return this.radio;
    }

    /*
    Retorna el nombre de la ficha
    */
    getNombre() {
        return this.nombre;
    }

    /*
    Verifica si el mouse está sobre la ficha
    */
    mouseDentro(x, y) {
        let dx = x - this.posX;
        let dy = y - this.posY;
        let distancia = Math.sqrt(dx * dx + dy * dy);
        return distancia <= this.radio;
    }

    /*
    Verifica si una ficha es igual a la otra por su nombre
    */
    esIgual(ficha) {
        if (ficha == null) {
            return false;
        }
        return this.nombre == ficha.getNombre();
    }

    /*
    Verifica si la ficha se puede mover
    */
    isBloqueada() {
        return this.bloqueada;
    }

    /*
    Bloquea la ficha para que no se pueda mover
    */
    setBloqueada(bloqueada) {
        this.bloqueada = bloqueada;
    }

}