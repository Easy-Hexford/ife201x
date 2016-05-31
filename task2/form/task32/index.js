/**
 * Created by tzr4032369 on 2016/4/17.
 */

//添加事件兼容浏览器差异
function addEvent(elem, type, func) {
    if (elem.addEventListener) {
        elem.addEventListener(type, func);
    } else if (elem.attachEvent) {
        elem.attachEvent("on" + type, func);
    } else {
        elem["on" + type] = func;
    }
}

/**********定义全局变量和函数 **********/

//getElementById简写
function $(id){
    return document.getElementById(id);
}

//生成表单div
var div = document.createElement('div');
div.className = 'form';
loadStyle(".form{margin: 50px auto;width: 600px;}");  //为表单动态生成样式

//将英文label转化为中文
var labelObj={
    "name":"名称",
    "password":"密码",
    "passwordAgain":"确认密码",
    "email":"电子邮箱",
    "phone":"手机号码",
    //添加更多的input选项
    //"photo":"个人头像"
}

//获取文本字符长度
function getLength(text) {
    var len = 0;
    for (var i = 0; i < text.length; i++) {
        var charCode = text.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
            len += 1;
        } else {
            len += 2;
        }
    }
    return len;
}

//内嵌动态加载css
function loadStyle(css){
    var style = document.createElement('style');
    style.type = "text/css";
    try{
        style.appendChild(document.createTextNode(css));
    }catch(ex){
        style.styleSheet.cssText = css;
    }
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
}

//外联动态加载css
function loadStyles(url){
    var link = document.createElement('link');
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(link);
}

//表单格式检验
function check(input,rules,success){
    var text = input.value;
    switch(input.id){
        case 'name':
            var length = getLength(text);
            if((length>=0 && length<4) ||length>16){
                input.nextSibling.innerHTML = rules;
                input.nextSibling.style.color ='red';
            }else {
                input.nextSibling.innerHTML = success;
                input.nextSibling.style.color ='green';
            }
            break;
        case 'password':
            var length = getLength(text);
            if(/[^0-9a-z]/gi.test(text)){
                input.nextSibling.innerHTML = rules;
                input.nextSibling.style.color ='red';
            }else if((length>=0 && length<6) ||length>16){
                input.nextSibling.innerHTML = rules;
                input.nextSibling.style.color ='red';
            }else {
                input.nextSibling.innerHTML = success;
                input.nextSibling.style.color ='green';
            }
            break;
        case 'passwordAgain':
            var psw = document.getElementById('password').value;
            if(text == psw){
                input.nextSibling.innerHTML = success;
                input.nextSibling.style.color ='green';
            }else{
                input.nextSibling.innerHTML = rules;
                input.nextSibling.style.color ='red';
            }
            break;
        case 'email':
            var reg = new RegExp('^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$', 'i');
            if(text.match(reg)){
                input.nextSibling.innerHTML =success;
                input.nextSibling.style.color ='green';
            }else{
                input.nextSibling.innerHTML = rules;
                input.nextSibling.style.color ='red';
            }
            break;
        case 'phone':
            if (text.match(/^1\d{10}$/)){
                input.nextSibling.innerHTML = success;
                input.nextSibling.style.color ='green';
            }else{
                input.nextSibling.innerHTML = rules;
                input.nextSibling.style.color ='red';
            }
            break;
        //添加更多的检验项
        //case 'photo':
        //    if (满足格式){
        //        input.nextSibling.innerHTML = success;
        //        input.nextSibling.style.color ='green';
        //    }else{
        //        input.nextSibling.innerHTML = rules;
        //        input.nextSibling.style.color ='red';
        //    }
        //    break;
        default :

    }
}


//表单工厂
function FormList(name,type,rules,success){
    this.label=name;
    this.type=type;
    this.rules=rules;
    this.success=success;
    //生成表单
    this.produce = function(){
        //创建label
        var label = document.createElement('label');
        label.className = 'label';
        label.innerHTML = labelObj[this.label];
        div.appendChild(label);

        //创建input框
        var input = document.createElement('input');
        input.className = 'input';
        input.type = this.type;
        input.id= this.label;
        var inputRules = this.rules;
        var inputSuccess = this.success;

        //为input框添加事件
        input.onblur = function(){
            check(this,inputRules,inputSuccess);
        }
        input.onfocus = function(){
            this.nextSibling.style.visibility = 'visible';
            this.nextSibling.style.color = 'gray';
            this.nextSibling.innerHTML = inputRules;
        }
        div.appendChild(input);

        //创建检验结果提示框
        var span = document.createElement('span');
        span.className = 'span';
        span.style = "visibility: hidden";
        span.innerHTML = inputRules;
        div.appendChild(span);
    }
};

//生成表单
function produceForm(inputs,style){
    if(style == 1){
        loadStyles('css/style1.css');
    }else if(style == 2){
        loadStyles('css/style2.css');
    }
    //为表单添加更多的样式
    //else if(style == 3 4 5 6......){
    //    loadStyles('css/style3 4 5 6.css');
    //}
    for(var i in inputs){
        switch (inputs[i]){
            case 'name':
                var nameInput=new FormList("name","text","长度须在4-16个字符","名称可用");
                nameInput.produce();
                break;
            case 'psw':
                var passwordInput=new FormList("password","password","长度须在6-16个字符","密码可用");
                passwordInput.produce();
                break;
            case 'psw_again':
                var againInput=new FormList("passwordAgain","password","重复输入密码,俩次密码需相同","密码正确");
                againInput.produce();
                break;
            case  'email':
                var emailInput=new FormList("email","text","必填，请输入正确的邮箱地址","邮箱格式正确");
                emailInput.produce();
                break;
            case 'phone':
                var phoneInput=new FormList("phone","text","必填，请输入正确的手机号码","手机号码格式正确");
                phoneInput.produce();
                break;
            //添加更多input选项
            //case 'photo':
            //    var photoInput=new FormList("photo","file","请选择你的个人头像","头像已添加");
            //    photoInput.produce();
            //    break;
            default :
        }
    }

    //表单提交按钮
    var button = document.createElement('button');
    button.type = 'submit';
    button.className = 'button';
    button.innerHTML = '提交';
    button.id = 'submitBtn';
    button.onclick = function(){
        var form = $('yourForm');
        var inputs = form.getElementsByTagName('input');
        for(var i=0;i<inputs.length;i++){
            if(inputs[i].nextSibling.style.color != 'green'){
                alert('输入有误！')
                return;
            }
        }
        alert('表单已提交！');
    }
    div.appendChild(button);
    var yourForm = $('yourForm');
    yourForm.appendChild(div);   //将表单div添加到html中
}

//获取用户选择，生成自定义表单
window.onload = function(){
    //获取全局变量
    var initForm = $('initForm');
    addEvent(initForm,'click',function(){
        //存放自定义选项
        var optsArr = [];
        //存放自定义样式选项
        var optStyle;
        //获取所有自定义选项
        var inputsOpts = document.getElementsByName('selectInputs');
        //获取自定义样式选项
        var styleOpts = document.getElementsByName('selectStyle');
        for(var i in inputsOpts){
            if(inputsOpts[i].checked){
                optsArr.push(inputsOpts[i].id);
            }
        }
        for(var i in styleOpts){
            if(styleOpts[i].checked){
                optStyle = styleOpts[i].value;
            }
        }
        produceForm(optsArr,optStyle);   //根据用户自定义生成表单
    })
}
