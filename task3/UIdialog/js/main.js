(function() {

    var sign = $("#sign");
    var dialog = new Dialog("pop");
            dialog.show();

    EventUtil.addHandler(sign, "click", function() {
        dialog.show();
    });
    DragDrop.enable();

})();