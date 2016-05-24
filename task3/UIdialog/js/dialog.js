/**
 * [Dialog 弹出框]
 * @param {[type]} id [弹出框的ID]
 */
var Dialog = function(id) {
    //获取内部结构
    this.ele = $("#" + id);
    this.header = $("#" + id + " .dialog-header");
    this.footer = $("#" + id + " .dialog-footer");
    this.content = $("#" + id + " .dialog-content");
    this.body = $("#" + id + " .dialog-body");

    this.init();
};

//显示弹出框
Dialog.prototype.show = function() {
    this.ele.style.visibility = "visible";
};

//隐藏弹出框
Dialog.prototype.hide = function() {
    this.ele.style.visibility = "hidden";
}

//初始化事件，点击遮罩层隐藏，点击按钮隐藏等
Dialog.prototype.init = function() {
    var self = this;
    // EventUtil.addHandler(self.ele, "click", function() {
    //     self.hide();
    // });

    // EventUtil.addHandler(self.content, "click", function(event) {
    //     event = EventUtil.getEvent(event);
    //     EventUtil.stopPropagation(event);
    // });

    EventUtil.addHandler(self.footer, "click", function(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        if (target && target.tagName == "BUTTON") {
            self.hide();
        }
    });
};

