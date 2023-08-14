let selectpickerOptions2Array = (id) => {
    var select = document.getElementById(id);
    var size = select.options.length;
    var s = [];
    if (select != null) {
        for (var i = 0; i < size; i++) {
            if (select.options[i].selected) {
                var v = select.options[i].innerText;
                s.push(v)
            }
        }
    }
    return s;
};

export default {
    selectpickerOptions2Array
};