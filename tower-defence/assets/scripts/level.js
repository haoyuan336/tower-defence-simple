import global from './global'
const TowerPosNodeState = {
    Invailde: -1,
    Null: 1,
    BuildMenu: 2,
    UpdateMenu: 3,
    Tower: 4
};
cc.Class({
    extends: cc.Component,
    properties: {
        pathNodes: {
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
        tower_a_prefab: {
            default: null,
            type: cc.Prefab
        },
        tower_b_prefab: {
            default: null,
            type: cc.Prefab
        }
    },


    // use this for initialization
    onLoad: function () {
        //加监听
        for (let i = 0  ; i < this.towerPosNodes.length ; i ++){
            let node = this.towerPosNodes[i];

            node.state = TowerPosNodeState.Null;
            this.setTouchEvent(node, i);
        };
        global.gameEvent.on("build_tower", (target)=>{
            cc.log("build tower" + target.name);
            let node = this.getBuildMenuNodePos();
            this.setState(node, TowerPosNodeState.Null);
            this.buildTower(node, target)

        })
    },
    setTouchEvent: function (node,index) {
        cc.log("设置监听");
        node.on(cc.Node.EventType.TOUCH_START, (event)=>{
            // cc.log("index = " + index);
            let target = event.target;
            if (target.state === TowerPosNodeState.Null){
                this.closeBuildMenu();
                this.setState(node, TowerPosNodeState.BuildMenu);
            }
        });
    },
    setState: function (node, state) {
        if (node.state === state){
            return;
        }
        switch (state){
            case TowerPosNodeState.Null:
                if (node.buildMenu){
                    node.buildMenu.destroy();
                }
                break;
            case TowerPosNodeState.BuildMenu:
                this.showBuildMenu(node);
                break;
            case TowerPosNodeState.UpdateMenu:
                break;
            case TowerPosNodeState.Tower:
                break;
            default:
                break;
        }
        node.state = state;
    },
    showBuildMenu: function (node) {
        let buildMenu = cc.instantiate(this.buildMenuPrefab);
        buildMenu.parent = this.node;
        buildMenu.position = node.position;
        node.buildMenu = buildMenu;
    },
    buildTower: function (node,target) {
        let name = target.name;
        let prefab = this[name + "_prefab"];
        let tower = cc.instantiate(prefab);
        tower.parent = this.node;
        tower.position = node.position;
        this.setState(node, TowerPosNodeState.Tower);
    },
    closeBuildMenu : function () {
        for (let i = 0 ; i  < this.towerPosNodes.length ; i ++){
            let node = this.towerPosNodes[i];
            if (node.state === TowerPosNodeState.BuildMenu){
                this.setState(node, TowerPosNodeState.Null);
            }
        }
    },
    getBuildMenuNodePos : function () {
        for (let i = 0 ; i < this.towerPosNodes.length ; i ++){
            let node = this.towerPosNodes[i];
            if (node.state === TowerPosNodeState.BuildMenu){
                return node;
            }
        }
    }
});
