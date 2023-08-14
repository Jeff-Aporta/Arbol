if (CONFIG["realizar-barrido-al-iniciar-el-documento"]) {
    $(document).ready(function () {
        realizar_un_barrido_a_todo_el_documento();
    })
}

function leer_contenido_SVG(imgURL, $img) {
    let retorno = "";
    $.get(imgURL, function (data) {
        let $svg = jQuery(data).find('svg');

        $svg = $svg.removeAttr('xmlns:a');
        $svg = $svg.removeAttr('xmlns');

        if ($img) {
            $img.removeAttr('src');
            $.each($img.prop("attributes"), function () {
                $svg.attr(this.name, this.value);
            });
            $img.replaceWith($svg);
        }
        retorno = $svg.prop('outerHTML');
    }, 'xml');
    return retorno;
}

function realizar_un_barrido_a_todo_el_documento() {
    $('img[src$=".svg"]').each(function () {
        let $img = jQuery(this);
        let imgURL = $img.attr('src');
        leer_contenido_SVG(imgURL, $img);
    });
}

export default {
    leer_contenido_SVG,
    realizar_un_barrido_a_todo_el_documento,
    config
}