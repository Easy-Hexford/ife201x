(function() {
    var data = {
        title : ["姓名", "语文", "数学", "英语", "总分"],
        content: [
            ["小明", 80, 90, 70, 240],
            ["小红", 90, 60, 90, 240],
            ["小亮", 60, 100, 70, 230],
        ]
    };

    var sortCol = [1,2,3,4];

    var table1 = new Table("table1", data);

    var table2 = new Table("table2", data, sortCol);

    var table3 = new Table("table3", data, sortCol);
    table3.forzenHead();

    var table4 = new Table("table4", data);

})();