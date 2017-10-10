import global from './gloabl'
const TowerPosNodeState = {
    Invalid: -1,
    Null: 1,
    BuildMenu: 2,
    Tower: 3
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
    },
    setTouchEvent: function (node) {
        node.on(cc.Node.EventType.TOUCH_START, (event)=>{
            cc.log("touch node name = " + event.target.name);
            this.showBuildMenu(event.target);
        });
    },
    showBuildMenu: function (node) {
        this.closeBuildMenu();
        if (node.state === TowerPosNodeState.Null){
            let menu = cc.instantiate(this.buildMenuPrefab);
            menu.parent = this.node;
            menu.position = node.position;
            this.setState(node, TowerPosNodeState.BuildMenu);
            node.buildMenu = menu;
        }

    },
    closeBuildMenu: function () {
        for (let i = 0 ; i < this.towerPosNodes.length ; i ++){
            let node = this.towerPosNodes[i];
            if (node.state === TowerPosNodeState.BuildMenu){
                node.buildMenu.destroy();
                this.setState(node, TowerPosNodeState.Null);
                return node;
            }
        }

    }
    ,
    setState: function (node, state) {
        if (node.state === state){
            return ;
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
        let node = this.closeBuildMenu();
        let tower = cc.instantiate(this.towerPrefabs[data]);
        tower.parent = this.node;
        tower.position = node.position;
        this.setState(node, TowerPosNodeState.Tower);
        node.tower = tower;
    },
    onDestroy: function () {
        global.event.off("build_tower", this.buildTower);
    }
});
