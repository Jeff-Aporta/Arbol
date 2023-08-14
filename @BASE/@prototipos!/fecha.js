Date.prototype.yyyymmddhhmmss = function () {
    let formateado = [[this.getFullYear(), this.getMonth() + 1, this.getDate()], [this.getHours(), this.getMinutes(), this.getSeconds()]].map(e => e.map(e => e.toString().padStart(2, 0)));
    return formateado[0].join("-") + " " + formateado[1].join(":");
};

Date.prototype.yyyymmdd = function () {
    let formateado = [this.getFullYear(), this.getMonth() + 1, this.getDate()].map(e => e.toString().padStart(2, 0));
    return formateado.join("-");
};

export default true;