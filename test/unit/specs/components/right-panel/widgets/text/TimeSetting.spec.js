import util from '../../../../../TestUtil.js'
import { shallowMount } from '@vue/test-utils'
import TimeSetting from '@/components/right-panel/widgets/text/TimeSetting.vue'

describe('测试右侧TimeSetting.vue', () => {
    let i18n = util.i18n;
    let timeParam ={
        type: "Text",
        title: "实时时间",
        nls:"time",
        icon:"md-icon-time",
        widgetFile: "text/Time",
        style: {
            height: "85px",
            left: "500px",
            top: "400px",
            width: "150px"
        },
        param:{
            fontStyle:{
                fontSize: 18,
                fontFamily:"Microsoft YaHei",
                color: "red",
                fontWeight: "normal"
            },
            timeType:'date'
        }
    };
    let wrapper = shallowMount(TimeSetting,{
        i18n,
        propsData:{
            "param":timeParam
        }
    });
    it('timeInitParam-计算属性是否生效', () => {
        wrapper.setProps({
            param:{
                title:"改过的标题",
                style:{width:"50px",height:"60px",top:"20px",left:'30px'},
                param:{
                    fontStyle:{
                        fontSize: 20,
                        fontFamily:"Microsoft YaHei",
                        color: "改过的颜色",
                        fontWeight: "normal"
                    },
                    timeType:'改过的时间类型'
                }
            }
        })
        expect(wrapper.vm.timeInitParam.fontStyle.color).toBe("改过的颜色");
    })
    it('timeConfigParam-修改配置', () => {
        wrapper.setProps({
            param:{
                title:"实时时间",
                style:{width:"50px",height:"60px",top:"20px",left:'30px'},
                param:{
                    fontStyle:{
                        fontSize: 25,
                        fontFamily:"Microsoft YaHei",
                        color: "red",
                        fontWeight: "normal"
                    },
                    timeType:'data+second+week'
                }
            }
        })
        wrapper.vm.configTimeWidget();
        expect(wrapper.vm.timeConfigParam().param.fontStyle.fontSize).toBe('25px')
    });
    it('timeTypeyOption时间类型选项测试',()=>{
        wrapper.setProps({
            param:{
                title:"实时时间",
                style:{width:"50px",height:"60px",top:"20px",left:'30px'},
                param:{
                    fontStyle:{
                        fontSize: 25,
                        fontFamily:"Microsoft YaHei",
                        color: "red",
                        fontWeight: "normal"
                    },
                    timeType:'data+second+week'
                }
            }
        })
        expect(wrapper.vm.timeInitParam.timeType).toBe('data+second+week')
    })
})