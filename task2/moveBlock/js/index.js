window.onload = function() {
    var ROWS = 11; //棋盘行数
    var COLUMNS = 11; //棋盘列数
    var BLOCK_WIDTH = 50; //棋盘每个格子的宽度
    var BLOCK_HEIGHT = 50; //棋盘每个格子的高度
    //指令集合
    var CMDTABLE = ["go", "tun lef", "tun rig", "tun bac", "tra top", "tra lef", "tra rig", "tra bot", "mov lef", "mov rig", "mov bot", "mov top"];

    var checkerboard = $(".checkerboard"),
        orderPanel = $(".orderPanel"),
        order_input = $("#order-input"),
        order_row = $("#order-row"),
        conduct = $("#conduct"),    //执行按钮
        reset = $("#reset"),    //清空按钮
        cmdList = [];

    /**
     * [createBoard 创建棋盘]
     * @param  {[number]} rows [行数]
     * @param  {[number]} cols [列数]
     */
    function createBoard(rows, cols) {
        checkerboard.style.width = ROWS * BLOCK_WIDTH + "px";
        checkerboard.style.height = COLUMNS * BLOCK_HEIGHT + "px";
        var framgent = document.createDocumentFragment();
        for (var i = 0; i < rows; i++) {
            var tr = document.createElement("TR");
            for (var j = 0; j < cols; j++) {
                var td = document.createElement("TD");
                if (i == 0) td.innerHTML = j;
                if (j == 0) td.innerHTML = i;
                tr.appendChild(td);
            }
            framgent.appendChild(tr);
        }
        framgent.firstChild.firstChild.innerHTML = "";
        checkerboard.appendChild(framgent);
    }

    /**
     * [Node 移动节点]
     * @param {[number]} row [横坐标]
     * @param {[nubmer]} col [纵坐标]
     */
    var Node = function(row, col) {
        this.row = row;
        this.col = col;
        this.head = 0; //活动块的朝向 0:top, 1: right, 2: bottom, -1:left
        this.deg = 0;
        this.dom = null;
    };

    /**
     * [createDom 构造移动点DOM]
     * @param  {[dom]} obj [父节点元素]
     */
    Node.prototype.createDom = function(obj) {
        var div = document.createElement("DIV");
        var img = document.createElement("IMG");
        img.src = "image/bot.png";
        div.appendChild(img);
        div.className = "moveNode";
        div.style.left = this.col * 50 + "px";
        div.style.top = this.row * 50 + "px";
        obj.appendChild(div);
        this.dom = div;
    };

    /**
     * [go 行走一步]
     * 默认 沿着头的方向走一步
     * 若传入方向，则朝该方向行走一步
     */
    Node.prototype.tra = function(direction, step) {
        var step = step || 1;
        switch (direction) {
            case 0:
                if ((this.row - 1) > step) this.row -= parseInt(step);
                else this.row = 1;
                break;
            case 1:
                if ((COLUMNS - this.col - 1) > step) this.col += parseInt(step);
                else this.col = COLUMNS - 1;
                break;
            case 2:
                if ((ROWS - this.row - 1) > step) this.row += parseInt(step);
                else this.row = ROWS - 1;
                break;
            case -1:
                if ((this.col - 1) > step) this.col -= parseInt(step);
                else this.col = 1;
                break;
        }
        this.render();
    };

    Node.prototype.go = function(step) {
        this.tra(this.head, step);
    };


    Node.prototype.render = function() {
            this.dom.style.left = this.col * 50 + "px";
            this.dom.style.top = this.row * 50 + "px";
        }
        /**
         * [turn 转向]
         * @param  {[type]} direction [旋转方向] 0:top, 1: right, -1:left, 2:down
         * @param  {[type]} type  存在时，表明转至屏幕最终方向，否则实现向左、右、后转
         */
    Node.prototype.turn = function(direction, type) {
        if (type == undefined) {
            this.deg += direction * 90;
            this.dom.style.transform = "rotate(" + this.deg + "deg)";

            if (this.deg >= 360) this.deg -= 360;
            if (this.deg <= -360) this.deg += 360;
            //调整head位置
            this.head = (this.deg / 90) % 4;
            if ((this.head % 2) != 0) this.head %= 2;
        } else {
            this.deg = direction * 90;
            this.head = direction;
            this.dom.style.transform = "rotate(" + this.deg + "deg)";
        }
    };

    Node.prototype.conduct = function() {
        var self = this;
        return {
            "go": function(step) {
                self.go(step);
            },
            "tun lef": function() {
                self.turn(-1);
            },
            "tun rig": function() {
                self.turn(1);
            },
            "tun bac": function() {
                self.turn(2);
            },
            "tra lef": function(step) {
                self.tra(-1, step);
            },
            "tra rig": function(step) {
                self.tra(1, step);
            },
            "tra top": function(step) {
                self.tra(0, step);
            },
            "tra bot": function(step) {
                self.tra(2, step);
            },
            "mov lef": function(step) {
                self.turn(-1, true);
                self.go(step);
            },
            "mov rig": function(step) {
                self.turn(1, true);
                self.go(step);
            },
            "mov top": function(step) {
                self.turn(0, true);
                self.go(step);
            },
            "mov bot": function(step) {
                self.turn(2, true);
                self.go(step);
            }
        };
    };

    //添加监听事件
    var addEvent = function() {
        //点击按钮执行指令
        addHandler(orderPanel, "click", function(e) {
            if (e.target && e.target.className == "order") {
                node.conduct()[e.target.value]();
            }
        });
        //行数随输入改变
        addHandler(order_input, "keyup", function() {
            rowChange();
        });
        //输入框和行数滚动同步
        addHandler(order_input, "scroll", function() {
            order_row.scrollTop = order_input.scrollTop;
        });
        //清空输入指令
        addHandler(reset, "click", function() {
            order_input.value = "";
            order_row.innerHTML = "";
        });

        //顺序执行每条指令
        addHandler(conduct, "click", function() {
            var cmdList = cmdCheck();
            for (var i = 0; i < cmdList.length; i++) {
                (function(i) {
                    setTimeout(function() {
                        var arr = cmdList[i].split(" ");
                        var step = arr[arr.length - 1];
                        arr.pop();
                        var cmd = arr.join(" ");
                        node.conduct()[cmd](step);
                    }, 500 * i);
                })(i);
            }
        });
    };

    /**
     * [cmdCheck 解析指令]
     * @return {[type]} [返回要执行的指令列表]
     */
    function cmdCheck() {
        cmdList = [], errLine = [];
        var cmds = order_input.value.split("\n");
        var cmd, step, arr = [],
            flag = true;
        for (var i = 0; i < cmds.length; i++) {
            arr = cmds[i].split(" ").map(function(v) {
                return v.toLowerCase();
            });
            if (!isNaN(arr[arr.length - 1])) {
                step = arr[arr.length - 1];
                arr.pop();
                cmd = arr.join(" ");
            } else {
                step = 1;
                cmd = arr.join(" ");
            }
            if (CMDTABLE.indexOf(cmd) != -1) {
                if (flag) {
                    cmdList.push(cmd + " " + step);
                }
            } else {
                flag = false;
                errLine.push(i);
            }
        }
        var list = order_row.childNodes;
        for (var j = 0; j < errLine.length; j++) {
            list[errLine[j]].style.backgroundColor = "yellow";
        }
        return cmdList;
    }

    function rowChange() {
        var text = order_input.value;
        var rows = text.split("\n").length;
        var arr = [];
        for (var i = 1; i <= rows; i++) {
            arr.push("<li>" + i + "</li>");
        }
        order_row.innerHTML = arr.join("");
    };

    createBoard(ROWS, COLUMNS);
    var node = new Node(5, 5); //活动节点
    node.createDom(checkerboard);
    addEvent();

};