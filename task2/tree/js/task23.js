var interval = 300; //遍历的时间间隔
lock = false; //判断是否正在染色过程中

window.onload = function() {
    var root = $(".root"),
        search = $("#search"),
        add = $("#add"),
        operator = $(".operator"),
        tree = new Tree(root);

    //点击一次变色提示，二次取消提示
    addHandler(root, "click", function(e) {
        var div = e.target;
        if (div && div.nodeName == "DIV") {
            var oriClass = div.className;
            if (oriClass.search("active") == -1) {
                div.style.backgroundColor = "#FEF9D1";
                div.className = "active " + oriClass;
            } else {
                div.style.backgroundColor = "#fff";
                div.className = oriClass.replace("active ", "");
            }
        }
    });

    //添加事件委托
    addHandler(operator, "click", function(e) {
        var btn = e.target;
        if (btn && btn.nodeName === "BUTTON") {
            if (lock) {
                alert("正在遍历中");
                return;
            }
            clearColor(tree); //清除已有的颜色
            switch (btn.id) {
                case "traverseDF":
                case "traverseBF":
                    tree[btn.id]();
                    animation(tree.stack);
                    break;
                case "DFSearch":
                case "BFSearch":
                    tree["traverse" + btn.id.substring(0, 2)]();
                    animation(tree.stack, checkInput(search));
                    break;
                case "addNode":
                    var text = checkInput(add);
                    if (text == "") alert("节点内容不能为空");
                    addSubNode("active", text);
                    break;
                case "delNode":
                    if (delNode("active")) alert("删除成功");
                    break;
            }
        }
    });
};

function checkInput(ele) {
    return ele.value.trim();
}

function delNode(className) {
    var nodes = document.getElementsByClassName(className);
    if (nodes.length == 0) return false;
    var length = nodes.length;
    //删除节点的时候nodes数组本身会改变，还不知道改变的原因         ???
    for (var i = 0; i < length; i++) {
        nodes[0].parentNode.removeChild(nodes[0]);
    }
    return true;
}

//添加子结点
function addSubNode(className, text) {
    var parents = document.getElementsByClassName(className);
    for (var i = 0; i < parents.length; i++) {
        add(parents[i], text);
        //添加子节点后，由于清楚颜色，原先被选中的父元素颜色会变成#fff,这里将其改回
        parents[i].style.backgroundColor = "#FEF9D1";
    }

    function add(parent, text) {
        var node = document.createElement("Div");
        node.innerHTML = text;
        parent.appendChild(node);

    }
}


/**
 * [clearColor 清除已有颜色]
 * @param  {[type]} tree [对象树]
 */
function clearColor(tree) {
    tree.traverseDF();
    tree.stack.forEach(function(ele) {
        ele.style.backgroundColor = "#fff";
    });
}

/**
 * [animation 染色]
 * @param  {array} nodes [对象列表]
 * @param {boolean} stop [是否在结尾停止，针对查找操作]
 */
function animation(nodes, keyword) {
    lock = true;
    var keyword = keyword || null;
    (function show() {
        var next = nodes.shift();
        if (next) {
            next.style.backgroundColor = "#ccc";
            setTimeout(function() {
                if (!(next.firstChild.nodeValue.trim() == keyword)) {
                    next.style.backgroundColor = "#fff";
                }
                show();
            }, interval);
        } else {
            lock = false;
        }
    })();
};

/**
 * [Tree 定义树]
 * @param [root] [根节点]
 * @param [stack] [遍历的节点集合]
 */
function Tree(node) {
    this.stack = [];
    this.root = node;
}

/**
 * [traverseDF 深度优先遍历]
 * @param  {Function} callback [对节点的操作，回调函数]
 */
Tree.prototype.traverseDF = function(callback) {
    var stack = [];
    (function recurse(currentNode) {
        stack.push(currentNode);
        for (var i = 0; i < currentNode.children.length; i++) {
            recurse(currentNode.children[i]);
        }
        callback ? callback(currentNode) : null;
    })(this.root);
    this.stack = stack;
};

/**
 * [traverseBF 广度优先遍历]
 * @param  {Function} callback [对节点的操作，回调函数]
 */
Tree.prototype.traverseBF = function(callback) {
    var queue = [],
        currentNode = this.root;
    this.stack = [];
    this.stack.push(currentNode);
    while (currentNode) {
        var length = currentNode.children.length;
        for (var i = 0; i < length; i++) {
            queue.push(currentNode.children[i]);
        }
        callback ? callback(currentNode) : null;
        currentNode = queue.shift();
        this.stack.push(currentNode);
    }
};

/**
 * [contains 检测是否包含节点]
 * @param  {Function} callback  [回调函数]
 * @param  {[type]}   traversal [遍历函数]
 */
// Tree.prototype.contains = function(traversal, callback) {
//     traversal.call(this, callback);
// };