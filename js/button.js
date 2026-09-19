const abrir = document.querySelector('#abrir');
const siguiente = document.querySelector('#siguiente');
const atras = document.querySelector('#atras');
const cerrar = document.querySelector('#cerrar');
const sobre = document.querySelector('.sobre');
const tarjetas = Array.from(document.querySelectorAll('.tarjeta'));
const audio = document.querySelector('#audio-player');
const playButton = document.querySelector('#play-button');
const disco = document.querySelector('.disco');
const audioFinal = document.querySelector('#audio-player-final');
const playButtonFinal = document.querySelector('#play-button-final');
const discoFinal = document.querySelector('.disco-final');

let paginaActual = 0;
const totalTarjetas = tarjetas.length;

function actualizarBotonReproduccion() {
    if (!audio || !playButton || !disco) return;

    const reproduciendo = !audio.paused && !audio.ended;
    playButton.textContent = reproduciendo ? '❚❚' : '▶';
    playButton.classList.toggle('hidden', reproduciendo);
    disco.classList.toggle('girando', reproduciendo);

    if (!reproduciendo) {
        disco.style.transform = 'rotate(0deg)';
        disco.style.animation = 'none';
        void disco.offsetWidth;
        disco.style.animation = '';
    }
}

function actualizarBotonReproduccionFinal() {
    if (!audioFinal || !playButtonFinal || !discoFinal) return;

    const tieneFuente = !!(audioFinal.src || audioFinal.getAttribute('src'));
    const reproduciendo = tieneFuente && !audioFinal.paused && !audioFinal.ended;

    playButtonFinal.textContent = reproduciendo ? '❚❚' : '▶';
    playButtonFinal.classList.toggle('hidden', reproduciendo);
    discoFinal.classList.toggle('girando', reproduciendo);

    if (!reproduciendo) {
        discoFinal.style.transform = 'rotate(0deg)';
        discoFinal.style.animation = 'none';
        void discoFinal.offsetWidth;
        discoFinal.style.animation = '';
    }
}

function reiniciarDiscoFinal() {
    if (!discoFinal) return;

    discoFinal.classList.remove('girando');
    discoFinal.style.transform = 'rotate(0deg)';
    discoFinal.style.animation = 'none';
    void discoFinal.offsetWidth;
    discoFinal.style.animation = '';

    if (audioFinal) {
        audioFinal.currentTime = 0;
    }
}

function reiniciarDisco() {
    if (!disco) return;

    disco.classList.remove('girando');
    disco.style.transform = 'rotate(0deg)';
    disco.style.animation = 'none';
    void disco.offsetWidth;
    disco.style.animation = '';

    if (audio) {
        audio.currentTime = 0;
    }
}

function detenerMusica() {
    [audio, audioFinal].forEach((elemento) => {
        if (!elemento) return;

        if (!elemento.paused) {
            elemento.pause();
        }

        elemento.currentTime = 0;
    });

    reiniciarDisco();
    reiniciarDiscoFinal();
    actualizarBotonReproduccion();
    actualizarBotonReproduccionFinal();
}

function actualizarVista() {
    const cartaAbierta = paginaActual !== 0;

    sobre.classList.toggle('hidden', cartaAbierta);
    sobre.classList.toggle('vibrando', !cartaAbierta);

    tarjetas.forEach((tarjeta, index) => {
        const esVisible = paginaActual === index + 1;
        tarjeta.classList.toggle('visible', esVisible);
    });

    if (paginaActual !== 3) {
        detenerMusica();
    }

    abrir.classList.toggle('hidden', cartaAbierta);
    atras.classList.toggle('hidden', !cartaAbierta || paginaActual === 1);
    cerrar.classList.toggle('hidden', !cartaAbierta);
    siguiente.classList.toggle('hidden', !cartaAbierta || paginaActual === totalTarjetas);
}

abrir.addEventListener('click', () => {
    if (paginaActual === 3 || paginaActual === 4) {
        detenerMusica();
    }
    paginaActual = 1;
    actualizarVista();
});

siguiente.addEventListener('click', () => {
    if (paginaActual < totalTarjetas) {
        if (paginaActual === 3 || paginaActual === 4) {
            detenerMusica();
        }
        paginaActual += 1;
        actualizarVista();
    }
});

atras.addEventListener('click', () => {
    if (paginaActual > 1) {
        if (paginaActual === 3 || paginaActual === 4) {
            detenerMusica();
        }
        paginaActual -= 1;
        actualizarVista();
    }
});

cerrar.addEventListener('click', () => {
    if (paginaActual === 3 || paginaActual === 4) {
        detenerMusica();
    }
    paginaActual = 0;
    actualizarVista();
});

if (audio && playButton && disco) {
    playButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });

    audio.addEventListener('play', actualizarBotonReproduccion);
    audio.addEventListener('pause', actualizarBotonReproduccion);
    audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        actualizarBotonReproduccion();
    });
}

if (audioFinal && playButtonFinal && discoFinal) {
    const rutaFinal = './Musica/CarelessWhisper.MP3';

    if (!audioFinal.getAttribute('src') && !audioFinal.src) {
        audioFinal.src = rutaFinal;
        audioFinal.load();
    }

    playButtonFinal.addEventListener('click', () => {
        const tieneFuente = !!(audioFinal.src || audioFinal.getAttribute('src'));

        if (!tieneFuente) {
            return;
        }

        if (audioFinal.paused) {
            audioFinal.play();
        } else {
            audioFinal.pause();
        }
    });

    audioFinal.addEventListener('play', actualizarBotonReproduccionFinal);
    audioFinal.addEventListener('pause', actualizarBotonReproduccionFinal);
    audioFinal.addEventListener('ended', () => {
        audioFinal.currentTime = 0;
        actualizarBotonReproduccionFinal();
    });
}

actualizarVista();
actualizarBotonReproduccion();
actualizarBotonReproduccionFinal();

