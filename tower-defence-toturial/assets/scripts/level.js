import global from './global'
const TowerPosNodeState = {
    Invalid: -1,
    Null: 1,
    BuildMenu: 2,
    Tower: 3,
    UpdateMenu: 4
};
cc.Class({
    extends: cc.Component,
    properties: {
        enemyPathNodes: {
            default: [],
            type: cc.Node
        },
        towerPosNodes: {
            default: [],
            type: cc.Node
        },
        buildMenuPrefab: {
            default: null,
            type: cc.Prefab
        },
        towerPrefabs: {
            default: [],
            type: cc.Prefab
        },
        updateMenuPrefab: {
            default: null,
            type: cc.Prefab
        },
        enemyPrefab: {
            default: null,
            type: cc.Prefab
        },
        bulletPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function () {
        for (let i = 0 ; i < this.towerPosNodes.length; i ++){
            let node = this.towerPosNodes[i];
            this.setState(node, TowerPosNodeState.Null);
            this.setTouchEvent(node);
        };
        global.event.on("build_tower", this.buildTower.bind(this));
        global.event.on("update_tower", this.updateTower.bind(this));
        global.event.on("sell_tower",this.sellTower.bind(this));
        global.event.on("game_start", this.gameStart.bind(this));
        global.event.on("shoot_bullet", this.addBullet.bind(this));
        this.currentWaveCount = 0;
        this.currentEnemyCount = 0;
        this.addEnemyCurrentTime = 0;
        this.addWaveCurrentTime = 0;
        this.enemyNodeList = [];
        this.bulletNodeList = [];
    },
    setTouchEvent: function (node) {
        node.on(cc.Node.EventType.TOUCH_START, (event)=>{
            cc.log("touch node name = " + event.target.name);
            if (node.state === TowerPosNodeState.Null){
                this.showBuildMenu(event.target);
            }else if (node.state === TowerPosNodeState.Tower){
                this.showUpdateMenu(event.target);
            }
        });
    },
    showBuildMenu: function (node) {
        this.closeMenu();
        let menu = cc.instantiate(this.buildMenuPrefab);
        menu.parent = this.node;
        menu.position = node.position;
        this.setState(node, TowerPosNodeState.BuildMenu);
        node.menu = menu;
    },
    showUpdateMenu: function (node) {
        this.closeMenu();
        let menu = cc.instantiate(this.updateMenuPrefab);
        menu.parent = this.node;
        menu.position = node.position;
        this.setState(node, TowerPosNodeState.UpdateMenu);
        node.menu = menu;
    },
    closeMenu: function () {
        for (let i = 0 ; i < this.towerPosNodes.length ; i ++){
            let node = this.towerPosNodes[i];
            if (node.state === TowerPosNodeState.BuildMenu){
                node.menu.destroy();
                this.setState(node, TowerPosNodeState.Null);
                return node;
            }
            if (node.state === TowerPosNodeState.UpdateMenu){
                node.menu.destroy();
                this.setState(node, TowerPosNodeState.Tower);
                return node;
            }
        }

    }
    ,
    setState: function (node, state) {
        if (node.state === state){
            return;
        }
        switch (state){
            case TowerPosNodeState.Null:
                break;
            case TowerPosNodeState.BuildMenu:
                break;
            default:
                break;
        }
        node.state = state;
    },
    buildTower: function (data) {
        cc.log("build tower " + data);
        let node = this.closeMenu();
        let tower = cc.instantiate(this.towerPrefabs[data]);
        tower.parent = this.node;
        tower.position = node.position;
        this.setState(node, TowerPosNodeState.Tower);
        node.tower = tower;
    },
    onDestroy: function () {
        global.event.off("build_tower", this.buildTower);
    },
    updateTower: function () {
        let node = this.closeMenu();
        node.tower.getComponent("tower").updateTower();
    },
    sellTower: function () {
        let node = this.closeMenu();
        this.setState(node, TowerPosNodeState.Null);
        node.tower.getComponent("tower").sellTower();
    },
    gameStart: function () {
        cc.loader.loadRes("./config/level_config",  (err, result)=> {
            if (err){
                cc.log("load config " + err);
            }else {
                cc.log("level config" + JSON.stringify(result));
            }
            let config = result["level_1"];
            this.levelConfig = config;
            // this.currentWaveConfig = wavesConfig[0];
        });
    },
    addEnemy: function (type) {
        // cc.log("add Enemy" + this.currentEnemyCount);
        // cc.log("add Wave " + this.currentWaveCount)
        let enemy = cc.instantiate(this.enemyPrefab);
        enemy.getComponent("enemy").initWithData(type, this.enemyPathNodes);
        enemy.parent = this.node;
        this.enemyNodeList.push(enemy);
    },
    update: function (dt) {
        if (this.currentWaveConfig){
            if (this.addEnemyCurrentTime > this.currentWaveConfig.dt){
                this.addEnemyCurrentTime = 0;
                this.currentEnemyCount ++;
                this.addEnemy(this.currentWaveConfig.type);
                if (this.currentEnemyCount === this.currentWaveConfig.count){
                    this.currentWaveConfig = undefined;
                    this.currentEnemyCount = 0;
                }
            }
            else {
                this.addEnemyCurrentTime += dt;
            }
        }else {
            if (this.addWaveCurrentTime > this.levelConfig.dt){
                this.currentWaveConfig = this.levelConfig.waves[this.currentWaveCount];
                if (this.currentWaveCount < this.levelConfig.waves.length ){
                    this.currentWaveCount ++;
                }else {
                    this.currentWaveConfig = undefined;
                }
                this.addWaveCurrentTime = 0;
            }else {
                this.addWaveCurrentTime += dt;
            }
        }

        for (let i = 0 ; i < this.towerPosNodes.length ; i ++){
            let tower = this.towerPosNodes[i].tower;
            if (!!tower && tower.getComponent("tower").isFree()){
                for (let j = 0 ; j < this.enemyNodeList.length ; j ++){
                    let enemy = this.enemyNodeList[j];
                    if (enemy.getComponent("enemy").isLiving()){
                        // let distance = cc.pDistance(tower)
                       tower.getComponent("tower").setEnemy(enemy);
                    }
                }
            }
        }
    },
    addBullet: function (tower, position) {

        let bullet = cc.instantiate(this.bulletPrefab);
        // bullet.position = tower.position;
        bullet.parent = this.node;
        bullet.getComponent("bullet").initWithData(tower, position, this.enemyNodeList);

    }
});
