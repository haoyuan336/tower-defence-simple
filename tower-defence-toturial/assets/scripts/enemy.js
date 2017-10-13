const EnemyState = {
    Invalid: -1,
    Running: 1,
    EndPath: 2,
    Dead: 3
};
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
        this.state = EnemyState.Invalid;
        this.node.opacity = 0;
        this.direction = cc.p(0, 0);
        this.currentPathPointCount = 0;
    }
    ,
    initWithData: function (type, pathPoints) {
        //0 - 6
        this.node.getComponent(cc.Sprite).spriteFrame = this.spriteFrames[type];
        this.pathPoints = pathPoints;
        this.node.position = pathPoints[0].position;
        cc.loader.loadRes("./config/monster_config", (err, result)=>{
            if (err){
                cc.log(err);
            }else {
                // cc.log("enemy result = " + JSON.stringify(result));
                let config = result["enemy_" + type];
                this.speed = config.speed;
                this.health = config.health;
                this.setState(EnemyState.Running);
            }
        });

    },
    update: function (dt) {
        if (this.state === EnemyState.Running){
            let distance = cc.pDistance(this.node.position, this.pathPoints[this.currentPathPointCount].position);
            if (distance < 10){
                this.currentPathPointCount ++;
                if (this.currentPathPointCount === this.pathPoints.length){
                    this.setState(EnemyState.EndPath);
                    return
                }
                this.direction = cc.pNormalize(cc.pSub(this.pathPoints[this.currentPathPointCount].position, this.node.position));
            }else {
                this.node.position = cc.pAdd(this.node.position, cc.pMult(this.direction, this.speed * dt));
            }
        }
    },
    setState: function (state) {
        if (this.state === state){
            return ;
        }
        switch (state){
            case EnemyState.Running:
                this.node.opacity = 255;
                break;
            case EnemyState.Dead:
                break;
            case EnemyState.EndPath:
                break;
            default:
                break;
        }
        this.state = state;
    },
    isLiving: function () {
        if (this.state === EnemyState.Running){
            return true;
        }
        return false;
    }


});
