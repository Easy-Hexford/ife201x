var tree = $(".tree"),
    menu = $(".menu"),
    search_text = $("#search_text"),
    search_btn = $("#search_btn");

//搜索节点
addHandler(search_btn, "click", function() {
    var text = checkInput(search_text);
    if (text == "") return alert("查询内容不能为空");
    var stack = search(tree, text);
    for (var i = 0; i < stack.length; i++) {
        var parent = stack[i].parentNode;
        //搜索结果展开其所有的父节点
        while (!parent.classList.contains("root")) {
            parent.classList.remove("hidden");
            parent = parent.parentNode;
        }
    }
});

//右键鼠标，弹出菜单
addHandler(tree, "contextmenu", function(e) {
    e.preventDefault();
    var node = e.target.parentNode;
    if (node && node.tagName == "P") {
        menu.classList.remove("hidden");
        node.appendChild(menu);
    }

});

/**
 * [树的点击事件，节点的展开与收缩]
 */
addHandler(tree, "click", function(e) {
    menu.classList.add("hidden");
    var node = e.target.parentNode;
    if (node && node.tagName == "P") {
        var ul = node.parentNode.getElementsByTagName("UL")[0];
        if (ul) {
            ul.classList.toggle("hidden");
            var arrow = node.getElementsByClassName("iconfont")[0];
            //更改标题前的箭头指向
            if (ul.classList.contains("hidden")) {
                arrow.classList.remove("icon-arrowdown");
                arrow.classList.add("icon-arrowright");
            } else {
                arrow.classList.remove("icon-arrowright");
                arrow.classList.add("icon-arrowdown");
            }
        }
    }
});

/**
 * [添加菜单事件] 
 * @param [add] [添加子节点]
 * @param [delete] [删除子节点]
 * @param [rename] [重命名]
 */
addHandler(menu, "click", function(e) {
    if (e.target && e.target.tagName == "SPAN") {
        var p = e.target.parentNode.parentNode;
        switch (e.target.id) {
            case "add":
                //对于原先的叶子节点，需要添加指示箭头
                var iconClass = p.getElementsByTagName("I")[0].classList;
                if (!iconClass.contains("icon-arrowdown") && !iconClass.contains("icon-arrowright")) {
                    var i = document.createElement("I");
                    i.className = "iconfont icon-arrowdown";
                    var title = p.getElementsByClassName("title")[0];
                    p.insertBefore(i, title);
                }
                var name = prompt("请输入要添加的节点名");
                var li = document.createElement("LI"),
                    ul = p.parentNode.getElementsByTagName("UL")[0];
                li.innerHTML = "<p><span class='title'>" + name + "</span></p>";
                if (ul) {
                    ul.appendChild(li);
                } else {
                    var newUl = document.createElement("UL");
                    newUl.appendChild(li);
                    p.parentNode.appendChild(newUl);
                }
                break;
            case "delete":
                p.parentNode.parentNode.removeChild(p.parentNode);
                break;
            case "rename":
                var newName = prompt("请输入新的名字");
                p.getElementsByClassName("title")[0].textContent = newName;
                break;
        }
        menu.classList.add("hidden");
    }
});

//这里取巧了，因为标题都在class为title的span中，没有使用广度或深度的遍历算法
function search(root, text) {
    var nodes = root.getElementsByClassName("title");
    var stack = [];
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].textContent.indexOf(text) != -1) {
            stack.push(nodes[i]);
        }
    }
    return stack;
}

function checkInput(ele) {
    return ele.value.trim();
}