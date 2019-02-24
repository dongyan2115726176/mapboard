<template>
    <div id="app-mid"
        class="app-mid-edit"
        :style="midStyle"
    >
        <div
            class="md-widget"
            v-for="(item,index) in widgetList"
            :key="index"
            :style="item.style"
        >
            <component
                v-bind:is="item.type+'Widget'"
                :param="item"
                :index="item.id"
            >
            </component>
        </div>
    </div>
</template>
<script>
import TextWidget from '../components/left-panel/widgets/text/TextWidget';
import TimeWidget from '../components/left-panel/widgets/text/TimeWidget';
import TextListWidget from '../components/left-panel/widgets/text/TextListWidget';
import IndicatorWidget from '../components/left-panel/widgets/IndicatorWidget';
import ImageWidget from '../components/left-panel/widgets/other/ImageWidget';
import BarWidget from '../components/left-panel/widgets/charts/BarWidget';
import PieWidget from '../components/left-panel/widgets/charts/PieWidget';
import RadarWidget from '../components/left-panel/widgets/charts/RadarWidget';
import MapWidget from '../components/left-panel/widgets/MapWidget';
import SceneWidget from '../components/left-panel/widgets/SceneWidget'
export default {
    data () {
        return { 
            midStyle:{}
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
    mounted(){
        this.creatMidStyle();
        const that = this;
        window.onresize = function rez(){
            that.windowResize();
        };
    },
    watch:{
        baseSetting(){
            this.creatMidStyle();
        }
    },
    methods: {
        creatMidStyle(){
            let {width,height,themeColor,background} = this.baseSetting;
            let transform,backgroundColor;
            if(themeColor){
                let bodyDOM = document.getElementsByTagName("body")[0];
                bodyDOM.setAttribute("class",themeColor);
                let bodyWidth = bodyDOM.offsetWidth;
                let bodyHeight = bodyDOM.offsetHeight;
                let x = (bodyWidth/parseInt(width));
                let y = (bodyHeight/parseInt(height));
                transform = `scale(${x},${y})`;
                backgroundColor = background;
            }
            this.midStyle = {width,height,transform,backgroundColor};
        },
        // 监听窗口变化
        windowResize(){
            let {width,height} = this.baseSetting;
            let bodyDOM = document.getElementsByTagName("body")[0];
            let bodyWidth = bodyDOM.offsetWidth;
            let bodyHeight = bodyDOM.offsetHeight;
            let appMid = document.getElementById("app-mid");
            let x = (bodyWidth/parseInt(width));
            let y = (bodyHeight/parseInt(height));
            appMid.style.transform = `scale(${x},${y})`;
        }
    }
}
</script>

<style scoped>
    #app-mid {
        position: absolute;
        top: 0px;
        left: 0px;
        transform-origin: top left;
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
</style>
<style>
    .blackTheme .md-widget {
        background-color: rgba(0,0,0,0.8);
    }
    .whiteTheme .md-widget {
        background-color: rgba(255,255,255,0.8);
    }
</style>
