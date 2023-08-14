let root = {
    variable: {
        obtener: (nombre) => {
            getComputedStyle(document.documentElement).getPropertyValue(nombre);
        },
        modificar: (nombre, valor) => {
            document.documentElement.style.setProperty(nombre, valor)
        }
    }
};

let JSON2CSS = (json) => {
    let cambiar_llaves = (objeto, profundidad) => {
        objeto = structuredClone(objeto);
        Object.entries(objeto).forEach(([llave, valor]) => {
            if (typeof valor == "object") {
                valor = cambiar_llaves(valor, (profundidad ?? 0) + 1);
                if (!profundidad) {
                    objeto["." + llave] = valor;
                } else {
                    objeto["&." + llave] = valor;
                }
                delete objeto[llave];
            }
        });
        return objeto;
    };
    return JSON.stringify(cambiar_llaves(json), null, "\t").slice(1, -1).reemplazarUltimaComaSaltoLinea().replaceAll(`"`, ``).replaceAll(": {", "{").replaceAll("};", "}");
};

export default {
    root,
    JSON2CSS
}