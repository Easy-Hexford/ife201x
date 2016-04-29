/*简化对象选择*/
$ = function(el) {
    return document.querySelector(el);
};

$$ = function(el) {
    return document.querySelectorAll(el);
};

/*addEventLister兼容性*/
function addHandler(ele, type, handler) {
    if (ele.addEventListener) { // 所有主流浏览器，除了 IE 8 及更早版本
        ele.addEventListener(type, handler, false);
    } else if (ele.attachEvent) { // IE 8 及更早版本
        ele.attachEvent("on" + type, handler);
    } else {
        ele["on" + type] = handler;
    }
}

function removeHandler(element, type, handler) { //取消事件
    if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
        element.detachEvent("on" + type, handler);
    } else {
        element["on" + type] = null;
    }
}