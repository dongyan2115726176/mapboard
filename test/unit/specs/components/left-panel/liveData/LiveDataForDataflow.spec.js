import util from '../../../../TestUtil'
import { shallowMount } from '@vue/test-utils'
import LiveDataForDataflow from '@/components/left-panel/liveData/LiveDataForDataflow.vue'
import Bus from '@/utils/eventBus'

describe("LiveDataForDataflow.vue-左侧图表选择组件的测试", ()=>{
    let i18n = util.i18n;
    let wrapper = shallowMount(LiveDataForDataflow,{
        i18n,
        propsData:{
            baseSetting:{
                "width":"1920px",
                "height":"1080px",
                "themeId": "themeA",
                "themeColor":"blackTheme",
                "fillType": "color",
                "background": "#20222D"
            }
        }
    });
    it("LiveDataForDataflow-初始化是否正确",()=>{
        expect(wrapper.find(".real-data-btn").text()).toBe("确定")
        expect(wrapper.vm.imgHeadUrl).toBe("../../../../static/images/");
    });

    it("onSelectIcon-获取图标",()=>{
        expect(wrapper.vm.showIconElDialog).toBe(false);
        wrapper.find(".icon-img-wrap").trigger("click");
        expect(wrapper.vm.showIconElDialog).toBe(true);
        wrapper.find(".data-flow-icons-wrap > span").trigger("click");
        expect(wrapper.vm.imgSrc).toBe("../../../../static/images/round.png");
    });
    it("ckeckParams-检查字段是否为空",()=>{
        wrapper.setData({
            fieldOption:{
                mapUrl:"mapUrl",
                url:"url",
                epsg:3857,
                idField: "",
                deg:"deg"
            }
        })
        expect(wrapper.vm.ckeckParams()).toBe(false);
        wrapper.setData({
            fieldOption:{
                mapUrl:"mapUrl",
                url:"url",
                epsg:3857,
                idField: "id",
                deg:"deg"
            }
        })
        expect(wrapper.vm.ckeckParams()).toBe(true);
    });

    it("checkDataFlowUrl-检查数据流地址",()=>{
        Bus.$emit = jest.fn();
        wrapper.vm.checkDataFlowUrl();
        wrapper.vm.addDataFlowToApp();
        expect(Bus.$emit.mock.calls[0][1].dataSource).toBe("dataFlow");
    });
});
