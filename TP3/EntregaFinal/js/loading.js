'use strict';

let progress = 0;
        const progressText = document.getElementById("porcentajedeprogreso");
        const body = document.body;
        body.style.overflow = 'hidden';
        const interval = setInterval(() => {
            progress++;
            progressText.textContent = progress + "%";
            if (progress >=100) {
                clearInterval(interval);
                setTimeout(cargaCompletada,1000);
            }
        }, 50);

function cargaCompletada(){
                document.getElementById("pantalladecarga").style.display = "none";
                body.style.overflow = 'auto';
}