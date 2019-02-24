import util from '../../../../../TestUtil.js'
import { shallowMount } from '@vue/test-utils'
import TextSetting from '@/components/right-panel/widgets/text/TextSetting.vue'

describe('测试右侧TextSetting.vue', () => {
    let i18n = util.i18n;
    let textParam ={
        type: "Text",
        title: "普通文字",
        nls:"commonChar",
        icon:"md-icon-title",
        fontSize: "18px",
        fontFamily:"Microsoft YaHei",
        fontWeight:"normal",
        color: "red",
        style: {
            top: "400px",
            left: "400px",
            width: "200px",
            height: "100px"
        }
    };
    let wrapper = shallowMount(TextSetting,{
        i18n,
        propsData:{
            "param":textParam
        }
    });
    it('textInitParam-计算属性是否生效', () => {
        wrapper.setProps({
            param:{
                title:"改过的标题",
                fontSize:"改过的字体大小",
                color:"blue",
                fontFamily:"宋体",
                fontWeight:"800",
                style:{width:"50px",height:"60px"}
            }
        })
        expect(wrapper.vm.textInitParam.title).toBe("改过的标题");
    })
    it('textConfigParam-修改配置', () => {
        wrapper.vm.configTextWidget();
        expect(wrapper.vm.textInitParam.width).toBe(50);
    })
})