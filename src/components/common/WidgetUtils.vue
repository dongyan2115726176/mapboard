<template>
    <p 
        class="handle-move-resize"
        :class="allSize?'big-resize':'small-resize'"
        @mousedown="onMove($event)"
    >
    
    </p>
</template>

<script>
import Bus from '../../utils/eventBus'
export default {
    name: 'Resize',
    props: {
        allSize:{
            type:Boolean,
            required: true
        },
        param:{
            type: Object,
            required: true
        }
    },
    methods: {
        //　组件移动　通知container
        onMove (event) {
            event = event || window.event;
            if(event.stopPropagation) { //W3C阻止冒泡方法
                event.stopPropagation();
            } else {
                event.cancelBubble = true; //IE阻止冒泡方法
            }
            let curNode = event.target.parentNode;
            let pageX = event.pageX;
            let pageY = event.pageY;
            let moveParam = {
                curNode:curNode,
                pageX:pageX,
                pageY:pageY,
                widgetParam:this.param
            }
            Bus.$emit("widget-move",true,moveParam);
            Bus.$emit("toggle-settingPanel",this.param);
            Bus.$emit("select-change-tab","DashBoard");
            return;
        }
    }
}
</script>

<style scoped> 
    .handle-move-resize {
        position: absolute;
        top: 0;
        right: 0; 
        width: 100%;
        z-index: 5000;
        cursor: move;
        display: none;
        background-color: rgba(68,68,68,0.40);
    }
    .big-resize {
        height: 100%;
    }
    .small-resize {
        height: 29px;
    }
</style>

