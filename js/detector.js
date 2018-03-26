function Detector() {
    "use strict";
    var setter = new Object();
    var city = "";
    var country_name = "";
    var country_code = "";
    var callbacks = new Array();
    this.addCallback = function(value) {
        if (typeof value === "function") callbacks.push(value);
    };
    this.getGeoData = function() {
        return {"geo": country_name, "city": city, "country": country_code};
    };
    var setGeoData = function(forms, data) {
        var counter = 0;
        //Установка значений для гео-полей формы;
        try {
            setter = new GeoSetter();
            setter.setGeoData(data);
            setter.Forms(forms);
            setter.execute();
        } catch (error) {
            if (error instanceof ReferenceError) {
                notify("Не подключен скрипт 'setter.js';");
            }
        }
        //Вызов запланированных callback;
        if (callbacks.length) {
            for (counter = 0; counter < callbacks.length; counter++) {
                callbacks[counter]();
            }
        }
    };
    /*
     * Метод отвечает за определение гео-локации пользователя и установку значений
     * для соответственных полей;
     */
    this.detect = function(forms) {
        var XHR = new XMLHttpRequest();
        var response = new Object();
        XHR.onreadystatechange = function() {
            if (XHR.readyState === 4) {
                response = JSON.parse(XHR.responseText);   
                //Установка значений для гео-полей;
                country_code = response.country_code;
                city = response.city;
                country_name = response.country_name;
                setGeoData(forms, this.getGeoData());
            }
        }.bind(this);
        //Формирование запроса на сервер, если гео-данные ещё не получены;
        if (!localStorage.getItem("fr-user-geo")) {
            XHR.open("GET", "https://freegeoip.net/json/", false);
            XHR.send();
        //Иначе записываем уже имеющиеся;
        } else setGeoData(forms, JSON.parse(localStorage.getItem("fr-user-geo")));
    };
}