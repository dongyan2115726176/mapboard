import util from '../../TestUtil'
import { shallowMount } from '@vue/test-utils'
import mockAxios from 'jest-mock-axios'
import chartDataUtil from '@/utils/chartDataUtil'
import Bus from "@/utils/eventBus"

    //定义一顿需要用到的测试数， 已经是尽量简化了
    let feature = {"X1": "Mon", "Y1": "100", "Y2": "500", "Y3": "1"},
        title = "test",
        chartWidgetParam = {
            chartParam: {
                id: "599010",
                url: "http://test.com",
                xAxisField: null,
                YAxisField: []
            },
            chartType: "bar",
            defaultColor:{
                title: "#fffaaa",
                body:["#E69D87","#759AA0","#DD6B66","#8EC1A8","#EEDD78"],
                heighLight:"#E9E9E9"
            }
        };
    let features =[feature];
    let responseObj = {  //请求返回值
        data:{
            fileName: "单元测试用例.json",
            type: "JSON",
            content: [{"X1": "Mon", "Y1": "100", "Y2": "500", "Y3": "1"}]
        }
    };
    let xAxisFieldList= ["X1"], yAxisFieldList= ["Y1"];
    let data = [{"X1": "Mon", "Y1": "100", "Y2": "500", "Y3": "1"}];
    afterEach(()=>{
        //每个案例后清理mock
        mockAxios.reset();
    });
describe("chartDataUtil.js-图表数据工具类测试",()=>{

    it("_assembleDataCallback-组装回调函数测试", ()=>{
        //先mock 结果函数
        chartDataUtil.diffTypeChart = jest.fn();
        chartDataUtil._assembleDataCallback(features,feature,title,chartWidgetParam);

        expect(chartDataUtil.diffTypeChart.mock.calls[0][1]).toEqual(chartWidgetParam);
        let r = {"features": [{"X1": "Mon", "Y1": "100", "Y2": "500", "Y3": "1"}], "title": "test", "xAxisFieldList": ["X1", "Y1", "Y2", "Y3"], "yAxisFieldList": ["Y1", "Y2", "Y3"]}
        expect(chartDataUtil.diffTypeChart.mock.calls[0][0]).toEqual(r);
    });

    it("getData-csv数据的获取解析",()=>{
        // 思路：利用mockAxios  mock出返回值，然后断言
        chartDataUtil._assembleDataCallback = jest.fn();
        let responseObj = {
            data:{
                fileName: "单元测试用例.csv",
                type: "CSV",
                content: {
                    colTitles: ["SmID"],
                    rows: [["0"],["1"]],
                }
            }}
        chartDataUtil.getData(chartWidgetParam,false);
        expect(mockAxios.get).toHaveBeenCalled();
        mockAxios.mockResponse(responseObj);
        expect(chartDataUtil._assembleDataCallback).toHaveBeenCalled();
    });

    it("getData-json数据分支的数据获取",()=> {
        responseObj.data.content = JSON.stringify(responseObj.data.content);
        chartDataUtil.getData(chartWidgetParam,false);
        mockAxios.mockResponse(responseObj);
        expect(chartDataUtil._assembleDataCallback).toHaveBeenCalled();
    });

    it("getData-json非数组数据分支",()=>{
        responseObj.data.content = {"X1": "Mon", "Y1": "100", "Y2": "500", "Y3": "1"};
        responseObj.data.content = JSON.stringify(responseObj.data.content);
        Bus.$emit = jest.fn();

        chartDataUtil.getData(chartWidgetParam,false);
        mockAxios.mockResponse(responseObj);
        expect(Bus.$emit).toHaveBeenCalled();
        //这里是第一次mock BUS.$emti, 如果想验证参数的话，就是mock.calls[0].xxx
    });

    it("initBarData-初始化柱状图",()=>{

        chartDataUtil.initBarData({title:"assembleBarData",features,xAxisFieldList,yAxisFieldList},chartWidgetParam);

        expect(Bus.$emit).toHaveBeenCalled();
        let rus = chartWidgetParam;
        rus.chartParam.xAxisField = "X1";
        rus.chartParam.YAxisField.push(yAxisFieldList);
        expect(Bus.$emit).toHaveBeenCalled();
        expect(Bus.$emit.mock.calls[1][1].title.text).toEqual("assembleBarData");
        //这里是第二次mock BUS.$emti, 如果想验证参数的话，就是mock.calls[1].xxx
        //bus的第一个参数是bus的事件名；这个方法里面又执行了三遍bus时间后边的需要对应的计算！！！
    });

    it("initBarData-xbar分支,同时测试addChart的demo分支",()=>{
        chartWidgetParam.chartType = "xbar";
        chartWidgetParam.chartParam.id = "chartDemo";
        chartDataUtil.initBarData({title,features,xAxisFieldList,yAxisFieldList},chartWidgetParam);
        //直接断言addChart中的bus被调用了；
        expect(Bus.$emit).toHaveBeenCalled();
        expect(Bus.$emit.mock.calls[3][0]).toEqual("update-components");
        //这里是第三次mock BUS.$emti, 如果想验证参数的话，就是mock.calls[2].xxx， BUT，上边的函数执行了三遍bus，所以这里应该是
        //mock.calls[4].xxx, 这个案例自身也会执行2遍bus ，后边不讲了
    });

    it("initBarData-line分支",()=>{
        chartWidgetParam.chartType = "line";
        chartDataUtil.initBarData({title,features,xAxisFieldList,yAxisFieldList},chartWidgetParam);
        expect(Bus.$emit).toHaveBeenCalledTimes(5); //综合前面的，到这里一共调用了8次了。。。，不清空是个问题
        expect(Bus.$emit.mock.calls[4][1].chartType).toEqual("line");
    });

    it("assemblePieData-渲染饼图",()=>{
        chartWidgetParam.chartType = "annular";
        chartDataUtil.assemblePieData({title,features,xAxisFieldList,yAxisFieldList},chartWidgetParam);
        expect(Bus.$emit.mock.calls[5][1].chartType).toEqual("annular");
    });

    it("formatPieSeriesData-格式化饼图数据",()=>{
        expect(chartDataUtil.formatPieSeriesData(data,"X1","Y1")).toEqual([{"name": "Mon", "value": "100"}]);
    });

    it("formatPieLegendData-格式化饼图图例的数据",()=>{
        expect(chartDataUtil.formatPieLegendData(data,"X1")).toEqual(["Mon"]);
    });

    it("_assembleData-数据格式变化的地图数据分支测试",()=>{
        let item = {attributes: "test"};
       expect(chartDataUtil._assembleData(item)).toEqual("test");
    });

    it("_assembleData-数据格式变化的geoJSON数据分支测试",()=>{
        let item = {properties: "test2"};
        expect(chartDataUtil._assembleData(item)).toEqual("test2");
    });

    it("assembleYaxisData-组装y轴数据",()=>{
        expect(chartDataUtil.assembleYaxisData(data,"Y1")).toEqual(["100"]);
    });

    it("assembleYaxisDataForS-统计计数功能组装数据的测试",()=>{
        expect(chartDataUtil.assembleYaxisDataForS(data,"Y3")).toEqual({"x":["1"],"y":[1]});
    });

    it("assembleaxisData-组装x轴数据",()=>{
        expect(chartDataUtil.assembleaxisData(data,"X1")).toEqual(["Mon"]);
    });

    it("creatSeries-组装series数据",()=>{
        let series = [{
            barMaxWidth:"50",
            name: '',
            type: "bar",
            data: [],
            emphasis: {
                itemStyle: {
                    color: "#fff000"
                }
            }
        }];
        expect(chartDataUtil.creatSeries(1,"bar","#fff000")).toEqual(series);
    });

    it("specialHandleXbar-条形图排序*3分支",()=>{
        let sorteData = [1,2,3];
        expect(chartDataUtil.specialHandleXbar(sorteData,"descending","xbar")).toEqual(sorteData);

        expect(chartDataUtil.specialHandleXbar(sorteData,"ascending","xbar")).toEqual([3,2,1]);

        expect(chartDataUtil.specialHandleXbar(sorteData,"descending","line")).toEqual([3,2,1]);
    });

    it("sortGraphData-统计数据排序",()=>{
        let sorteData = [
            {"X1": "Mon", "Y1": "100", "Y2": "500", "Y3": "1"},
            {"X1": "Mon", "Y1": "200", "Y2": "400", "Y3": "2"}
            ];
        let r = [
            {"X1": "Mon", "Y1": "200", "Y2": "400", "Y3": "2"},
            {"X1": "Mon", "Y1": "100", "Y2": "500", "Y3": "1"}
        ];
        expect(chartDataUtil.sortGraphData(sorteData,"Y1","descending","line")).toEqual(r);
    });

    it("changeChartThemeColor-改变主题颜色测试",()=>{
        let option = {
            legend:{
                textStyle: {
                    color: "#202020"
                }
            },
            title: {
                textStyle:{
                    color: "#121212"
                }
            },
            yAxis: {
                axisLine:{
                    lineStyle: {
                        color: "#521525"
                    }
                }
            },
            xAxis: {
                axisLine: {
                    lineStyle: {
                        color: "#555555"
                    }
                }
            }
        };
        let re = {
            legend:{
                textStyle: {
                    color: "#ffffff"
                }
            },
            title: {
                textStyle:{
                    color: "#ffffff"
                }
            },
            yAxis: {
                axisLine:{
                    lineStyle: {
                        color: "#ffffff"
                    }
                }
            },
            xAxis: {
                axisLine: {
                    lineStyle: {
                        color: "#ffffff"
                    }
                }
            }
        };
        expect(chartDataUtil.changeChartThemeColor(option,"blackTheme")).toEqual(re);
    });
});
