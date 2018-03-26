function Restorer() {
    "use strict";
    var forms = new Array();
    this.Forms = function(value) {
        if (!arguments.length) return forms;
        else forms = value;
    };
    this.setForm = function(value) {
        forms.push(value);
    };
    //Метод отвечает за восстановление введённых пользователем данных на
    //основании использования localStorage;
    this.execute = function() {
        var counter = 0;
        var user = JSON.parse(localStorage.getItem("fr-user"));
        if (user) {
            for (counter = 0; counter < forms.length; counter++) {
                //Заполнение текстовых полей;
                for (var key in user) {
                    if (forms[counter][key]) forms[counter][key].value = user[key];
                }
            }
        }
    };
}