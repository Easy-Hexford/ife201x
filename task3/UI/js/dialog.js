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
    addHandler(self.ele, "click", function(e) {
        self.hide();
    });

    addHandler(self.content, "click", function(e) {
        e.stopPropagation();
    });

    addHandler(self.footer, "click", function(e) {
        if (e.target && e.target.tagName == "BUTTON") {
            self.hide();
        }
    });

    startDrag(self.header, self.content);
};

/**
 * [startDrag 窗体拖拽]
 * @param  {[type]} bar    [选中的元素]
 * @param  {[type]} target [移动的目标]
 */
function startDrag(bar, target) {
    var disX, disY;
    addHandler(bar, "mousedown", function(e) {
        disX = e.clientX - target.offsetLeft;
        disY = e.clientY - target.offsetTop;
    });

    addHandler(document, "mousemove", function(e){
        target.style.left = e.clientX - disX + "px";
        target.style.top = e.clientY - disY + "px";
    });

    addHandler(bar, "mouseup", function() {
            document.onmousemove = null;
            document.onmouseup = null;
    });
}