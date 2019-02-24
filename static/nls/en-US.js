window.lang="en-US";
window.locales= {
    //common
    width: "Witdth",
    height: "Height",
    componentSize: "Component Size",
    fontColor: "Font Color",
    fontSize: "Font Size",
    promptGetDataFailed: "Failed to get data, please check and try again",
    refreshFrequency: "Refresh Interval",
    frequency: "Input refresh interval",
    refreshSpeed: "Input refresh speed",
    speed: "Speed",
    confirm: "Confirm",
    unit: "Unit",//indicator.vue indicatorSetting.vue
    inputMapboxAdr: "Please input MapBox address",//LiveDataForApi LiveDataForServer
    serviceAdress: "Service Address",//LiveDataForApi LiveDataForServer
    dataSource: "Data Source",//chartSetting.vue indicatorSetting.vue
    demonstrationData:"Sample Data",

    //App.vue
    getConfigErrorMsg: "Error, please check the network and try again",
    updateSuccess: "Update successfully",
    saveSuccess: "Saved successfully, the page will automatically jump after 2 seconds",
    saveError: "Save failed, please check your permission and try again",
    saveDashBoard:"Save DashBoard",
    bestChrome: "To ensure performance, we recommend using the Chrome browser.",
    seleceteTemplate:"Template selection",

    // Header.vue
    goBackToEdit: "Back",
    save: "Save",
    login: "Login",
    noLogin:"Not logged",
    register: "Sign up now",
    loginSuccess: "Login succeeded",
    loginError: "Username or password is wrong, please try again",
    userName: "Username",
    passWord: "Password",
    enterError: "Please input username and password",
    saveAs:"Save as",
    userLoginMes:"The login status has expired, please login again!",
    preview:"Preview",
    share:"Share",
    userShareMes:"Save the Mapdashboard and share it!",

    // SelectPanel.vue
    dashBoard: "Dashboard",
    map: "Map",
    scene:"Scene",
    data: "Data",
    chart: "Chart",
    indicator: "Indicator",
    text: "Text",
    other: "Others",

    // SettingPanel.vue
    setting:"Setting",
    propertySettings:"Property Settings",

    //Chart.vue
    commonChart: "Charts",
    bar: "Column",
    xbar: "Bar",
    line: "Line",
    pie: "Pie",
    annular: "Doughnut",
    radar: "Radar Chart",
    demonstrationChart:"示范图表",//界面无，暂不翻，不懂啥叫示范图表

    //DashBoard.vue
    addedComponents: "Existing Components",
    addComponents:"Please add components",

    //Data.vue
    selecetedDatas: "Selected Data",
    myDatas: "Portal Data",
    promptRepetitiveData: "This data already exists!",
    promptFormatError: "Only support CSV,JSON and EXCEL file",
    promptGetMyDatasFailed: "Failed to acquire data, please check the login status and try again",
    addApiData:"Add Api Data",

    //Indicator.vue
    selectIndicator: "Indicator Type",
    statisticsIndicator: "Indicator",
    indicatorTitle: "Indicator title",
    indicatorNum: "Statistical value",

    //LiveDataSetting.vue
    dataSourceType: "Data Type",
    choose: "Please select...",
    service: "Service",
    file: "File",

    //map.vue
    addLiveDataMap: "+Add a Dataflow Map",
    searchPortalMap: "Search Map",
    promptSearchResultEmpty: "No maps were found!",
    promptPrivateMap: "The current map is private. Other users may not be able to view!",
    LiveData: "Live Data",

    //scene.vue
    sceneList: "Scenes List",
    searchPortalScene: "Search Scene",
    sceneSearchResultEmpty: "No scenes were found!",
    promptPrivateScene: "The current scene is private. Please set to public, then try again!",
    supportOneScene:"Only support one scene component added!",

    //MapWidget.vue
    createdMapErr:"Failed to load map, please make sure that map can be displayed normally in DataViz!",
    tipLabel:"Open/Close",

    //Other.vue
    otherType:"Other type",
    image:"Image",

    //Text.vue
    selectTextType: "Text type",
    commonChar: "Simple text",
    font:"Font",
    style:"Style",
    lighter:"lighter",
    normal:"normal",
    bolder: "bolder",
    microsoftYaHei:"Microsoft YaHei",
    time:"Time",
    realTime:"Real time",
    textList: "Text list",
    header:'table Header',
    dataColumn:'data Column',
    refreshMethods:'refresh Methods',
    listRows:'list Rows',
    
    //LiveDataForApi.vue
    getDataErr:"Failed to retrieve data. Please check the address and try again.",
    dataName:"Name",
    dataRes:"Result",
    dataAddress:"Data url",
    supportHint:"It only supports the results in parsing JSON format!",
    crossAgent:"Proxy requests using iPortal",
    crossDomain:"Cross domain problem processing method",

    //LiveDataForFile
    mapUrl: "Map Url",
    dataFile: "Data File",
    filtRate: "File Name (Currently only support public CSV data)",
    layerName: "Layer Name",
    idField: "ID",
    longitudeField: "Longitude",
    latitudeField: "Latitude",
    timeField: "Time",
    selectId: "Please select ID field",
    selectLongitude: "Please select longitude field",
    selectLatitude: "Please select latitude field",
    selectTime: "Please select time field",

    //LiveDataForServer
    inputServiceAdr: "Specify to the specific dataset level of the iServer data service address",
    mapboxAdress: "mapbox Address",
    idName: "ID",
    timeName: "Time",
    startTime: "Start Time",
    endTime: "End Time",
    start: "2018-07-10 10:00:00",
    end: "2018-07-10 16:00:00",
    howOften: "Refresh Interval",
    verificationFailed: "Parameter verification failed!",
    requestFailed: "Service is not available!",

    // chartSetting.vue
    allData: "All",
    chartTitle: "Title",
    xAxis: "X Axis data",
    xAxisUnit: "X Axis Unit",
    xSlant: "Enable italic on X axis",
    yAxis: "Y Axis data",
    yAxisUnit: "Y Axis Unit",
    yAxisMargin: "Margin-left",
    ySlant: "Enable italic on Y axis",
    yStatistics: "Enable statistics on Y axis",
    chartsColor: "Chart Color",
    selectDataNum: "Displayed records",
    total: "Total: ",
    article: "",
    sortord: "Sort",
    ascending: "Ascending",
    descending: "Descending",
    unsort: "Unsort",
    legendPosition: "Legend Position",
    top: "Below the chart",
    bottom: "Above the chart",
    ascending: "Sort Smallest to Largest",
    descending:"Sort Largest to Smallest",
    unsort: "Unsort",
    closeLegend: "Not show",
    count: "Count",
    second:"Second",
    minute:"Minute",
    date:"Date",
    promptText:"Prompt text",
    autoPlay:"Auto play",
    maxDataNume:"Max Data",
    promptTextIcon:"When the mouse slides/turns on the auto play, the size of the center text in the ring chart",
    lineSmooth:"Smooth line",

    //DashBoardSetting.vue
    mapDashboardName: "DashBoard Title",
    setSize: "Size Settings",
    backgroundType: "Background Fill Type",
    colorType: "Color type",
    pure: "Solid Color",
    gradual: "Gradient Color",
    color: "Background Color",
    widgetColor:"Widget Color",
    currentBackground: "Current Background",
    themeColor: "Style",
    blackTheme: "Dark",
    whiteTheme: "Bright",
	colorFill: "Fill with color",

    //indicatorSetting.vue
    headline: "Title",
    title: "Tile Name",
    data: "Data",
    dataField: "Numeric Field",
    indicatorUnit: "Indicator Unit",
    staticData: "Static Number",
    px:"px",
    onceSecond:"/Second",
    autoRefresh:"Refresh",

    //MapSetting.vue
    zoomLevel: "Level",
    centralSetting: "Center point",
    longitude: "Lng",
    latitude: "Lat",
    pitch: "Tilt Angel",
    mapWidget: "Map control",
    zoom: "Zoom",
    plottingScale: "Scales",
    model:"Model",
    mapFullScreen: "Full",
    mapInitState:"Window",
    overViewMap:"overView",

    //SceneSetting.vue
    scanEffect: "Scan-Effect",
    circleEffect: "Circle",
    lineEffect: "Line",
    closed: "Closed",
    period:"Period",
    effectSpeed: "Speed",
    selectPoint: "Position",

    //TextSetting.vue
    textContent: "Text content",
    align:"Align",
    alignCenter:"Center",
    alignLeft:"Left",
    alignRight:"Right",
    textIndent:"Indent",
    lineHeight:"Font height",

    //chartDataUtil.js
    readDataError: "Unable to parse the data, please check the data content and try again.",

    //LiveDataForDataflow.vue
    dataFlow:"Data Flow service",
    dataFlowUrl:"Data Flow Service Url",
    dataFlowTitle:"The root node of Data Flow Service",
    iserverMapUrl:"Input one map service address from iServer",
    epsgObject:"EpsgCode",
    fillIdField:"Input the id field of the data",
    emptyDataFlowParams:"The required fields are empty. Please fill in and retry!",
    rotateDeg:"Rotate Degree",
    rotateDegPlaceholder:"Rotate icon angle according the field(Optional)",
    iconChoose:"Icon",
    epsgTips:"Data and map must have the same coordinate system!",
    currentWebSocketError:"Dataflow url verification failed!",

    // UserConfig.vue
    label:"Label",
    labelTips:"Six tags at most,separated width comma",
    describe:"describe",

    // ImageSetting.vue
    imageTitle:"Image title",
    addImage:"Add image",
    addImageSupportFirst:"Support jpg/gif/png",
    addImageSupportSecond:"RGB format,No more than 10M",
    uploadImage:"Upload",
    uploadLogin:"Upload failed. Login first and try again!",
    uploadNoSupport:"Upload file type temporarily support!",
    uploadReLogin:"Upload failed. Login status is invalid!",
    imageErr:"File error. Please check and retry！",
    changeImage:"Change image",

    //SceneWidget.vue
    selectposition: "Click to select center",

    //TimeSetting.vue
    timeDate:"DD-MM-YY",
    timeDateSecond:"hh:mm:ss DD-MM-YY",
    timeDateSecondWeek:"hh:mm:ss Week DD-MM-YY",

    // Share.vue
    public:"Public",
    publicSearch:"All users can search",
    publicRead:"All users can view",
    publicReadWrite:"All Login users can edit",
}