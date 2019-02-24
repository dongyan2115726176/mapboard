import util from '../../../../../TestUtil'
import {
    shallowMount
} from '@vue/test-utils'
import TimeWidget from '@/components/left-panel/widgets/text/TimeWidget'
import Bus from '@/utils/eventBus'

describe("TimeWidget.vue-时间组件", () => {
    let i18n = util.i18n;
    let wrapper = shallowMount(TimeWidget, {
        i18n,
        propsData: {
            param: {
                type: "Text",
                title: "text",
                nls: "time",
                icon: "md-icon-time",
                param: {
                    fontStyle: {
                        fontSize: "18px",
                        fontFamily: "Microsoft YaHei",
                        fontWeight: "normal",
                        color: "red"
                    },
                    timeType: 'date'
                },
                style: {
                    top: "400px",
                    left: "40px",
                    width: "300px",
                    height: "100px"
                }
            }
        }
    });
    it("TimeWidget-初始化是否正确", () => {
        expect(wrapper.props("param").style.top).toBe("400px");
    });
    it("Bus.$on('theme-change')-组件主题更换", () => {
        let themePlan = {
            text: "black"
        }
        Bus.$emit("theme-change", themePlan);
        expect(wrapper.props("param").param.fontStyle.color).toBe("black");
    });
});
