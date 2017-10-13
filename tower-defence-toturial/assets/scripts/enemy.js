cc.Class({
    extends: cc.Component,

    properties: {
        spriteFrames: {
            default: [],
            type: cc.SpriteFrame
        }
    },

    // use this for initialization
    onLoad: function () {
        
    },
    initWithData: function (type, pathPoints) {
        //0 - 6
        this.node.getComponent(cc.Sprite).spriteFrame = this.spriteFrames[type];
        this.pathPoints = pathPoints;
    },
    update: function (dt) {

    }

});
