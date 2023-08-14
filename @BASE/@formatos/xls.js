function HTMLTable2XLS(argumentos) {
    let {
        table, 
        html,
        nombreDeArchivo = 'archivo'
    } = argumentos;

    if(!table && !html) {
        return console.error('No se ha especificado la tabla HTML');
    }

    nombreDeArchivo += '.xls';

    let estructuraTabla = html ?? escape(table.outerHTML);

    const dataType = 'application/vnd.ms-excel';

    if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(['ufeff', estructuraTabla], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob(blob, nombreDeArchivo);
    } else {
        let downloadLink = document.createElement("a");
        downloadLink.href = 'data:' + dataType + ', ' + estructuraTabla;
        downloadLink.download = nombreDeArchivo;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();
    }
}