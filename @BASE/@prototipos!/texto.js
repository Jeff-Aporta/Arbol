String.prototype.eliminarHTML = function() {
    return this.replace( /(<([^>]+)>)/ig, '');
};

String.prototype.parsearAFecha = function () {
    return new Date(Date.parse(this));
};

String.prototype.yyyymmdd = function () {
    return this.parsearAFecha().yyyymmdd();
};

String.prototype.yyyymmddhhmmss = function () {
    return this.parsearAFecha().yyyymmddhhmmss();
};

export default true;