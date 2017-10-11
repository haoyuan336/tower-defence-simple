cc.Class({
    extends: cc.Component,

    properties: {
        spriteFrames: {
            default: [],
            type: cc.SpriteFrame
        },
        spriteNode: {
            default: null,
            type: cc.Sprite
        }
    },

    // use this for initialization
    onLoad: function () {
        this.levelCount = 0;
    },
    updateTower: function () {
        cc.log("update tower");
        if (this.levelCount < this.spriteFrames.length - 1){
            this.levelCount ++;
            this.spriteNode.spriteFrame = this.spriteFrames[this.levelCount];
        }else {
            cc.log("满级");
        }


    },
    sellTower: function () {
        cc.log("sell tower");
        this.node.destroy();
    }

});
