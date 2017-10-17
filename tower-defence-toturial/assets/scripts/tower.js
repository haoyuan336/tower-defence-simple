import global from './global'
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
        },
        towerType: ""
    },

    // use this for initialization
    onLoad: function () {
        this.levelCount = 0;
        this.currentDamage = 0;
        this.lookRange = 0;
        this.currentAttackRange = 0;
        this.shootBulletDt = 0;
        this.currentShootTime = 0;
        cc.loader.loadRes("./config/tower_config", (err, result)=>{
            if (err){
                cc.log("load config = " + err);
            }else {
                cc.log("load config = " + JSON.stringify(result));
                this.towerConfig = result[this.towerType];
                this.currentDamage = this.towerConfig.damages[this.levelCount];
                this.currentAttackRange = this.towerConfig.attack_ranges[this.levelCount];
                this.lookRange = this.towerConfig.look_range;
                this.shootBulletDt = this.towerConfig.shoot_dts[this.levelCount];
            }
        });
    },
    updateTower: function () {
        cc.log("update tower");
        if (this.levelCount < this.spriteFrames.length - 1){
            this.levelCount ++;
            this.spriteNode.spriteFrame = this.spriteFrames[this.levelCount];

            this.currentDamage = this.towerConfig.damages[this.levelCount];
            this.currentAttackRange = this.towerConfig.attack_ranges[this.levelCount];
            this.lookRange = this.towerConfig.look_range;
            this.shootBulletDt = this.towerConfig.shoot_dts[this.levelCount];

        }else {
            cc.log("满级");
        }


    },
    sellTower: function () {
        cc.log("sell tower");

        this.node.destroy();
    }
    ,
    isFree: function () {
        if (this.enemy === undefined){
             return true;
        }
        return false;
    },
    setEnemy: function (enemy) {

        let distance = cc.pDistance(enemy.position, this.node.position);
        if (distance < this.lookRange){
            this.enemy = enemy;
        }

    },
    update: function (dt) {
        if (this.enemy !== undefined){
            let direction = cc.pSub(this.node.position, this.enemy.position);
            let angle = cc.pAngleSigned(direction, cc.p(0,-1));
            // cc.log("angle = " + angle);
            this.node.rotation =(180 / Math.PI) * angle;
          
            if (this.currentShootTime > this.shootBulletDt){
              this.currentShootTime = 0;
              this.shootBullet();
            }else {
              this.currentShootTime += dt;
            }
          


            let distance = cc.pDistance(this.enemy.position, this.node.position);
            if (distance > this.currentAttackRange || this.enemy.getComponent("enemy").isLiving() === false){
                this.enemy = undefined;
            }
        }
    },
    shootBullet: function () {
        global.event.fire("shoot_bullet", this.node, this.enemy.position);
    },
    getDamage: function () {
        return this.currentDamage;
    }

});
