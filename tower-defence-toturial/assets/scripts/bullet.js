cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.direction = cc.p(0,0);
        this.speed = 600;
    },
    initWithData: function (tower, position, enemyNodeList) {
        this.direction = cc.pNormalize(cc.pSub(position, tower.position));
        this.node.position = cc.pAdd(tower.position, cc.pMult(this.direction, 100));


        let angle = cc.pAngleSigned(this.direction, cc.p(0, 1));
        this.node.rotation = (180 / Math.PI) * angle;
        this.enemyNodeList = enemyNodeList;
    },

    update: function (dt) {
        // cc.log("direction " + JSON.stringify(this.direction));




        this.node.position = cc.pAdd(this.node.position , cc.pMult(this.direction , this.speed * dt));

        for (let i = 0 ; i < this.enemyNodeList.length ; i ++){
            let enemy = this.enemyNodeList[i];
            let distance = cc.pDistance(enemy.position, this.node.position);
            if (distance < (enemy.width * 0.5  + this.node.width * 0.5)){
                this.node.destroy();
            }
        }

        if (this.node.position.x < - 1920 * 0.5 || this.node.position.x > 1920 * 0.5
        || this.node.position.y > 1080 * 0.5 || this.node.position.y < - 1080 * 0.5){
            this.node.destroy();
            cc.log("删掉子弹");
        }

    },
});
