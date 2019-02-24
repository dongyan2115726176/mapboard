//MD应用通用工具类，不涉及具体业务的通用方法都写在此文件中
import City_bar from './template/data/city-bar.json';
import City_annular from './template/data/city-annular.json';
import Com_annular from './template/data/com-annular.json';
import Chart_demo from './chart_demo.json';
import Com_bar from './template/data/com-bar.json';
import Com_line from './template/data/com-line.json';
import Bus from '../utils/eventBus'
const CommonUtil = {
    //将占位符替换为IP,用于处理请求回来的数据
    repalcelocationToIP: (url)=>{
        let href = window.location.href;
        if(href.indexOf("/apps/mapdashboard") !== -1 && (url.search("{LOCATION}") !== -1)){
            let localUrl = href.slice(0,href.indexOf("/apps/mapdashboard"));
            url = url.replace(/\{LOCATION}/, localUrl);

        }
        return url;
    },
    //将IP替换为占位符，用于保存前的数据处理
    repalceIpToLocation: (url)=> {
        let href = window.location.href;
        if(href.indexOf("/apps/mapdashboard") !== -1){
            let localUrl = href.slice(0,href.indexOf("/apps/mapdashboard"));
            url = url.replace(localUrl,"{LOCATION}");
        }
        return url;
    },
    //组装请求的url地址
    assmeblyUrl: (url)=>{
        if(url.indexOf("?") !== -1){
            url = url +"&t=" + Date.parse(new Date());
        }else{
            url = url +"?t=" + Date.parse(new Date());
        }
        return url;
    },
    //检测url合法性，仅检测是否为合法的url 不涉及任何功能逻辑
    checkUrl: (url)=> {
        let strRegex = "^((https|http|ftp|rtsp|mms)?://)"+
        "?(([0-9a-z_!~*'().&= $%-] : )?[0-9a-z_!~*'().&= $%-] @)?"+//ftp的user@
        "(([0-9]{1,3}\.){3}[0-9]{1,3}"+// IP形式的URL- 199.194.52.184
        "|"+ // 允许IP和DOMAIN（域名）
        "([0-9a-z_!~*'()-] \.)*"+ // 域名- www.
        "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\."+ // 二级域名
        "[a-z]{2,6})"+ // first level domain- .com or .museum
        "(:[0-9]{1,4})?"+ // 端口- :80
        "((/?)|"+ // a slash isn't required if there is no file name
        "(/[0-9a-z_!~*'().;?:@&= $,%#-] ) /?)$";
        let re=new RegExp(strRegex);
        //re.test()
        return re.test(url);
    },
    //窗口最大化工具类 参数1：需要最大化窗口的唯一className 参数2：需要改变图标的唯一className
    maximization:(className,iconClassName)=>{
        let targetNode = document.getElementsByClassName(className)[0];
        let changeIcoNode = document.getElementsByClassName(iconClassName)[0];
        let isMax = -1;
        if(changeIcoNode.classList.value){
            isMax = changeIcoNode.classList.value.indexOf("mapuse-icon-exit-screen");
        }else{
            for(let key in changeIcoNode.classList){
                if(changeIcoNode.classList[key] === "mapuse-icon-exit-screen"){
                    isMax = 1;
                    break;
                }
            }
        }
        if(isMax < 0){
            changeIcoNode.classList.remove("mapuse-icon-plus");
            changeIcoNode.classList.add("mapuse-icon-exit-screen");
            let style = targetNode.style.cssText;
            changeIcoNode.setAttribute("saveStyle",style);
            let winWidth = window.innerWidth;
            let winHeight = window.innerHeight;
            targetNode.style.width = (winWidth*0.8) + "px";
            targetNode.style.height = (winHeight*0.8) + "px";
            targetNode.style.right = "";
            targetNode.style.left = (winWidth*0.1) + "px";
            targetNode.style.bottom = "";
            targetNode.style.top = (winHeight*0.1) + "px";
            targetNode.style.zIndex = 500;
        }else{
            changeIcoNode.classList.add("mapuse-icon-plus");
            changeIcoNode.classList.remove("mapuse-icon-exit-screen");
            let getStyle = changeIcoNode.getAttribute("saveStyle");
            targetNode.style.cssText = getStyle;
        }
    },
    checkUrlSuffix(url){
        let urlStr = url;
        if(url.indexOf(".json") < 0 ){
            urlStr = url + ".json";
        }
        return urlStr;
    },
    //获取当前时间返回置顶格式
    getDateTime(source,timeType) {
        let myDate = new Date();
        let Y = myDate.getFullYear();
        let M = myDate.getMonth()+1;
        M = M < 10 ? "0"+M : M; 
        let D = myDate.getDate();
        D = D < 10 ? "0"+D : D;
        let h = myDate.getHours();
        h = h < 10 ? "0"+h : h;
        let m = myDate.getMinutes();
        m = m < 10 ? "0"+m : m;
        let s = myDate.getSeconds();
        s = s < 10 ? "0"+s : s;
        let W = myDate.getDay();
        W = this.getWeek(W);
        if(source==="time"){
            let date = Y+"年"+M+"月"+D+"日";
            let data_second = date+" "+h+"时"+m+"分"+s+"秒";
            let data_second_week = data_second+" "+W;
            if(window.lang === "en-US"){
                date = D+"-"+M+"-"+Y;
                data_second = h+":"+m+":"+s+" "+date;
                data_second_week = h+":"+m+":"+s+" "+W+" "+date;
            }
            switch (timeType){
                // 下面case给时间组件使用
                case "date":
                    return date;
                case "data+second":
                    return data_second;
                case "data+second+week":
                    return data_second_week;
            }
        }else if(source==="chart"){
            let second = h+":"+m+":"+s;
            let minute = h+":"+m;
            let data = M+'-'+D;
            switch (timeType){
                case "second":
                return second;
                case "minute":
                return minute;
                case "date":
                return data;
            }
        }
    },
    // 获取星期
    getWeek(week){
        switch (week){
            case 0:
                return (window.lang === "en-US"?"Sunday":"星期日");
            case 1:
                return (window.lang === "en-US"?"Monday":"星期一");
            case 2:
                return (window.lang === "en-US"?"Tuesday":"星期二");
            case 3:
                return (window.lang === "en-US"?"Wednesday":"星期三");
            case 4:
                return (window.lang === "en-US"?"Thursday":"星期四");
            case 5:
                return (window.lang === "en-US"?"Friday":"星期五");
            case 6:
                return (window.lang === "en-US"?"Saturday":"星期六");
        }
    },
    //给数字添加千位符并对.N个0的小数取整
    addNumberSymbol(num){
        num = num.toString();
        let index = num.lastIndexOf('.');
        let integer = num,
            decimal = '';
        if(index > 0){
            integer = num.substring(0,index);
            decimal = num.substring(index);
        }
        integer = integer.replace(/(\d{1,3})(?=(\d{3})+$)/g,"$1,");
        num = integer + decimal; //整数 + .小数
        if(/\.0+$/.test(decimal)){//判断 小数 是否为.N个0的形式
            num = integer;
        }
        return num;
    },
    getDemoChartJson(url){
        switch (url){
            case "../../../utils/template/data/city-bar.json":
                return City_bar;
            case "../../../utils/template/data/city-annular.json":
                return City_annular;
            case "../../../utils/chart_demo.json":
                return Chart_demo;
            case "../../../utils/template/data/com-annular.json":
                return Com_annular;
            case "../../../utils/template/data/com-bar.json":
                return Com_bar;
            case "../../../utils/template/data/com-line.json":
                return Com_line;
        }
    },
    // 获取用户拥有权限状态 checkSelf是否验证本人以及本人以上权限进入
    getUserState(authorizeSetting){
        // 获取用户对MD拥有的权限
        for(let i=0;i<authorizeSetting.length;i++){
            let mesg = authorizeSetting[i];
            if(mesg.entityName === "GUEST"){
                switch (mesg.permissionType){
                    case "SEARCH":
                        return "SEARCH";
                    case "READ":
                        return "READ";
                    case "READWRITE":
                        return "READWRITE";
                }
            }
        }
        return "PERSONAL";
    },
    //组件全屏和地图全屏设置
    fullScreenSetting(param,baseSetting,effectPointActive){
        let {fullScreen} = param;
        let style = {}
        if(fullScreen){
            param.fullScreen = false;
            // 通知返回默认状态
            style = {
                height: "400px",
                width: "500px",
                left: "500px",
                top: "300px"
            }
        }else{
            param.fullScreen = true;
            // 通知进行全屏
            let bodyWidth = baseSetting.width;
            let bodyHeight = baseSetting.height;
            style = {
                width: bodyWidth,
                height: bodyHeight,
                left:"0px",
                top:"0px",
                right:"",
                bottom:""
            }
        }
        //通过中心点的状态来判断是哪一个文件
        if(effectPointActive){
            //sceneWidgets.vue
            Bus.$emit("sceneSetting-sceneWidget",param.id,style);
        }else{
            Bus.$emit("mapSetting-mapWidget",param.id,style);
        }
    },
    // 组件缩放
    onResize(left, top, width, height){
        return {
            width: width + "px",
            height: height + "px",
            top: top + "px",
            left: left + "px"
        }
    }
};
export default CommonUtil;
