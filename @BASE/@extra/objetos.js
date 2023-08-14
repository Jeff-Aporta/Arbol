function CONCAT(...objetos) {
    return objetos.reduce((retorno, objeto) => {
        return { ...retorno, ...objeto };
    }, {});
}

export default {
    CONCAT
}