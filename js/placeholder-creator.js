function PlaceholderCreator() {
    "use strict";
    var forms = new Array();
    var fields = new Array();
    var propertyTitle = "country";
    var placeholder = " (xxx) xxx-xx-xx";
    var countryCodes = new Array();
    this.setСountryCodes = function(getter) {
        countryCodes = getter.CountryCodes();
    };
    var geoData = new Object();
    this.setGeoData = function(detector) {
        if (detector) geoData = detector.getGeoData();
    };
    this.initilize = function(elements) {
        var counter = 0;
        var internalCounter = 0;
        var form = new Object();
        var indicator = false;
        if (elements) {
            for (counter = 0; counter < elements.length; counter++) {
                if (elements[counter].nodeName === "FORM") {
                    form = elements[counter];
                    forms.push(form);
                    //Поиск поля для ввода телефонных номеров;
                    while (!indicator && internalCounter < form.elements.length) {
                        if (form.elements[internalCounter].type === "tel") {
                            fields.push(form.elements[internalCounter]); 
                            indicator = true;
                        } else internalCounter++;
                    }
                }
                if (indicator) {
                    indicator = false;
                } else notify("Не найдено поле для ввода телефонных номеров;");
                internalCounter = 0;
            }
        } else notify("Необходимо передать ссылку на массив, содержащий HTML-формы;");
    };
    this.setPlaceholders = function() {
        var counter = 0;
        if (geoData[propertyTitle]) {
            for (counter = 0; counter < fields.length; counter++) {
                if (countryCodes[geoData[propertyTitle]]) fields[counter].placeholder = countryCodes[geoData[propertyTitle]] + placeholder;
                else fields[counter].value = "+";
            }
        }
    };
}