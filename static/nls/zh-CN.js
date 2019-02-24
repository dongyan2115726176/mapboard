window.lang="zh-CN";
window.locales = {
    //common
    width: "宽度",//
    height: "高度",//
    componentSize: "组件尺寸",//
    fontColor: "字体颜色",//
    fontSize: "字体大小",//
    promptGetDataFailed: "获取数据失败，请检查网络后重试",//Map.vue
    refreshFrequency: "刷新频率",//LiveDataForFile
    frequency: "请输入刷新频率",//
    refreshSpeed: "刷新步长(s)",//LiveDataForFile
    speed: "请输入刷新步长",//
    confirm: "确定",//LiveDataForApi LiveDataForFile LiveDataForServer
    unit: "单位",//indicator.vue indicatorSetting.vue
    inputMapboxAdr: "请输入MapBox地图地址",//LiveDataForApi LiveDataForServer
    serviceAdress: "服务地址",//LiveDataForApi LiveDataForServer
    dataSource: "数据来源",//chartSetting.vue indicatorSetting.vue
    demonstrationData:"示范数据",

    //App.vue
    getConfigErrorMsg: "获取配置文件错误,请重新确认",
    updateSuccess: "更新成功",
    saveSuccess: "保存成功,2秒后页面将自动跳转",
    saveError: "保存失败,请检查权限后重试",
    saveDashBoard:"保存大屏",
    bestChrome: "为保证效果，建议使用Chrome浏览器",
    seleceteTemplate:"模版选择",

    // Header.vue
    goBackToEdit: "返回",
    save: "保存",
    login: "登录",
    noLogin:"未登录",
    register: "立即注册",
    loginSuccess: "登录成功",
    loginError: "用户名密码错误，请重试",
    userName: "用户名",
    passWord: "密码",
    enterError: "请输入用户名和密码",
    saveAs:"另存为",
    userLoginMes:"登录状态已失效，请重新登录！",
    preview:"预览",
    share:"分享",
    userShareMes:"请先保存大屏,在进行分享！",

    // SelectPanel.vue
    dashBoard: "大屏",
    map: "地图",
    scene:"场景",
    data: "数据",
    chart: "图表",
    indicator: "指标",
    text: "文本",
    other: "其他",

    // SettingPanel.vue
    setting:"设置",
    propertySettings:"属性设置",
    listSetting:'列表设置',

    //Chart.vue
    commonChart: "常规图表",
    bar: "直方图",
    xbar: "条形图",
    line: "折线图",
    pie: "饼状图",
    annular: "环形图",
    radar: "雷达图",
    demonstrationChart:"示范图表",

    //DashBoard.vue
    addedComponents: "已添加组件",
    addComponents:"请添加组件",

    //Data.vue
    selecetedDatas: "已选数据",
    myDatas: "门户数据",
    promptRepetitiveData: "该数据已添加，无需重复添加",
    promptFormatError: "仅支持CSV,JSON,EXCEL文件格式数据",
    promptGetMyDatasFailed: "获取数据失败，请检查登录状态后重试",
    addApiData:"添加API数据",

    //Indicator.vue
    selectIndicator: "选择指标",
    statisticsIndicator: "统计指标",
    indicatorTitle: "指标标题",
    indicatorNum: "统计数值",

    //LiveDataSetting.vue
    dataSourceType: "数据类型",
    choose: "请选择",
    service: "服务型",
    file: "文件型",

    //map.vue
    addLiveDataMap: "+添加数据流地图",
    searchPortalMap: "门户地图",
    promptSearchResultEmpty: "没有查询到符合条件的地图",
    promptPrivateMap: "该地图未公开，其他用户可能无法查看！",
    LiveData: "时态数据",

    //scene.vue
    sceneList: "场景列表",
    searchPortalScene: "门户场景",
    sceneSearchResultEmpty: "没有查询到符合条件的场景",
    promptPrivateScene: "该场景未公开，请公开后重试",
    supportOneScene:"暂时仅支持添加一个场景组件！",

    //MapWidget.vue
    createdMapErr:"地图加载失败，请确保在数据上图中能正常打开！",
    tipLabel: "展开/收起",

    //Other.vue
    otherType:"其他类型",
    image:"图片",

    //Text.vue
    selectTextType: "选择文本类型",
    commonChar: "普通文字",
    font:"字体",
    style:"字体粗细",
    lighter:"纤细",
    normal:"标准",
    bolder: "加粗",
    microsoftYaHei:"微软雅黑",
    time:"时间",
    realTime:"实时时间",
    textList:"文本列表",
    header:'表头',
    dataColumn:"数据列",
    refreshMethods:'刷新方式',
    listRows:'列表行数',

    //LiveDataForApi.vue
    getDataErr:"获取数据失败，请检查地址后重试",
    dataName:"数据名称",
    dataRes:"响应结果",
    dataAddress:"URL",
    supportHint:"仅支持解析JSON格式的相应结果！",
    crossAgent:"使用iPortal代理请求",
    crossDomain:"跨域问题处理方法",

    //LiveDataForFile
    mapUrl: "地图地址",
    dataFile: "数据文件",
    filtRate: "可输入文件名过滤(暂仅支持公开的CSV数据)",
    layerName: "图层名称",
    idField: "id字段",
    longitudeField: "经度字段",
    latitudeField: "纬度字段",
    timeField: "时间字段",
    selectId: "请选择id字段索引",
    selectLongitude: "请选择经度字段索引",
    selectLatitude: "请选择纬度字段索引",
    selectTime: "请选择时间字段索引",

    //LiveDataForServer
    inputServiceAdr: "填写iserver数据服务至数据集层",
    mapboxAdress: "mapBox地图地址",
    idName: "id字段名称",
    timeName: "时间字段名称",
    startTime: "起始时间",
    endTime: "结束时间",
    start: "查询的起始时间(2018-07-10 10:00:00)",
    end: "查询的结束时间(2018-07-10 16:00:00)",
    howOften: "多长时间渲染一次数据",
    verificationFailed: "参数验证失败！",
    requestFailed: "请求验证失败！",

    // chartSetting.vue
    allData: "全部",
    chartTitle: "图表标题",
    xAxis: "X轴数据",
    xAxisUnit: "X轴单位",
    xSlant: "开启X轴文字倾斜",
    yAxis: "Y轴数据",
    yAxisUnit: "Y轴单位",
    yAxisMargin: "Y轴边距",
    ySlant: "开启Y轴文字倾斜",
    yStatistics: "开启Y轴统计",
    chartsColor: "图表颜色",
    selectDataNum: "数据展示数量",
    total: "共计",
    article: "条",
    sortord: "排序方式",
    ascending: "升序",
    descending: "降序",
    unsort: "不排序",
    legendPosition: "图例位置",
    top: "在图表下方",
    bottom: "在图表上方",
    ascending: "升序",
    descending:"降序",
    unsort: "不排序",
    closeLegend: "不显示图例",
    count: "计数",
    second:"秒",
    minute:"分钟",
    date:"日期",
    promptText:"提示文字",
    autoPlay:"自动播放",
    maxDataNume:"数据峰值",
    promptTextIcon:"鼠标滑动/开启自动播放时，环形图中心文字大小！",
    lineSmooth:"折线圆滑",

    //DashBoardSetting.vue
    mapDashboardName: "大屏标题",
    setSize: "屏幕尺寸",
    backgroundType: "背景填充类型",
    colorType: "颜色类型",
    pure: "纯色",
    gradual: "渐变色",
    color: "背景颜色",
    widgetColor:"组件背景",
    currentBackground: "当前背景图",
    themeColor: "颜色风格",
    blackTheme: "暗色",
    whiteTheme: "亮色",
    colorFill: "颜色填充",

    //indicatorSetting.vue
    headline: "标题",
    title: "标题名称",
    data: "数据",
    dataField: "指标字段",
    indicatorUnit: "指标单位",
    staticData: "静态数据",
    px:"像素",
    onceSecond:"秒一次",
    autoRefresh:"自动刷新",

    //MapSetting.vue
    zoomLevel: "缩放级别",
    centralSetting: "中心点",
    longitude: "经度",
    latitude: "纬度",
    pitch: "倾斜度",
    mapWidget: "地图控件",
    zoom: "缩放",
    plottingScale: "比例尺",
    model:"模式",
    mapFullScreen: "全屏模式",
    mapInitState:"窗口模式",
    overViewMap:"鹰眼",

    //SceneSetting.vue
    scanEffect: "场景扫描",
    circleEffect: "圆形扫描",
    lineEffect: "线形扫描",
    closed: "关闭",
    period:"扫描周期",
    effectSpeed: "扫描速度",
    selectPoint: "选择中心点",

    //TextSetting.vue
    textContent: "文本内容",
    align:"对齐方式",
    alignCenter:"居中",
    alignLeft:"左对齐",
    alignRight:"右对齐",
    textIndent:"首行缩进",
    lineHeight:"字体行高",

    //chartDataUtil.js
    readDataError: "无法解析该数据，请检查数据内容后重试!",

    //LiveDataForDataflow.vue
    dataFlow:"数据流服务",
    dataFlowUrl:"数据流服务地址",
    dataFlowTitle:"DataFlow资源是 SuperMap iServer REST 服务中，数据流服务的根节点",
    iserverMapUrl:"请填写iserver地图服务地址",
    epsgObject:"投影信息",
    fillIdField:"请填写id字段",
    emptyDataFlowParams:"必填字段为空，请填写后重试！",
    rotateDeg:"旋转角度字段",
    rotateDegPlaceholder:"可根据该字段自动旋转图标角度(选填)",
    iconChoose:"图标选择",
    epsgTips:"数据投影与地图投影需保持一致！",
    currentWebSocketError:"数据流服务地址验证失败，请检查后重试！",

    // UserConfig.vue
    label:"标签",
    labelTips:"多个标签用逗号分隔 , 最多6个",
    describe:"描述",

    // ImageSetting.vue
    imageTitle:"图片标题",
    addImage:"点击添加图片",
    addImageSupportFirst:"支持jpg/gif/png格式",
    addImageSupportSecond:"RGB格式,不超过10M",
    uploadImage:"上传图片",
    uploadLogin:"上传失败,请先登录后重试！",
    uploadNoSupport:"上传文件类型暂不支持！",
    uploadReLogin:"上传失败,登录状态已失效！",
    imageErr:"文件错误，请检查后重试！",
    changeImage:"点击更换图片",

    //SceneWidget.vue
    selectposition: "点击选择扫描中心点",

    //TimeSetting.vue
    timeDate:"日期",
    timeDateSecond:"日期+时分秒",
    timeDateSecondWeek:"日期+时分秒+星期",

    // Share.vue
    public:"公开",
    publicSearch:"所有用户可检索",
    publicRead:"所有用户可查看",
    publicReadWrite:"所有用户可编辑(仅限登录用户)",
}