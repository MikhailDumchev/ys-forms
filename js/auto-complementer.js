/**
 * Класс отвечает за авто-дополнение телефонного номера кодом страны;
 */
function AutoComplementer() {
    "use strict";
    var fields = new Array();
    var propertyTitle = "country";
    //Коды стран;
    var countryCodes = new Array();
    this.setСountryCodes = function(getter) {
        countryCodes = getter.CountryCodes();
    };
    var geoData = new Object();
    this.setGeoData = function(detector) {
        if (detector) geoData = detector.getGeoData();
    };
    var reloadIndictor = false;
    var callbacks = new Array();
    this.addCallback = function(value) {
        if (typeof value === "function") callbacks.push(value);
    };
    //Метод отвечает за добавление кода оператора в текстовое поле;
    var addCountryCode = function(field) {
        if (geoData[propertyTitle] && !field.value.length) {
            if (countryCodes[geoData[propertyTitle]]) field.value = countryCodes[geoData[propertyTitle]];
            else field.value = "+";
        }
    };
    //Метод отвечает за начальную очистку текстового поля;
    var reloadPhoneField = function(element) {
        element.value = "";
    };
    //Инициализирующий метод;
    this.initilize = function(elements) {
        var counter = 0;
        var internalCounter = 0;
        var form = new Object();
        var indicator = false;
        if (elements) {
            for (counter = 0; counter < elements.length; counter++) {
                if (elements[counter].nodeName === "FORM") {
                    form = elements[counter];
                    //Поиск поля для ввода телефонных номеров;
                    while (!indicator && internalCounter < form.elements.length) {
                        if (form.elements[internalCounter].type === "tel") {
                            if (reloadIndictor) reloadPhoneField(form.elements[internalCounter]);
                            form.elements[internalCounter].addEventListener("focus", this, true);
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
        //Вызов запланированных callback;
        if (callbacks.length) {
            for (counter = 0; counter < callbacks.length; counter++) {
                callbacks[counter]();
            }
        }
    };
    //Обработчик;
    this.handleEvent = function (event) {
        event = event || window.event;
        var target = event.target;
        if (event.type === "focus") {
            //Отложеное выполнение обработки события (гарантированная асинхронность);
            setTimeout(function() { 
                addCountryCode(target);
            }.bind(this), 0);
        }
    };
}