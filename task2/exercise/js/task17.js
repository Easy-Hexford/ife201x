/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

/*封装addEventListener，防止兼容性问题*/
function addEventHandler(ele, event, handler) {
    if (ele.addEventListener) {
        ele.addEventListener(event, handler);
    } else if (ele.attachEvent) {
        ele.attachEvent(event, handler);
    }
}

function $(id) {
    return document.getElementById(id);
}

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart(type) {
    var content = "";
    for (var day in chartData) {
        content += "<div class='bar " + type + "'>";
        content += "<div class= 'histogram' title='" + day + " AQI: " + chartData[day] + " ' style='height:" + chartData[day] + "px; background-color:" + getRandomColor() + "'></div>";
        content += "</div>";
    }
    document.getElementsByClassName("aqi-chart-wrap")[0].innerHTML = content;
}

/*随机生成颜色*/
var getRandomColor = function() {

    return '#' +
        (function(color) {
            return (color += '0123456789abcdef' [Math.floor(Math.random() * 16)]) && (color.length == 6) ? color : arguments.callee(color);
        })('');
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(value) {
    // 确定是否选项发生了变化
    // 设置对应数据
    if (value === pageState["nowGraTime"]) {
        return;
    }
    initAqiChartData();
    // 调用图表渲染函数
}

function getRadioValue(name) {
    var radios = document.getElementsByName(name);
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化 
    // 设置对应数据
    var value = $("city-select").value;
    if (value === pageState["nowSelectCity"]) {
        return;
    }
    // 调用图表渲染函数
    initAqiChartData();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var radios = document.getElementsByName("gra-time");
    for (var i = 0; i < radios.length; i++) {
        (function(j) {
            addEventHandler(radios[j], "click", function() {
                graTimeChange(radios[j].value);
            });
        })(i);
    }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var options = "";
    for (var city in aqiSourceData) {
        options += "<option value=" + city + ">" + city + "</option>";
    }
    $("city-select").innerHTML = options;
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    addEventHandler($("city-select"), "change", citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    var city = $('city-select').value;
    var type = getRadioValue('gra-time');
    pageState["nowSelectCity"] = city;
    pageState["nowGraTime"] = type;
    chartData = {};
    switch (type) {
        case "day":
            chartData = aqiSourceData[city];
            break;
        case "week": //计算每周平均的空气指数，16年1月是周五
            /*weekday: 周几 week: 每周多少天*/
            var date, weekday, week = 0,
                weekIndex = 1,
                total = 0;
            for (var day in aqiSourceData[city]) {
                date = new Date(day);
                weekday = date.getDay();
                total += aqiSourceData[city][day];
                weekday++;
                week++;
                if (weekday == 7) {
                    chartData[weekIndex] = Math.round(total / week);
                    weekday = 0;
                    week = 0;
                    weekIndex++;
                    total = 0;
                }
            }
            chartData[weekIndex] = Math.round(total / week);
            break;
        case "month": //计算每月平均的空气指数
            var date, total = 0,
                days = 0,
                month, lastMonth = -1;
            for (var day in aqiSourceData[city]) {
                date = new Date(day);
                month = date.getMonth() + 1;
                if (month == lastMonth) {
                    days++;
                    total += aqiSourceData[city][day];
                } else {
                    if (lastMonth != -1)
                        chartData[lastMonth] = Math.round(total / days);
                    lastMonth = month;
                    days = 1;
                    total = aqiSourceData[city][day];
                }
            }
            chartData[month] = Math.round(total / days);
            break;
    }
    renderChart(type);
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm()
    initCitySelector();
    initAqiChartData();
}

init();