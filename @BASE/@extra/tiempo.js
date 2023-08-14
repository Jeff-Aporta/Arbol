let hoy = () => {
    let fecha = new Date();
    let diaSemanaNombre = ['Domingo', 'Lunes', 'Martes', 'Mi&eacute;rcoles', 'Jueves', 'Viernes', 'S&aacute;bado'][fecha.getDay()];
    let diaMes = fecha.getDate();
    let mesNombre = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(fecha);
    let añoCompleto = fecha.getFullYear();
    return {
        fecha,
        diaSemanaNombre,
        diaMes,
        mesNombre,
        añoCompleto
    }
}

export default {
    fecha_hoy: {
        //Jueves / 15 de junio de 2023
        diaSemanaNombre_S_diaMes_de_mesNombre_de_añoCompleto: () => {
            let fecha = hoy();
            return fecha.diaSemanaNombre + " / " + fecha.diaMes + " de " + fecha.mesNombre + " de " + fecha.añoCompleto;
        }
    },
    hora_actual: {
        //00:00:00
        HHMMSS: () => {
            let fecha = new Date();
            return [fecha.getHours(), fecha.getMinutes(), fecha.getSeconds()].map(e => e.toString().padStart(2, 0)).join(":");
        },
        //01:01:01 -> 3661
        segundos: () => {
            let fecha = new Date();
            return [fecha.getHours() * 60 * 60, fecha.getMinutes() * 60, fecha.getSeconds()].reduce((suma, s) => suma + s, 0)
        }
    },
    conversion: {
        //3661 -> "01:01:01"
        segundosACadena: (segundos) => {
            return [parseInt(segundos / 60 / 60), parseInt(segundos / 60) % 60, segundos % 60].map(e => e.toString().padStart(2, 0)).join(":");
        },
        //"01:01:01" -> 3661
        cadenaASegundos(cadenaTiempo) {
            let [horas, minutos, segundos] = cadenaTiempo.split(":").map(e => parseFloat(e))
            return horas * 60 * 60 + minutos * 60 + segundos;
        }
    }
}