(function() {

    var SPACESHIP_SPEED = 3; //飞行角速度
    var SPACESHIP_COUNT = 4; //飞船数量
    var DEFAULT_CHARGE_RATE = 1; //默认充电速度
    var DEFAULT_DISCHARGE_RATE = 0.5; //默认耗电速度
    var ORBIT_RADIUS = [100, 150, 200, 250]; //轨道半径，距行星中心点距离
    var COMMAND_SET = ["fly", "stop", "destory", "create"]; //指令集合
    var FAILED_RATE = 0.3; //丢包率


    /**
     * [Spaceship 飞船]
     * @param {[number]} id [飞船编号]
     */
    var Spaceship = function(id) {
        this.id = id;
        this.power = 100; //初始电量
        this.state = "stop"; //初始状态：停止
        this.mediator = null; //待注册的中介者
        this.orbit = id; //所在轨道
        this.deg = 0; //初始位置的角度
        this.timer = null; //不同函数中的timer计时
    };

    /**
     * [dynamicSystem 动力系统，控制飞船飞行与停止]
     */
    Spaceship.prototype.dynamicSystem = function() {
        var self = this;
        var self_ship = $("#ship" + self.id);

        var fly = function() {
            self.timer = setInterval(function() {
                self.deg += SPACESHIP_SPEED;
                if (self.deg == 360) self.deg = 0;

                //控制DOM中的飞船飞行
                //修改飞船位置
                self_ship.style.webkitTransform = "rotate(" + self.deg + "deg)";
                self_ship.style.mozTransform = "rotate(" + self.deg + "deg)";
                self_ship.style.msTransform = "rotate(" + self.deg + "deg)";
                self_ship.style.transform = "rotate(" + self.deg + "deg)";

            }, 200);
            ConsoleUtil.show("Spaceship NO." + self.id + ": is flying");
        };

        var stop = function() {
            clearInterval(self.timer);
            ConsoleUtil.show("Spaceship NO." + self.id + ": stoped");
        };

        return {
            fly: fly,
            stop: stop
        };
    };

    /**
     * [powerSystem 能源系统，飞船充放电]
     */
    Spaceship.prototype.powerSystem = function() {
        var self = this;
        var self_ship = $("#ship" + self.id);

        var charge = function() {
            var timer = setInterval(function() {
                //飞行或销毁状态不进行充电
                if (self.state == "fly" || self.state == "destory") {
                    clearInterval(timer);
                    return false;
                }
                if (self.power >= 100) {
                    self.power = 100;
                    self_ship.innerHTML = Math.ceil(self.power);
                    clearInterval(timer);
                    return false;
                }
                self.power += DEFAULT_CHARGE_RATE;
                self_ship.innerHTML = Math.ceil(self.power);
                return true;
            }, 200);
            ConsoleUtil.show("Spaceship NO." + self.id + ": is charging");
        };

        var discharge = function() {
            var timer = setInterval(function() {
                // 飞船停止或销毁时没有放电
                if (self.state == "stop" || self.state == "destory") {
                    clearInterval(timer);
                    return false;
                }
                if (self.power <= 0) {
                    clearInterval(timer);
                    self.controlCenter().changeState("stop"); //由控制中心修改状态
                    self.power = 0;
                    self_ship.innerHTML = Math.ceil(self.power);
                    return false;
                }
                self.power -= DEFAULT_DISCHARGE_RATE;
                self_ship.innerHTML = Math.ceil(self.power);
            }, 100);
            ConsoleUtil.show("Spaceship NO." + self.id + ": is discharging");
        };

        return {
            charge: charge,
            discharge: discharge
        };

    };

    // 状态模式的使用场景也特别明确，
    // 有如下两点：一个对象的行为取决于它的状态，并且它必须在运行时刻根据状态改变它的行为。
    // 一个操作中含有大量的分支语句，而且这些分支语句依赖于该对象的状态。状态通常为一个或多个枚举常量的表示
    /**
     * [controlCenter 控制中心，修改飞船状态，产生相应行为]
     */
    Spaceship.prototype.controlCenter = function() {
        var self = this;
        var states = {
            fly: function() {
                self.state = "fly";
                self.dynamicSystem().fly();
                self.powerSystem().discharge();
            },

            stop: function() {
                self.state = "stop";
                self.dynamicSystem().stop();
                self.powerSystem().charge();
            },

            destory: function() {
                self.state = "destory";
                self.mediator.remove(self);
                //从中介者中去除飞船
            }
        };

        var changeState = function(state) {
            //根据状态执行指令
            ConsoleUtil.show("Spaceship NO." + self.id + ": will " + state);
            states[state] && states[state]();
        };

        return {
            changeState: changeState
        };
    };

    /**
     * [signalProcess 信号处理模块，接收信号]
     */
    Spaceship.prototype.signalProcess = function() {
        var self = this;
        var receive = function(msg) {
            if (self.id == msg.id && self.state != msg.command) {
                self.controlCenter().changeState(msg.command);
            }
        };

        return {
            receive: receive
        };
    };


    /**
     * [Message 消息体]
     * @param {[number]} target  [飞船ID]
     * @param {[string]} command [命令]
     */
    var Message = function(target, command) {
        if (COMMAND_SET.indexOf(command) == -1)
            return alert("指令不正确");
        this.id = target;
        this.command = command;
    };

    Message.prototype.toString = function() {
        return " [" + this.id + " " + this.command + "] ";
    };

    /**
     * [Commander 指挥官]
     * @param {[string]} id [指挥官的ID]
     */
    var Commander = function(id) {
        this.id = id;
        this.cmdHistory = [];
        this.mediator = null; //指挥官注册的中介者
    };

    Commander.prototype.send = function(msg) {
        var self = this;
        self.mediator.send(msg); //通过中介者发送消息给飞船
        self.cmdHistory.push(msg);
    };

    /**
     * [Mediator 中介者]
     * 通过闭包将飞船和指挥官私有化，外界访问不到
     */
    var Mediator = function() {
        var spaceships = [];
        var commander = null;

        return {
            /**
             * [register 注册对象，指挥官通过中介者给飞船下达指令]
             * @param  {[type]} obj [飞船，指挥官]
             * @return {[boolean]}     [注册成功，返回true]
             */
            register: function(obj) {
                if (obj instanceof Spaceship) {
                    spaceships[obj.id] = obj;
                    obj.mediator = this;
                    ConsoleUtil.show("Spaceship NO." + obj.id + " registered");
                    return true;
                } else if (obj instanceof Commander) {
                    obj.mediator = this;
                    commander = obj;
                    ConsoleUtil.show("Commander " + obj.id + " registered");
                    return true;
                }

                ConsoleUtil.show("mediator register failed");
                return false;
            },

            /**
             * [create 生产新的飞船]
             * @param  {[type]} msg [由只指挥官发来的消息]
             * @return {[type]}     [成功创建返回true]
             */
            create: function(msg) {
                if (spaceships[msg.id] != undefined) {
                    ConsoleUtil.show("Spaceship NO." + msg.id + " already exists");
                    return false;
                }
                var ship = new Spaceship(msg.id);

                // DOM中创建飞船
                var div = document.createElement("DIV");
                div.innerHTML = ship.power;
                div.className = "ship";
                div.id = "ship" + ship.id;
                $("#universe").appendChild(div);

                this.register(ship);
                return true;
            },

            getSpaceships: function() {
                return spaceships;
            },

            /**
             * [send 发送消息给飞船]
             * @param  {[type]} msg [指挥官的消息]
             * @return {[boolean]}     [成功则返回true]
             */
            send: function(msg) {
                var self = this;
                setTimeout(function() {
                    // var success = Math.random() > FAILED_RATE ? true : false;
                    if (1) {
                        if (msg.command == "create") {
                            self.create(msg);
                            return true;
                        }

                        ConsoleUtil.show(msg.toString() + " send success!");
                        spaceships.map(function(ship) {
                            ship.signalProcess().receive(msg);
                        });
                        return true;
                    } else {
                        ConsoleUtil.show("command: " + msg.toString() + " send failed");
                        return false;
                    }
                }, 1000);

            },

            /**
             * [remove 销毁飞船]
             * @param  {[Spaceship]} obj [飞船对象]
             * @return {[boolean]}     [成功时返回true]
             */
            remove: function(obj) {
                if (obj instanceof Spaceship) {
                    delete spaceships[obj.id];
                    var ship = $("#ship" + obj.id);
                    ship.parentNode.removeChild(ship);
                    ConsoleUtil.show("Spaceship NO." + obj.id + "destoryed");
                    return true;
                }
                ConsoleUtil.show("remove failed");
                return false;
            }
        };
    };

    var ConsoleUtil = (function() {
        var index = 1;
        var show = function(msg) {
            var p = document.createElement('P');
            var text = document.createTextNode(index + ": " + msg);
            p.appendChild(text);
            $("#consolePanel").appendChild(p);
            index++;
        };

        return {
            show: show
        }
    })();

    /**
     * [buttonHandler 监听按钮事件]
     * @param  {[Commander]} commander [指挥官发送消息]
     */
    var buttonHandler = function(commander) {
        EventUtil.addHandler($("#commandPanel"), "click", function(e) {
            if (e.target && e.target.tagName == "BUTTON") {
                var id = e.target.parentNode.getAttribute("data-id");
                var command = e.target.getAttribute("data-type");
                if(command == "create") {
                    var btns = $$("li[data-id='" + id + "'] button");
                    var length = btns.length;
                    for(var i = 0; i < length; i++) {
                        btns[i].removeAttribute('disabled');
                    }
                }
                var msg = new Message(id, command);
                commander.send(msg);
            }
        });
    };

    EventUtil.addHandler($("#commandPanel"), "mouseover", function(e) {
        if (e.target && e.target.tagName == "BUTTON") {
            e.target.style.color = "#000";
        }
    });
    EventUtil.addHandler($("#commandPanel"), "mouseout", function(e) {
        if (e.target && e.target.tagName == "BUTTON") {
            e.target.style.color = "#ccc";
        }
    });
    window.onload = function() {
        var commander = new Commander("sungd");
        var mediator = new Mediator();
        mediator.register(commander);
        buttonHandler(commander);
    };

})();