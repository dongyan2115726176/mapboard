<template>
    <div id="transfer">
        
    </div>
</template>

<script>
import Bus from '../../utils/eventBus'
export default {
    name: 'Transfer',
    data(){
        return {
            activeWidget:null,
            activeId:null
        }
    },
    props:{
        widgetList:{
            type:Array,
            required:true
        }
    },
    created(){
        // 创建组件时的监听
        Bus.$on("created-widget",(widgetParam)=>{
            this.activeWidget = widgetParam;
            this.activeId = widgetParam.id;
            // 将右侧设置面板打开
            Bus.$emit("addWidget-settingPanel", true);
            // 右侧面板加载对应的组件设置
            Bus.$emit("toggle-settingPanel",widgetParam);
        })
        // 重复监听右侧设置面板的BUS
        Bus.$on("toggle-settingPanel",(widgetParam)=>{
            if(widgetParam){
                this.activeWidget = widgetParam;
                this.activeId = widgetParam.id;
                this.acticeDashBoardList(widgetParam);
                return;
            }
            // 大屏列表高亮
            Bus.$emit("dashBoard-active", -1);
            Bus.$emit("widget-height-light",-1);
            this.activeWidget = null;
            this.activeId = null;
        })
    },
    methods: {
        // 激动当前组件
        acticeDashBoardList(widgetParam){
            let dashBoardIndex = this.getIndex(widgetParam.id);
            Bus.$emit("dashBoard-active",dashBoardIndex);
            Bus.$emit("widget-height-light",widgetParam.id);
        },
        // 获取当前组件的索引
        getIndex(id){
            let len = this.widgetList.length;
            for(let i=0;i<len;i++){
                if(this.widgetList[i].id === id){
                    return this.widgetList.length-1-i;
                }
            }
        }
    }
}
</script>

