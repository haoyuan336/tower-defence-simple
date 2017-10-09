import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
        towerNodes: {
            default: [],
            type: cc.Node
        }
    },

    onLoad: function () {
        for (let i = 0 ; i < this.towerNodes.length ; i ++){
            let node = this.towerNodes[i];
            this.setEvent(node);
        }
    },
    setEvent: function (node) {
        node.on(cc.Node.EventType.TOUCH_START, (event)=>{
            let target = event.target;
            cc.log("target name = " + target.name);
            global.gameEvent.fire("build_tower", target);
        });
    }


});
