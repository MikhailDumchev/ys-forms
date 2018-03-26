function Spinner() {
    var container = new Object();
    var indicator = new Object();
    var background = new Object();
    var indicatorClassName = "spinner";
    var backgroudClassName = "spinner-background";
    this.setContainer = function(value) {
        "use strict";
        container = value;
    };
    this.appendSpinner = function() {
        "use strict";
        background = document.createElement("div");
        background.className = backgroudClassName;
        indicator = document.createElement("div");
        indicator.className = indicatorClassName;
        container.appendChild(background);
        background.appendChild(indicator);
    };
    this.removeSpinner = function() {
        "use strict";
        background.removeChild(indicator);
        container.removeChild(background);
    };
}