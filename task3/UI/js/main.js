(function() {

    var sign = $("#sign");
    var dialog = new Dialog("pop");
    addHandler(sign, "click", function(e) {
        dialog.show();
    });


})();