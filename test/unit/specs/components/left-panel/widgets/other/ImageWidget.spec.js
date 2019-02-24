import util from '../../../../../TestUtil'
import {shallowMount } from '@vue/test-utils'
import ImageWidget from '@/components/left-panel/widgets/other/ImageWidget'
import Bus from '@/utils/eventBus'

describe("ImageWidget.vue-文件组件", ()=>{
    let i18n = util.i18n;
    let wrapper = shallowMount(ImageWidget,{
        i18n,
        propsData:{
            param:{
                type: "Image",
                title: "标题",
                nls: "image",
                icon: "md-icon-image",
                id: 20190301,
                imageSrc:"",
                style: {
                    top: "400px",
                    left: "400px",
                    width: "135px",
                    height: "85px"
                }
            },
        }
    });
    it("ImageWidget-初始化是否正确",()=>{
        expect(wrapper.props("param").style.top).toBe("400px");
    });
    it("computed-计算属性",()=>{
        wrapper.setData({ 
            style:{
                top: "20px",
                left: "20px",
                width: "20px",
                height: "20px"
            }
        })
        expect(wrapper.vm.param.style.width).toBe("135px");
        expect(wrapper.vm.imageSrc).toBe("test-file-stub");
    });
});
