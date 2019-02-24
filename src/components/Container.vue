<template>
    <div id="app-mid"
        class="app-mid-edit"
        :class="showGrid? 'show-grid':''"
        :style="midStyle"
        @drop="onDrop"
        @dragover="onDragover"
        @click="this.onDeactivated"
    >
        <VueDraggableResizable
            class="md-widget"
            v-for="(item,index) in widgetList"
            :key="item.id"
            :w="parseInt(item.style.width)"
            :h="parseInt(item.style.height)"
            :x="parseInt(item.style.left)"
            :y="parseInt(item.style.top)"
            :resizable="true"
            :draggable="true"
            :parent="true"
            :grid="[10,10]"
            :drag-handle="(item.fullScreen!=undefined && !item.fullScreen)? '.widget-mask':'.md-widget'"
            @resizing="onResize"
            @dragging="onDragging"
            @dragstop="onDragstop"
            @activated="onActivated(index)"
            @resizestop="onResizestop(item)"
        >
            <component
                v-bind:is="item.type+'Widget'"
                :style="widgetBgColor"
                :param="item"
                :index="item.id"
            >
            </component>
            <p 
                v-if="(item.fullScreen!=undefined && !item.fullScreen)? true:false"
                class="widget-mask"
            >
            </p>
        </VueDraggableResizable>
        <AuxiliaryLine />
    </div>
</template>
<script>
import Bus from '../utils/eventBus';
import AuxiliaryLine from './common/AuxiliaryLine'
import TextWidget from './left-panel/widgets/text/TextWidget';
import TimeWidget from './left-panel/widgets/text/TimeWidget';
import TextListWidget from './left-panel/widgets/text/TextListWidget';
import IndicatorWidget from './left-panel/widgets/IndicatorWidget';
import ImageWidget from './left-panel/widgets/other/ImageWidget';
import BarWidget from './left-panel/widgets/charts/BarWidget';
import PieWidget from './left-panel/widgets/charts/PieWidget';
import RadarWidget from './left-panel/widgets/charts/RadarWidget';
import MapWidget from './left-panel/widgets/MapWidget';
import SceneWidget from './left-panel/widgets/SceneWidget'
export default {
    data () {
        return { 
            midStyle:{},
            isMove:false, // 是否移动
            curNode:"", // 移动的DOM
            widgetParam:{}, // 移动组件的所有参数
            widgetPageX:"", // 组件的X位置
            widgetPageY:"", // 组件的Y位置
            scaleX: 1, // X缩放大小
            scaleY: 1, // Y缩放大小
            settingPanelState:false, // 与右侧面板展开状态同步
            activeDragWidget:null, // 当前拖拽的widget
            heightLightIndex:null,
            showGrid:false // 中间网格
        }
    },
    props: {
        widgetList: {
            type: Array,
            required: true
        },
        baseSetting:{
            type: Object,
            required: true
        }
    },
    components:{
        AuxiliaryLine,
        TextWidget,
        TimeWidget,
        TextListWidget,
        IndicatorWidget,
        ImageWidget,
        BarWidget,
        PieWidget,
        RadarWidget,
        MapWidget,
        SceneWidget
    },
    watch:{
        baseSetting(){
            this.creatMidStyle();
        }
    },
    computed:{
        widgetBgColor(){
            let {widgetBackground} = this.baseSetting;
            let style = {
                backgroundColor: widgetBackground
            }
            return style;
        }
    },
    created(){
        Bus.$on("DashBoardSetting-Container",(baseSetting)=>{
            this.creatMidStyle();
        });
        Bus.$on("setting-container",(state)=>{
            this.settingPanelState = state;
            this.creatMidStyle();
        })
        // 监听组件拖放到中间
        Bus.$on("widgetDrag-mid",(widget)=>{
            this.activeDragWidget = widget;
        })
    },
    mounted(){
        const that = this;
        window.onresize = function rez(){
            that.windowResize();
        };
    },
    methods: {
        // 显示中间网格
        upDateShowGrid(state){
            this.showGrid = state;
        },
        // 获取中间可视化区域
        getMidVisualRegion(){
            let bodyDOM = document.getElementsByTagName("body")[0];
            let bodyWidth = bodyDOM.offsetWidth;
            let bodyHeight = bodyDOM.offsetHeight;
            let asideWidth = 46; // 左侧面板宽度
            if(window.lang === "en-US"){
                asideWidth = 76;
            }
            let settingWidth = 0;
            if(this.settingPanelState){
                settingWidth = 287;
            }
            let width,height,left,top;
            height = bodyHeight - 46 - 30; // 46 是头部高度 30是 固定留白
            width = (height/9*16);
            top = 15;
            left = (bodyWidth - asideWidth - settingWidth - width)/2;
            if(width > bodyWidth - asideWidth - settingWidth){
                width = bodyWidth - asideWidth - settingWidth - 30;
                height = width/16 * 9;
                top = (bodyHeight - height - 46)/2;
                left = 15;
            }
            return {width,height,left,top};
        },
        // 中间DOM样式组装
        creatMidStyle(){
            let {width,height,themeId,background} = this.baseSetting;
            let transform,marginLeft,marginTop,backgroundColor;
            if(themeId){
                let region = this.getMidVisualRegion();
                let x = region.width/parseInt(width);
                let y = region.height/parseInt(height);
                this.scaleX = x;
                this.scaleY = y;
                this.$store.commit("upDateAppScale",{x:this.scaleX,y:this.scaleY});
                transform = `scale(${x},${y})`;
                marginLeft = region.left + "px";
                marginTop = region.top + "px";
                backgroundColor = background;
            }
            this.midStyle = {width,height,transform,backgroundColor,marginLeft,marginTop};
        },
        // 监听窗口变化
        windowResize(){
            this.creatMidStyle();
        },
        // 切换到大屏
        onDeactivated(e){
            if(e.target.getAttribute("id") === "app-mid"){
                Bus.$emit("toggle-settingPanel","");
            }
            return;
        },
        // 拖拽元素在可视化区放置
        onDrop(e){
            if(!this.activeDragWidget){
                return;
            }
            e.preventDefault();
            let left = parseInt(e.layerX/this.scaleX);
            let top = parseInt(e.layerY/this.scaleY);
            let {style} = this.activeDragWidget;
            style.top = top - parseInt(style.height)/2;
            style.top = style.top - style.top%10 + "px";
            style.left = left - parseInt(style.width)/2;
            style.left = style.left - style.left%10 + "px";
            this.activeDragWidget.style = style;
            Bus.$emit("update-components",this.activeDragWidget);
            this.activeDragWidget = null;
        },
        // 拖拽元素在可视化区域移动
        onDragover(e){
            e.preventDefault();
        },
        // 拖动元素获取焦点
        onActivated(index){
            this.heightLightIndex = index;
            Bus.$emit("toggle-settingPanel",this.widgetList[this.heightLightIndex]);
        },
        // 元素正在被拖动
        onDragging(left, top){
            this.upDateShowGrid(true);
            Bus.$emit("widgets-auxiliary-line",true,{left:left, top:top})
            let param = this.widgetList[this.heightLightIndex];
            param.style.left = left + "px";
            param.style.top = top + "px";
        },
        // 元素拖动结束
        onDragstop(){
            Bus.$emit("widgets-auxiliary-line",false);
            this.upDateShowGrid(false);
        },
        // 元素正在被拖放大小
        onResize(left, top, width, height){
            this.upDateShowGrid(true);
            let param = this.widgetList[this.heightLightIndex];
            param.style.width = width + "px";
            param.style.height = height + "px";
            param.style.top = top + "px";
            param.style.left = left + "px";
        },
        // 元素拖放大小结束
        onResizestop(item){
           this.upDateShowGrid(false);
            if(item.type === "Map"){
                let mapStr = "map"+item.mapId;
                window[mapStr].updateSize();
            }
        }
    }
}
</script>

<style scoped>
    #app-mid {
        float: left;
        position: relative;
        top: 0px;
        left: 0px;
        transform-origin: top left;
        overflow: hidden;
        transition: all 0.4s ease 0s;
        box-shadow: 0 3px 33px 3px rgba(0,0,0,0.50);
    }
    #app-mid.show-grid {
        background-image: 
            linear-gradient(rgba(0,0,0,0.1) 1px,transparent 0),
            linear-gradient(90deg,rgba(0,0,0,0.1) 1px,transparent 0),
            linear-gradient(hsla(0,0%,80%,.3)1px,transparent 0),
            linear-gradient(hsla(0,0%,80%,.3)1px,transparent 0),
            linear-gradient(90deg,hsla(0,0%,80%,.3)1px,transparent 0);
        background-size: 
            20px 20px,20px 20px,
            20px 20px,20px 20px;
    }
    .app-mid-wrap {
        position: relative;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
    }
    .md-widget {
        position: absolute;
        z-index: 4000;
    }
    .md-widget.active {
        border: 1px solid #13A2FC;
    }
</style>
<style>
    #Chinese .app-mid-edit {
        left: 46px;
    }
    #English .app-mid-edit {
        left: 76px;
    }
    .md-widget:hover > .widget-mask {
        display: block;
    }
    .widget-mask {
        display: none;
        position: absolute;
        top:0;
        left:0;
        width: 100%;
        height: 30px;
        z-index: 5000;
        cursor: move;
        background-color: rgba(68,68,68,0.40);
    }
</style>


