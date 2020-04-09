cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.direction = cc.v2(0, 0);
        this.speed = 600;
    },
    initWithData: function (tower, position, enemyNodeList) {
        this.direction = position.sub(tower.position).normalize();
        this.node.position = tower.position.add(this.direction.mul(100));


        let angle = cc.v2(this.direction.x, this.direction.y).signAngle(cc.v2(0, 1));
        this.node.angle = -(180 / Math.PI) * angle;
        this.enemyNodeList = enemyNodeList;
        this.damage = tower.getComponent("tower").getDamage();
    },

    update: function (dt) {
        // cc.log("direction " + JSON.stringify(this.direction));
        this.node.position = this.node.position.add(this.direction.mul(this.speed * dt));

        for (let i = 0; i < this.enemyNodeList.length; i++) {
            let enemy = this.enemyNodeList[i];
            if (enemy.getComponent("enemy").isLiving()) {
                let distance = enemy.position.add(this.node.position).mag();
                if (distance < (enemy.width * 0.5 + this.node.width * 0.5)) {
                    enemy.getComponent("enemy").beAttacked(this.damage);
                    this.node.destroy();
                    // cc.log("")
                }
            }
        }

        if (this.node.position.x < - 1920 * 0.5 || this.node.position.x > 1920 * 0.5
            || this.node.position.y > 1080 * 0.5 || this.node.position.y < - 1080 * 0.5) {
            this.node.destroy();
            cc.log("删掉子弹");
        }

    },
});
