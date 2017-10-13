cc.Class({
    extends: cc.Component,

    properties: {
        levelPrefabs: {
            default: [],
            type: cc.Prefab
        },
        gameLayerNode: {
            default: null,
            type: cc.Node
        },
        gameUiLayerNode: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        let level = cc.instantiate(this.levelPrefabs[0]);
        level.parent = this.gameLayerNode;
    }
});
