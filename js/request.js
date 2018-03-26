/**
 * Класс отвечает за AJAX-отправку сообщений на сервер
 */
function Request() {
    "use strict";
    var validationObject = new Object();
    var spinnerObject = new Object();
    var requestCallerClassName = "request-caller";
    var handlerAddress = "https://air2.yaroslav-samoylov.com/lead/add/";
    this.HandlerAddress = function(value) {
        if (!arguments.length) return handlerAddress;
        else handlerAddress = value;
    };
    var buttons = new Array();
    this.Buttons = function(elements) {
        var counter = 0;
        for (counter = 0; counter < elements.length; counter++) {
            if (testClassName(elements[counter], requestCallerClassName)) {
                buttons.push(elements[counter]);
            }
        }
    };
    this.setButton = function(element) {
        if (testClassName(element, requestCallerClassName)) {
            buttons.push(element);
        }
    };
    var validationIndicator = true;
    this.ValidationIndicator = function(value) {
        if (!arguments.length) return validationIndicator;
        else validationIndicator = value;
    };
    var refreshIndicator = false;
    this.RefreshIndicator = function(value) {
        if (!arguments.length) return refreshIndicator;
        else refreshIndicator = value;
    };
    //Название индикатора-заглушки, который препятствует отправке формы;
    var indicatorTitle = "data-indicator";
    this.IndicatorTitle = function(value) {
        if (!arguments.length) return indicatorTitle;
        else indicatorTitle = value;
    };
    var clearTextFields = function(form) {
        var counter = 0;
        var additoryObject = new Object();
        for (counter = 0; counter < form.elements.length; counter++) {
            additoryObject = form.elements[counter];
            switch (additoryObject.type) {
                case "submit":
                case "hidden":
                case "radio":
                case "checkbox":
                    break;
                default:
                    if (additoryObject.value.length) additoryObject.value = "";
                    break;
            }
        }
    };
    //Метод инициализирует возможность AJAX-отправки данных;
    this.appendHandler = function() {
        var counter = 0;
        var additoryVariable = new Object();
        for (var counter = 0; counter < buttons.length; counter++) {
            additoryVariable = buttons[counter];
            //Поиск формы, к которой относится кнопка;
            while (additoryVariable.nodeName !== "BODY" && additoryVariable.nodeName !== "FORM")
                additoryVariable = additoryVariable.parentNode;
            if (additoryVariable.nodeName === "FORM") {
                buttons[counter].addEventListener("click", this, false);
                try {
                    spinnerObject = new Spinner();
                    spinnerObject.setContainer(document.body);
                } catch (error) {
                    if (error instanceof ReferenceError) {
                        notify("Не подключен скрипт 'spinner.js';");
                    }
                }
                if (validationIndicator) {
                    try {
                        validationObject = new Validation();
                    } catch (error) {
                        if (error instanceof ReferenceError) {
                            notify("Не подключен скрипт 'validation.js';");
                        }
                    }
                }
            }
        }
    };
    this.handleEvent = function(event) {
        event = event || window.event;
        var XHR = new XMLHttpRequest();
        var form = event.target;
        var additoryObject = new Object();
        //Объект, который используется для сохранения в localStorage введённых пользователем данных;
        var localStorageObject = new Object();
        var data = new Object();
        var permissionIndicator = true;
        var requestBody = "";
        var counter = 0;
        XHR.onreadystatechange = function() {
            if (XHR.readyState === 4) {
                //Заполнение localStorage на основании имён и значений текстовых полей;
                for (counter = 0; counter < form.elements.length; counter++) {
                    additoryObject = form.elements[counter];
                    if (additoryObject.type !== "submit") {
                        switch (additoryObject.type) {
                            case "text":
                            case "email":
                            case "tel":
                                localStorageObject[additoryObject.name] = additoryObject.value;
                                break;
                            case "radio":
                                if (additoryObject.checked) {
                                    localStorageObject[additoryObject.name] = additoryObject.value;
                                }
                                break;
                            default: break;
                        }
                        if (additoryObject.nodeName === "TEXTAREA") {
                            localStorageObject[additoryObject.name] = additoryObject.value;
                        }
                    }
                }
                localStorage.setItem("fr-user", JSON.stringify(
                    localStorageObject
                ));
                //Удаление индикатора-заглушки;
                document.body.removeAttribute(indicatorTitle);
                //Удаление индикатора отправки;
                spinnerObject.removeSpinner();
                additoryObject = JSON.parse(XHR.responseText);
                window.location = additoryObject["redirect"];
                //TODO: Найти и обработать ошибку, которая возникает при перегрузке сервера (код ошибки);
            }
        }.bind(this);
        if (event.type === "click") {
            if (!document.body.hasAttribute(indicatorTitle)) {
                while (form.nodeName !== "BODY" && form.nodeName !== "FORM")
                    form = form.parentNode;
                if (form.nodeName === "FORM") {
                    //Если указана необходимость валидации данных формы перед их отправкой;
                    if (validationIndicator) {
                        validationObject.setForm(form);
                        permissionIndicator = validationObject.validateForm();
                    }
                    if (permissionIndicator) {
                        //Установка индикатора-заглушки;
                        document.body.setAttribute(indicatorTitle, true);
                        //Добавление индикатора отправки;
                        spinnerObject.appendSpinner();
                        //Если используется POST-запросы (или на обработчик необходимо отправлять файлы); 
                        if (form.getAttribute("method") === "POST") {
                            data = new FormData(form);
                            data.append("ajax_indicator", true);
                            XHR.open(form.getAttribute("method"), handlerAddress, true);
                            XHR.send(data);
                        //Если используется GET-запросы;
                        } else {
                            //Формирование тела запроса;
                            for (counter = 0; counter < form.elements.length; counter++) {
                                additoryObject = form.elements[counter];
                                if (additoryObject.type !== "submit") {
                                    switch (additoryObject.type) {
                                        case "text":
                                        case "email":
                                        case "tel":
                                        case "hidden":
                                            requestBody = requestBody + additoryObject.name + "=" + additoryObject.value;
                                            if (counter < form.elements.length - 2) requestBody = requestBody + "&";
                                            break;
                                        case "radio":
                                            if (additoryObject.checked) {
                                                requestBody = requestBody + additoryObject.name + "=" + additoryObject.value;
                                                if (counter < form.elements.length - 2) requestBody = requestBody + "&";
                                            }
                                            break;
                                        default: break;
                                    }
                                    if (additoryObject.nodeName === "TEXTAREA") {
                                        requestBody = requestBody + additoryObject.name + "=" + additoryObject.value;
                                        if (counter < form.elements.length - 2) requestBody = requestBody + "&";
                                    }
                                }
                            }
                            XHR.open(form.getAttribute("method"), handlerAddress + "?" + requestBody + "&ajax_indicator=true", true);
                            XHR.send();
                        }
                        if (refreshIndicator) clearTextFields(form);
                    }
                }
            }
        }
    };
}