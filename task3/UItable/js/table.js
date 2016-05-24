/*
    表格插件&参数说明
    
    可配选项
    1. 自动生成表格
    2. 指定列添加排序按钮
    3. 分为表格生产和排序两个模块
    3. 表头冻结
    4. 样式，数据分离，可更换样式

 */


/**
 * [Table 可排序表格组件]
 * @param {[type]} id      [表格的ID]
 * @param {[type]} data    [表格数据，包括标题和内容]
 * @param {[type]} sortCol [待排序的列]
 */
function Table(id, data, sortCol) {
    this.ele = $("#" + id);
    this.title = data.title;
    this.content = data.content;
    this.sortCol = sortCol || [];

    this.init();
}

Table.prototype = {
    init: function() {
        if (this.ele == null) return;
        this.render();
    },

    render: function() {
        var table = this.ele,
            title = this.title,
            content = this.content,
            length = content.length,
            oTbody = document.createElement("tbody");

        table.innerHTML = "";
        table.createTHead();
        table.tHead.innerHTML = title.map(function(value) {
            return "<th>" + value + "</th>";
        }).join("");
        for (var i = 0; i < length; i++) {
            oTbody.insertRow(i);
            oTbody.rows[i].innerHTML = content[i].map(function(value) {
                return "<td>" + value + "</td>";
            }).join("");
        }
        table.appendChild(oTbody);
        this.addSortBtn(this.sortCol);
    },

    /**
     * [addSortBtn 给列添加排序按钮]
     * @param {[type]} sortCol [待排序的列的位置，数组下标从0开始]
     */
    addSortBtn: function(sortCol) {
        var self = this;
        var ths = self.ele.tHead.rows[0].cells;
        //根据点击的位置添加
        sortCol.map(function(value) {
            var div = document.createElement("div"),
                inner = '<span class="tri-up"></span><span class="tri-down"></span>';
            div.innerHTML = inner;
            div.className = "white-tri";
            ths[value].appendChild(div);
        });
        //添加点击事件，对数据排序后重新渲染
        EventUtil.addHandler(self.ele.tHead, "click", function(event) {
            var event = EventUtil.getEvent(event),
                target = EventUtil.getTarget(event),
                className = target.className.toLowerCase();
            if (className == "tri-up") {
                //获取当前列在行中的下标
                var index = target.parentNode.parentNode.cellIndex;
                self.content.sort(function(r1, r2) {
                    return r1[index] - r2[index];
                });
                self.render();
            } else if (className == "tri-down") {
                var index = target.parentNode.parentNode.cellIndex;
                self.content.sort(function(r1, r2) {
                    return r2[index] - r1[index];
                });
                self.render();
            }
        });
    },

    /**
     * [forzenHead 可以冻结表格头部]
     */
    forzenHead: function() {
        var table = this.ele,
            head = table.tHead,
            top = table.offsetTop,
            totalHeight = top + table.clientHeight;
        EventUtil.addHandler(window, "scroll", function() {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (scrollTop <= top || scrollTop > totalHeight) {
                head.style.position = "static";
            } else if (scrollTop > top) {
                head.style.position = "fixed";
                head.style.top = "0";
            }
        });
    }
};