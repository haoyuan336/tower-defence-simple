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
        let level = cc.instantiate(this.levelPrefabs[0]);
        level.parent = this.node;
    }
});
