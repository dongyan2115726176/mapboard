import mockAxios from 'jest-mock-axios'
import compatibleConfig from '@/utils/compatibleConfig'
import Bus from "@/utils/eventBus"

describe("compatibleConfig.js-图表数据工具类测试",()=>{
    let style = {
        left:"",
        top:"",
        right:"20px",
        bottom:"40px",
        width:"900px",
        height:"40px"
    }
    let config = {
        baseSetting:{
            "theme": "themeA",
            "width":"1920px",
            "height":"1080px",
			"fillType": "color",
			"background": "#20222D"
        },
        components:[
            {
                type:"Map",
                level:1,
                style:style
            },
            {
                type:"Indicator",
                field:"",
                style:style
            },
            {
                type:"Text",
                style:style
            },
            {
                type:"Chart",
                style:style,
                chartParam: {}
            }
        ]
    }
    it("updataBaseSetting-修复大屏设置",()=>{
        let baseSet = compatibleConfig.updataBaseSetting(config.baseSetting);
        expect(baseSet.themeId).toBe("themeA");
    });
    it("updataComponents-兼容组件",()=>{
        let components = compatibleConfig.updataComponents(config.components,config.baseSetting);
        // 移动参数
        expect(components[0].style.left).toBe("1000px");
        // 地图参数
        expect(components[0].zoom).toBe(1);
        // 指标参数
        expect(components[1].titleColor).toBe("#ffffff");
        // 文本参数
        expect(components[2].fontFamily).toBe("Microsoft YaHei");
        // 图表参数
        expect(components[3].defaultColor.heighLight).toBe("#A8CFFF");
    });
});
