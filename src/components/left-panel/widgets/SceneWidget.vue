<template>
    <div
        class="scene-widgets"
    >
	    <el-tooltip
            class="item"
            effect="dark"
            :hide-after="2000"
            :manual="tooltipIsVisable"
            :content="this.$t('selectposition')"
            placement="bottom">
        <div
            :id="sceneInitStyle.sceneId"
            class="scene-wrap"
        >
        </div>
	    </el-tooltip>
    </div>
</template>

<script>
import Bus from '../../../utils/eventBus';
export default {
    name: "SceneWidgets",
    data () {
        return {
            saveSetTime:null, // 保存计时器 延迟触发
	        tooltipIsVisable: true, //tooltip 是否显示,默认不显示
        }
    },
    props:{
        param:{
            type: Object,
            required: true
        }
    },
    created(){
        Bus.$on("setting-sceneWidget",(param)=>{
            if(param.id === this.param.id){
                let {scanEffect} =  this.param;
                if(scanEffect.type === "noScan"){
                    this.param.scanEffect.status = false;
                    this.param.scanEffect.type = "noScan";
                    window[this.viewerId].scene.scanEffect.show = false;
                }else{
                    this.param.scanEffect.status = true;
                    this.param.scanEffect.type = scanEffect.type;
                    setTimeout(()=>{
                        this.startScan(scanEffect.type);
                    },100)
                }
            }
        });

	    //sceneSetting.vue
        Bus.$on("sceneSetting-sceneWidget",(id,style)=>{
            if(id === this.param.id){
                if(style){
                    this.param.style = style;
                }
            }
        })
        // 重复监听大屏的状态改变
        Bus.$on("DashBoardSetting-Container",(baseSetting)=>{
            let {width,height} = JSON.parse(JSON.stringify(baseSetting));
            let {fullScreen} = this.param;
            if(fullScreen){
                clearTimeout(this.saveSetTime);
                this.saveSetTime = setTimeout(()=>{
                    this.param.style.width = width;
                    this.param.style.height = height;
                },800)
            }
        })
        Bus.$on("sceneSetting-selectPoint",()=>{
            this.tooltipIsVisable = false;
        });
    },
    computed:{
        sceneInitStyle(){
            let {style,index} = this.param;
            let sceneId = "scene"+index;
            let params = {style,sceneId};
            return params;
        },
        viewerId(){
            let id = "scene"+this.param.id;
            return id;
        }
    },
    mounted(){
        this.createdScene();
    },
    beforeDestroy(){
        window[this.viewerId] = null;
    },
    methods:{
        // 创建场景
        createdScene(){
            let {index,sceneUrl} = this.param;
            sceneUrl = sceneUrl.slice(0,sceneUrl.indexOf("/rest/realspace")+15);
            let sceneId = "scene"+index;
            window[this.viewerId] = new Cesium.Viewer(sceneId, {
                infobox:false
            });
            let scene = window[this.viewerId].scene;
            scene.fxaa = true;
            scene.skyAtmosphere.show = false;

            //打开场景
            let promise = scene.open(sceneUrl);

            Cesium.when.all(promise,(layers)=>{
                let sc = scene.camera;
                scene.camera.setView({
                    //设置三维笛卡尔坐标点
                    destination : Cesium.Cartesian3(sc.position.x,sc.position.y,sc.position.z),
                    orientation:{
                        heading: sc.heading,
                        pitch: sc.pitch,
                        roll: sc.roll
                    }
                });
                //捕获三维场景上的鼠标事件，用于高亮场景组件
                let handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
                handler.setInputAction((e)=>{
                    this.param.positopn = new Cesium.Cartesian3(sc.position.x,sc.position.y,sc.position.z);
                    this.heightLight = true;
                    if(!this.tooltipIsVisable){
                        // 获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
                        let position = e.position;
                        let last = scene.pickPosition(position);
	                    window[this.viewerId].scene.scanEffect.centerPostion = last; // 设置扫描中心点
	                    this.param.scanEffect.centerPostion = last;
                        this.tooltipIsVisable = true; //关闭悬浮提示
                        Bus.$emit("close-effect-point",false);
                    }
                },Cesium.ScreenSpaceEventType.LEFT_CLICK);
                handler.setInputAction(()=>{
                    this.tooltipIsVisable = true;  // 取消选择中线点的事件
                    Bus.$emit("close-effect-point",false);
                },Cesium.ScreenSpaceEventType.RIGHT_CLICK);
                //恢复状态时，恢复扫描效果,加赞三维场景比较卡，所以延迟2秒后再加载光线效果
                if(this.param.scanEffect.status){
                    setTimeout(()=>{
                        this.startScan(this.param.scanEffect.type);
                    },3000);
                }
            });
        },

	    //开启光线扫描
	    startScan(type){
            let sc = window[this.viewerId].scene.camera;
            window[this.viewerId].scene.scanEffect.show = false;
            window[this.viewerId].scene.scanEffect.mode = type === "line" ? Cesium.ScanEffectMode.LINE : Cesium.ScanEffectMode.CIRCLE;
            if(this.param.scanEffect.centerPostion){
                window[this.viewerId].scene.scanEffect.centerPostion = this.param.scanEffect.centerPostion;
            }else{
                this.param.scanEffect.centerPostion = new Cesium.Cartesian3(sc.position.x,sc.position.y,sc.position.z);
                window[this.viewerId].scene.scanEffect.centerPostion = new Cesium.Cartesian3(sc.position.x,sc.position.y,sc.position.z);
            }
            window[this.viewerId].scene.scanEffect.color = Cesium.Color.CORNFLOWERBLUE;
            window[this.viewerId].scene.scanEffect._period = this.param.scanEffect._period;
            window[this.viewerId].scene.scanEffect.speed = this.param.scanEffect.speed;
            window[this.viewerId].scene.scanEffect.show = true;
	    }
    }
}
</script>

<style scoped>
    .scene-widgets {
       width: 100%;
        height: 100%;
    }
    .scene-widgets > .scene-wrap {
        width: 100%;
        height: 100%;
    }
</style>
<style>
    .ol-overviewmap {
        background-color: #14A5FC!important;
        border-radius:0;
        padding:0px!important;
        left: 0;
        bottom: 0;
        max-height:152px;
    }
    .ol-overviewmap .ol-overviewmap-map {
        border:none!important;
        margin:1px;
    }
    /*隐藏场景上面的logo 以及右上角的罗盘*/
    .cesium-viewer-bottom, .cesium-viewer-navigationContainer{
	    display: none;
    }
</style>

