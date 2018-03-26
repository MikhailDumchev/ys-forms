function GeoSetter() {
    "use strict";
    var additoryAttribute = "data-geo";
    var forms = new Array();
    this.Forms = function(value) {
        if (!arguments.length) return forms;
        else forms = value;
    };
    this.setForm = function(value) {
        forms.push(value);
    };
    //Объект с гео-данными;
    var geoData = new Object();
    //Метод отвечает за получение гео-данных пользователя;
    this.setGeoData = function(value) {
        geoData = value;
    };
    this.execute = function() {
        var counter = 0;
        for (counter = 0; counter < forms.length; counter++) {
            //Названия текстовых полей должны быть идентичны названиям свойств
            //объекта, в котором хранятся гео-данные;
            for (var key in geoData) {
                if (forms[counter][key] && forms[counter][key].hasAttribute(additoryAttribute)) {
                    forms[counter][key].value = geoData[key];
                }
            }
        }
    };
}