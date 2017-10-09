cc.Class({
    extends: cc.Component,

    properties: {
        levelPrefabs: {
            default: [],
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function () {
        // 进入游戏
        let level = cc.instantiate(this.levelPrefabs[0]);
        level.parent = this.node;
    }
});
