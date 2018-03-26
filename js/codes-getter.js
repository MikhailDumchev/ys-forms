function CodesGetter() {
    var countryCodes = new Array();
    this.CountryCodes = function(value) {
        if (!arguments.length) return countryCodes;
        else countryCodes = value;
    };
    var callbacks = new Array();
    this.addCallback = function(value) {
        if (typeof value === "function") callbacks.push(value);
    };
    this.getСountryCodes = function() {
        var url = "operator-code.json";
        var XHR = new XMLHttpRequest();
        XHR.onreadystatechange = function() {
            var counter = 0;
            if (XHR.readyState === 4) {
                if (XHR.status !== 200) notify(XHR.status + ": " + XHR.statusText);
                else {
                    countryCodes = JSON.parse(XHR.responseText);
                    //Вызов запланированных callback;
                    if (callbacks.length) {
                        for (counter = 0; counter < callbacks.length; counter++) {
                            callbacks[counter]();
                        }
                    }
                }
            }
        };
        XHR.open("GET", url, true);
        XHR.send();
    };
}