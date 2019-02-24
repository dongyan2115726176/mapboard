const liveDataForDataFlow = {
    createdDataFlow(params){
        let {center,zoom,fieldOption:{mapUrl,url,epsg,idField,deg,iconUrl},id} = params;
        let crs = "EPSG:3857";
        if(epsg == 4326){
            crs = "EPSG:4326";
        }
        // 创建地图容器
        let map = new ol.Map({
            target: 'map'+id,
            controls: ol.control.defaults({attributionOptions: {collapsed: false}})
                .extend([new ol.supermap.control.Logo()]),
            view: new ol.View({
                center: center,
                zoom: zoom,
                projection: crs
            })
        });
        // 创建底图
        var layer = new ol.layer.Tile({
            source: new ol.source.TileSuperMapRest({
                url: mapUrl,
                wrapX: true,
            }),
            projection: crs
        });
        map.addLayer(layer);
        // 创建数据流服务
        let source = new ol.source.DataFlow({
            ws: url,
            idField: idField,// 获取数据流id字段
            wrapX:false
        });
        // 生成数据流图层 并添加到map中
        let resultLayer = new ol.layer.Vector({
            zIndex:100000,
            source: source,
            style:(e)=>{
                return new ol.style.Style({
                    image: new ol.style.Icon({
                        src: iconUrl, // 图片地址
                        rotateWithView:true,
                        rotation: e.get(deg), // 获取旋转角度字段
                        size:[16,16], // 图片小大（接口可能暂不生效，带后期iclient处理后在尝试）
                        crossOrigin: 'anonymous'
                    })
                })
            }
        })
        map.addLayer(resultLayer);
        return map;
    }
}

export default liveDataForDataFlow;