<template>
    <div
        class="map-widgets"
    >
        <div
            :id="mapInitStyle.id"
            class="map-wrap"
            :ref="mapInitStyle.mapId"
            v-if="reRander"
        >
        </div>
    </div>
</template>

<script>
import Bus from '../../../utils/eventBus';
import liveDataForDataFlow from '../../../utils/liveDataForDataFlow'
export default {
    name: "MapWidgets",
    data () {
        return {
            map:null, // 保存地图对象
            saveSetTime:null, // 保存计时器 延迟触发
            scaleLineControl:false, // 比例尺
            overviewMap:false, // 鹰眼
            reRander:true // 地图重绘用
        }
    },
    props:{
        param:{
            type: Object,
            required: true
        }
    },
    created(){
        Bus.$on("setting-mapWidget",(param)=>{
            if(param.id === this.param.id){
                this.setMapParam(param)
            }
        })
        Bus.$on("mapSetting-mapWidget",(id,style)=>{
            if(id === this.param.id){
                if(style){
                    this.param.style = style;
                }
                setTimeout(()=>{
                    window[this.mapStr].updateSize();
                },100)
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
                    window[this.mapStr].updateSize();
                },800)
            }
        })
    },
    watch:{
        index:{
            handler(){
                this.reRander = false;
                setTimeout(()=>{
                    this.reRander = true;
                    // $nextTick 是在下次 DOM 更新循环结束之后执行延迟回调
                    this.$nextTick(() => {
                        this.createdMap();
                    });
                },10);
            },
            deep:true
        }
    },
    computed:{
        index(){
            return this.param.index;
        },
        mapInitStyle(){
            let {style,id} = this.param;
            id = "map"+id;
            let params = {style,id};
            return params;
        },
        mapStr(){
            let mapStr = "map"+this.param.mapId;
            return mapStr;
        }
    },
    mounted(){
        this.createdMap();
    },
    beforeDestroy(){
        window[this.mapStr] = null;
    },
    methods:{
        // 创建地图
        createdMap(){
            if(this.param.dataSource){
                if(this.param.dataSource === "dataFlow"){
                    window[this.mapStr] = liveDataForDataFlow.createdDataFlow(this.param);
                    setTimeout(()=>{
                        this.operationMap();
                    },500)
                }
            }else{
                this.createClientMap();
            }
        },
        // 利用iclient9D出图 leaflet
        createClientMap(){
            let {mapId,mapUrl} = this.param;
            let url = mapUrl+"/apps/viewer/"+mapId;
            let href = window.location.href;
            let crossUrl = href.slice(0,href.indexOf("/apps/mapdashboard"));
            let proxy = false;
            if(url.indexOf("http://iptl.supermap.io") > -1){
                //模板中的地图要使用代理请求，解决跨域问题
                crossUrl = crossUrl + "/apps/viewer/getUrlResource.json?url=" + url;
                proxy = true;
            }else{
                crossUrl = url;
            }
            //http://127.0.0.1:8090/iportal/apps/viewer/1214529881
            new ol.supermap.WebMap(mapId,{
                server: crossUrl,
	            excludePortalProxyUrl: proxy,
                target: 'map'+this.param.id,
                successCallback: (map)=> {
                    window[this.mapStr] = map;
                    this.operationMap();
                    //创建分段滑块实例
                    new RangeSlider(map, {
                        target: this.$refs[this.mapInitStyle.mapId],
                        info: ['低', '高'],
                        visible: true
                    })
                },
                errorCallback:(error,tips)=>{
                    if(error &&(tips == "getMapFaild" || tips == "getWmtsFaild")){
                        this.$message({
                            type: 'warning',
                            message: this.$t("createdMapErr")
                        })
                        //删除组件自身
                        Bus.$emit("update-components",this.index);
                    }
                    /*  tips
                        getMapFaild：获取地图信息失败；
                        getWmtsFaild：获取wmts信息失败；
                        getLayerFaild: 获取图层信息失败；
                        getFeatureFaild:获取feature失败
                    */
                }
            });
        },
        // openLayer 生成底图后操作
        operationMap(){
            let view = window[this.mapStr].getView();
            let {zoom,center} = this.param;
            if(zoom === 0 && center[0] === 0 && center[1] === 0){
                this.param.center = center;
                this.param.zoom = view.getZoom();
            }else{
                view.setZoom(zoom);
                view.setCenter(center);
            }
            window[this.mapStr].updateSize();
            this.watchMoveMapWidget();
            this.removeMapControl();
        },
        // 删除底图logo 版权控件 等 默认有4个
        removeMapControl(){
            let arr = window[this.mapStr].getControls().getArray();
            let [zoom,rotate,attribution,logo] = arr;
            window[this.mapStr].removeControl(zoom); 
            window[this.mapStr].removeControl(rotate);
            window[this.mapStr].removeControl(attribution);
            window[this.mapStr].removeControl(logo);
            this.changeControls();
        },
        // 添加/移除 鹰眼 比例尺等
        changeControls(){
            let {scaleLine,overviewMap} = this.param;
            if(scaleLine){
                if(!this.scaleLineControl){
                    this.scaleLineControl = new ol.control.ScaleLine({
                        units: 'metric',
                        target: 'scalebar',
                        className: 'ol-scale-line'
                    })
                    window[this.mapStr].addControl(this.scaleLineControl);
                }
            }else{
                if(this.scaleLineControl){
                    window[this.mapStr].removeControl(this.scaleLineControl);
                    this.scaleLineControl = false;
                }
            }
            if(overviewMap){
                if(!this.overviewMap){
                    let code = window[this.mapStr].getView().getProjection().getCode();
                    this.overviewMap = new ol.control.OverviewMap({
                        view: new ol.View({
                            projection: code
                        }),
                        tipLabel:this.$t("tipLabel"),
                        collapsed: false
                    });
                    window[this.mapStr].addControl(this.overviewMap);
                }
            }else{
                if(this.overviewMap){
                    window[this.mapStr].removeControl(this.overviewMap);
                    this.overviewMap = false;
                }
            }
        },
        // setting传值渲染地图
        setMapParam(param){
            clearTimeout(this.saveSetTime);
            this.saveSetTime = setTimeout(()=>{
                let {center,zoom} = param;
                let view = window[this.mapStr].getView();
                view.setZoom(zoom);
                view.setCenter(center);
                this.changeControls();
            },800)
        },
        // 监听地图移动事件
        watchMoveMapWidget(){
            window[this.mapStr].un("moveend",this.mapMoveend);
            window[this.mapStr].on("moveend",this.mapMoveend);
        },
        // 监听地图moveend事件
        mapMoveend(ev){
            let {zoom,center} = ev.frameState.viewState;
            this.param.zoom = zoom;
            this.param.center = center;
        }
    }
}
</script>

<style scoped>
    .map-widgets {
        width: 100%;
        height: 100%;
    }
    .map-widgets > .map-wrap {
        width: 100%;
        height: 100%;
    }
</style>
<style>
    .ol-scale-line {
        left:calc(100% - 150px);
    }
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
</style>

