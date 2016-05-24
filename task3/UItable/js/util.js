/*简化对象选择*/
$ = function(el) {
    return document.querySelector(el);
};

$$ = function(el) {
    return document.querySelectorAll(el);
};


var EventUtil = {
    getEvent: function(event) {
        return event ? event : window.event;
    },
    getTarget: function(event) {
        return event.target || event.srcElement;
    },
    addHandler: function(element, type, handler) {
        if (element.addEventListener) { // 所有主流浏览器，除了 IE 8 及更早版本
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) { // IE 8 及更早版本
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    removeHandler: function(element, type, handler) { //取消事件
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },
    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
};

var DragDrop = (function() {
    var dragging = null,
        diffX = 0,
        diffY = 0;

    function handleEvent(event) {

        //获取事件和目标
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        //确定事件类型
        switch (event.type) {
            case "mousedown":
                if (target.className.indexOf("draggable") > -1) {
                    dragging = target;
                    diffX = event.clientX - target.offsetLeft;
                    diffY = event.clientY - target.offsetTop;
                }
                break;
            case "mousemove":
                if (dragging !== null) {
                    dragging.style.left = (event.clientX - diffX) + "px";
                    dragging.style.top = (event.clientY - diffY) + "px";
                }
                break;
            case "mouseup":
                dragging = null;
                break;
        }
    }

    return {
        enable: function() {
            EventUtil.addHandler(document, "mousedown", handleEvent);
            EventUtil.addHandler(document, "mousemove", handleEvent)
            EventUtil.addHandler(document, "mouseup", handleEvent);
        },
        disable: function() {
            EventUtil.removeHandler(document, "mousedown", handleEvent);
            EventUtil.removeHandler(document, "mousemove", handleEvent)
            EventUtil.removeHandler(document, "mouseup", handleEvent);
        }
    }
})();