window.onload = function() {

    var tree = new binaryTree();
    var operator = $(".operator"),
        root = $(".root"),
        speed = $("#speed");

    //添加事件委托
    addHandler(operator, "click", function(e) {
        var btn = e.target;
        if (btn && btn.nodeName === "BUTTON") {
            tree[btn.id](root);
            tree.animation(speed.value);
        }
    });
};

//构造二叉树
function binaryTree() {
    this.nodes = [];
}

/**
 * [preOrder 前序遍历]
 * @param  {[element]} node [节点]
 */
binaryTree.prototype.preOrder = function(node) {
    if (node != null) {
        this.nodes.push(node);
        if (node.firstElementChild) {
            this.preOrder(node.firstElementChild);
        }
        if (node.lastElementChild) {
            this.preOrder(node.lastElementChild);
        }
    }
};

/**
 * [inOrder 中序遍历]
 * @param  {[element]} node [节点]
 */
binaryTree.prototype.inOrder = function(node) {
    if (node != null) {
        if (node.firstElementChild) {
            this.inOrder(node.firstElementChild);
        }
        this.nodes.push(node);
        if (node.lastElementChild) {
            this.inOrder(node.lastElementChild);
        };
    }
};

/**
 * [postOrder 后序遍历]
 * @param  {[element]} node [节点]
 */
binaryTree.prototype.postOrder = function(node) {
    if (node != null) {
        if (node.firstElementChild) {
            this.postOrder(node.firstElementChild);
        }
        if (node.lastElementChild) {
            this.postOrder(node.lastElementChild);
        }
        this.nodes.push(node);
    }
};

/**
 * [animation 染色]
 * @param  {[number]} speed [速度]
 */
binaryTree.prototype.animation = function(speed) {
    var interval = speed || 200;
    var nodes = this.nodes,
        color = "#ccc",
        colorOri = "#fff",
        timer, iter = 0;
    this.nodes = []; //清空原先的记录
    if (nodes.length > 0) {
        nodes[iter].style.backgroundColor = color;
        timer = setInterval(function() {
            if (iter === (nodes.length - 1)) {
                nodes[iter].style.backgroundColor = colorOri;
                clearInterval(timer);
            } else {
                iter++;
                nodes[iter - 1].style.backgroundColor = colorOri;
                nodes[iter].style.backgroundColor = color;
            }
        }, interval);
    }
};