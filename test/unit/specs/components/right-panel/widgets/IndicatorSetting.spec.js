import util from '../../../../TestUtil.js'
import { shallowMount } from '@vue/test-utils'
import IndicatorSetting from '@/components/right-panel/widgets/IndicatorSetting.vue'

describe('测试右侧IndicatorSetting.vue', () => {
    let i18n = util.i18n;
    let textParam ={
        type: "Indicator",
        dataSource:"server",
        nls:"statisticsIndicator",
        icon:"md-icon-indicator",
        id: 20190103,
        title: "指标",
        num: "20",
        unit: "次",
        fontSize: "24px",
        fontColor: "red",
        titleColor: "blue",
        agent:true,
        url:"",
        field:[],
        frequency:60,
        style:{
            top: "400px",
            left:"500px",
            width:"300px",
            height:"100px"
        }
    };
    let dataList =[
        {
            "dataSource": "api",
            "label": "1111",
            "value": "http://wthrcdn.etouch.cn/weather_mini?city=北京",
            "agent": true
        },
        {
            "label": "Campus公交站点",
            "value": "http://www.supermapol.com/web/datas/1235689134/content.json",
            "type": "JSON",
            "dataId": 1235689134,
            "dataSource": "data"
        }
    ]
    let wrapper = shallowMount(IndicatorSetting,{
        i18n,
        propsData:{
            "param":textParam,
            "dataList":dataList
        }
    });
    it('computed->indicatorParams-修改配置', () => {
        wrapper.setProps({
            param: {
                type: "Indicator",
                dataSource:"static",
                nls:"statisticsIndicator",
                icon:"md-icon-indicator",
                id: 20190103,
                title: "指标",
                num: "20",
                unit: "次",
                fontSize: "50px",
                fontColor: "red",
                titleColor: "blue",
                agent:true,
                url:"",
                field:[],
                frequency:60,
                style:{
                    top: "400px",
                    left:"500px",
                    width:"300px",
                    height:"100px"
                }
            }
        })
        expect(wrapper.vm.indicatorParams.fontSize).toBe(50);
    })
    it('dataSourceChange-修改服务类型', () => {
        wrapper.vm.dataSourceChange("server");
        expect(wrapper.vm.param.num).toBe(0);
    })
    it('setIndicatorParam-修改指标数值', () => {
        wrapper.vm.indicatorParams.num = "我是指标"
        wrapper.vm.setIndicatorParam("server");
        expect(wrapper.vm.param.num).toBe("我是指标");
    })
    it('onSelectApiData-选择API数据', () => {
        wrapper.vm.onSelectApiData("http://wthrcdn.etouch.cn/weather_mini?city=北京");
        expect(wrapper.vm.param.num).toBe("我是指标");
    })
    it('indicatorConfigParam-初始化指标参数', () => {
        wrapper.vm.indicatorConfigParam();
        expect(wrapper.vm.param.frequency).toBe(60);
    })
})