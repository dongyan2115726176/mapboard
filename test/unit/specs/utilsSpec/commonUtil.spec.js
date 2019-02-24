import mockAxios from 'jest-mock-axios'
import commonUtil from '@/utils/commonUtil'
import Bus from "@/utils/eventBus"
import city_annular from "@/utils/template/data/city-annular.json"
import city_bar from "@/utils/template/data/city-bar.json"
import chart_demo from "@/utils/chart_demo.json"
import com_annular from "@/utils/template/data/com-annular.json"
import com_line from "@/utils/template/data/com-line.json"
import com_bar from "@/utils/template/data/com-bar.json"

describe("commonUtil.js-三维模块的工具集",()=>{
    it('repalcelocationToIP将占位符替换为IP,用于处理请求回来的数据',()=>{
        let url = 'http://{LOCATION}/iportal/apps/mapdashboard?action=create';
        let window = {
            location:{
                href:'http://iportal/apps/mapdashboard?action=create'
            }
        }
        let replaceId = commonUtil.repalcelocationToIP(url);
        expect(replaceId).toBe('http://{LOCATION}/iportal/apps/mapdashboard?action=create')
    })
    it('repalceIpToLocation将IP替换为占位符',()=>{
        const url = 'http://www.baidu.com';
        let window = {
            location:{
                href:'http://iportal/apps/mapdashboard?action=create'
            }
        }
        let replaceLocation = commonUtil.repalceIpToLocation(url);
        expect(replaceLocation).toBe('http://www.baidu.com')
    })
    it("assmeblyUrl组装请求的url地址",()=>{
        let url = 'http://LOCATION/iportal/apps/mapdashboard?action=create';
        let assmeUrl = commonUtil.assmeblyUrl(url);
        expect(assmeUrl).toContain('&t=');
        url = 'http://LOCATION/iportal/apps/mapdashboard';
        assmeUrl = commonUtil.assmeblyUrl(url);
        expect(assmeUrl).toContain('?t=');
    })
    it('checkUrl检测url合法性',()=>{
        let url = 'http://LOCATION/iportal/apps/mapdashboard?action=create';
        let checkUrl = commonUtil.checkUrl(url);
        expect(checkUrl).toBe(false);
    })
    it('checkUrlSuffix检查url后缀',()=>{
        let url = 'http://LOCATION/iportal/apps/mapdashboard?action=create';
        let assmeUrl = commonUtil.checkUrlSuffix(url);
        expect(assmeUrl).toContain('.json');
    })
    it("getWeek获取星期",()=>{
        let window = {
            lang:'en-US'
        }
        let week = 0;
        let getWeek = commonUtil.getWeek(week);
        expect(getWeek).toBe("星期日")
        week = 2;
        getWeek = commonUtil.getWeek(week);
        expect(getWeek).toBe("星期二");
        week = 3;
        getWeek = commonUtil.getWeek(week);
        expect(getWeek).toBe("星期三")
        week = 4;
        getWeek = commonUtil.getWeek(week);
        expect(getWeek).toBe("星期四")
        week = 5;
        getWeek = commonUtil.getWeek(week);
        expect(getWeek).toBe("星期五")
        week = 6;
        getWeek = commonUtil.getWeek(week);
        expect(getWeek).toBe("星期六")
    })
    it("getDemoChartJson得到demo图标JSON",()=>{
        let url = "../../../utils/template/data/city-bar.json";
        let result = commonUtil.getDemoChartJson(url);
        expect(result).toEqual(city_bar);
        url = "../../../utils/template/data/city-annular.json";
        result = commonUtil.getDemoChartJson(url);
        expect(result).toEqual(city_annular);
        url = "../../../utils/chart_demo.json";
        result = commonUtil.getDemoChartJson(url);
        expect(result).toEqual(chart_demo);
          url = "../../../utils/template/data/com-bar.json";
        result = commonUtil.getDemoChartJson(url);
        expect(result).toEqual(com_bar);
          url = "../../../utils/template/data/com-line.json";
        result = commonUtil.getDemoChartJson(url);
        expect(result).toEqual(com_line);
          url = '../../../utils/template/data/com-annular.json'
          result = commonUtil.getDemoChartJson(url);
          expect(result).toEqual(com_annular);
    })
    it("getDateTime获取当前时间返回置顶格式",()=>{
        let params = {
            source:'time',
            timeType:'data+second'
        }
        let window = {
            lang:'en-US'
        }
        let time = commonUtil.getDateTime(params.source,params.timeType)
        expect(time).not.toContain('星期');
        params = {
            source:'time',
            timeType:'data+second+week'
        }
        time = commonUtil.getDateTime(params.source,params.timeType)
        expect(time).toContain('星期');
        params = {
            source:'chart',
            timeType:'second'
        }
        time = commonUtil.getDateTime(params.source,params.timeType)
        expect(time.length).toBe(8);
        params = {
            source:'chart',
            timeType:'minute'
        }
        time = commonUtil.getDateTime(params.source,params.timeType)
        expect(time.length).toBe(5)
        params = {
            source:'chart',
            timeType:'date'
        }
        time = commonUtil.getDateTime(params.source,params.timeType)
        expect(time).toContain('-');
    });
    it("addNumberSymbol给数字添加千位符并对.N个0的小数取整",()=>{
        let num = 1212.12;
        let addSymbol = commonUtil.addNumberSymbol(num);
        expect(addSymbol).toBe("1,212.12")
    })
});
