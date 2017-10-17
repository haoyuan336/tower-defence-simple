import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
        timeCountDownLabel: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {
        this.nowTime = 4;
    }
    ,
    update: function (dt) {
        if (this.nowTime > 0){
            this.nowTime -= dt;
            // cc.log("now time = " +( this.nowTime - Math.floor(this.nowTime)));

            if ((this.nowTime - Math.floor(this.nowTime) )< 0.1){
                this.timeCountDownLabel.string = (Math.floor(this.nowTime) - 1);
                if (Math.floor(this.nowTime) === 0){
                    cc.log("游戏开始");
                    this.timeCountDownLabel.string = "";
                    this.nowTime = 0;
                    global.event.fire("game_start");
                }
            }
        }
    }
});
