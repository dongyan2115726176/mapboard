import themeColorImg1 from '../assets/images/themeColor1.png';
import themeColorImg2 from '../assets/images/themeColor2.png';
import themeColorImg3 from '../assets/images/themeColor3.png';
import themeColorImg4 from '../assets/images/themeColor4.png';
import themeColorImg5 from '../assets/images/themeColor5.png';
import themeColorImg6 from '../assets/images/themeColor6.png';
import themeColorImg7 from '../assets/images/themeColor7.png';
import themeColorImg8 from '../assets/images/themeColor8.png';
import themeColorImg9 from '../assets/images/themeColor9.png';
import themeColorImg10 from '../assets/images/themeColor10.png';
import themeColorImg11 from '../assets/images/themeColor11.png';
import themeColorImg12 from '../assets/images/themeColor12.png';
import themeColorImg13 from '../assets/images/themeColor13.png';
import echarts from "echarts"

const themeStyle = [
    {
        label:"themeG-W",
        image:themeColorImg11,
        title:"绿色渐变",
        themeStyle:{
            theme:"blackTheme",
            chart:{
                title:"#ffffff",
                //body的第一个值要保证唯一性，setting中全靠这个值看判断当前颜色风格；
                body:["#9AEAF4","#3097AB","#1F717F","#165A65","#064049"],
                heighLight:"#A8CFFF",
                normal: [{
                    //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#F0FEFF'},
                            {offset: 1, color: '#9AEAF4'}
                        ]
                    )
                },{color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#BAFAFF'},
                        {offset: 1, color: '#3097AB'}
                    ]
                )},{color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#C1FFFB'},
                            {offset: 1, color: '#1F717F'}
                        ]
                    )
                },{color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#AAFAF9'},
                            {offset: 1, color: '#165A65'}
                        ]
                    )
                },{color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#71E2E3'},
                            {offset: 1, color: '#064049'}
                        ]
                    )
                }],
                emphasis: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#9BF1FF'},
                            {offset: 1, color: '#9BF1FF'}
                        ]
                    )
                }
            },
            text:"#ffffff",
            indicator:{
                title:"#ffffff",
                body:"#286069"
            },
            textList:{
                title:"#353535",
                body:"#3FB1E3"
            }
        }
    },
    {
        label:"themeB-W",
        image:themeColorImg10,
        title:"蓝色渐变",
        themeStyle:{
            theme:"blackTheme",
            chart:{
                title:"#ffffff",
                body:["#00CDF1","#338FFF","#1C55FF","#243BCC","#0C75FF"],
                heighLight:"#A8CFFF",
                normal: [{
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#CDFFFD'},
                            {offset: 1, color: '#00CDF1'}
                        ]
                    )
                },{color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#C2EBFF'},
                        {offset: 1, color: '#338FFF'}
                    ]
                )},{color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#B4DEFF'},
                        {offset: 1, color: '#1C55FF'}
                    ]
                )
                },{color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#C0DDFF'},
                        {offset: 1, color: '#243BCC'}
                    ]
                )
                },{color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#8AF5FD'},
                        {offset: 1, color: '#0C75FF'}
                    ]
                )
                }],
                emphasis: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#A8CFFF'},
                            {offset: 1, color: '#A8CFFF'}
                        ]
                    )
                }
            },
            text:"#ffffff",
            indicator:{
                title:"#ffffff",
                body:"#499BFF"
            },
            textList:{
            	title:"#ffffff",
                body:"#286069"
            }
        }
    },{
        label:"themeR-Y",
        image:themeColorImg12,
        title:"橙红渐变",
        themeStyle:{
            theme:"blackTheme",
            chart:{
                title:"#ffffff",
                body:["#FF8417","#F05940","#BE3144","#882241","#770000"],
                heighLight:"#A8CFFF",
                normal: [{
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#FFE97F'},
                            {offset: 1, color: '#FF8418'}
                        ]
                    )
                },{color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#FDD163'},
                        {offset: 1, color: '#F05940'}
                    ]
                )},{color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#FF8484'},
                        {offset: 1, color: '#BE3144'}
                    ]
                )
                },{color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#FF7979'},
                        {offset: 1, color: '#882241'}
                    ]
                )
                },{color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#FF7948'},
                        {offset: 1, color: '#770000'}
                    ]
                )
                }],
                emphasis: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#FFFAE3'},
                            {offset: 1, color: '#FFFAE3'}
                        ]
                    )
                }
            },
            text:"#ffffff",
            indicator:{
                title:"#ffffff",
                body:"#BE3144"
            },
            textList:{
                title:"#ffffff",
                body:"#499BFF"
            }
        }
    },{
        label:"themeP-W",
        image:themeColorImg13,
        title:"紫色渐变",
        themeStyle:{
            theme:"blackTheme",
            chart:{
                title:"#ffffff",
                body:["#7B6CF5","#5432D3","#2F2AA4","#8B3B86","#9740B1"],
                heighLight:"#A8CFFF",
                normal: [{
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#EFDBFF'},
                            {offset: 1, color: '#7B6CF6'}
                        ]
                    )
                },{color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#D1A8FF'},
                        {offset: 1, color: '#5432D3'}
                    ]
                )},{color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#B7C3FF'},
                        {offset: 1, color: '#2F2AA4'}
                    ]
                )
                },{color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#E5D4E2'},
                        {offset: 1, color: '#8B3B86'}
                    ]
                )
                },{color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#F9D8FF'},
                        {offset: 1, color: '#9740B1'}
                    ]
                )
                }],
                emphasis: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#BEB6FF'},
                            {offset: 1, color: '#BEB6FF'}
                        ]
                    )
                }
            },
            text:"#ffffff",
            indicator:{
                title:"#ffffff",
                body:"#7B6CF6"
            },
            textList:{
                title:"#ffffff",
                body:"#499BFF"
            }
        }
    },
    {
        label:"themeA",
        image:themeColorImg1,
        title:"经典黑色",
        themeStyle:{
            theme:"blackTheme",
            chart:{
                title:"#ffffff",
                body:["#15D1F2","#499BFF","#2C61FF","#243BCC","#67A9FF"],
                heighLight:"#A8CFFF"
            },
            text:"#ffffff",
            indicator:{
                title:"#ffffff",
                body:"#499BFF"
            },
            textList:{
                title:"#ffffff",
                body:"#7B6CF6"
            }
        }
    },
    {
        label:"themeB",
        title:"抹红黑色",
        image:themeColorImg2,
        themeStyle:{
            theme:"blackTheme",
            chart:{
                title:"#ffffff",
                body:["#E69D87","#759AA0","#DD6B66","#8EC1A8","#EEDD78"],
                heighLight:"#E9E9E9"
            },
            text:"#ffffff",
            indicator:{
                title:"#ffffff",
                body:"#DD6B66"
            },
            textList:{
                title:"#ffffff",
                body:"#499BFF"
            }
        }
    },
    {
        label:"themeC",
        image:themeColorImg3,
        title:"墨绿黑色",
        themeStyle:{
            theme:"blackTheme",
            chart:{
                title:"#ffffff",
                body:["#BCE4E9","#7AC2D0","#53A8B6","#2D808D","#F1FDFF"],
                heighLight:"#9BF1FF"
            },
            text:"#ffffff",
            indicator:{
                title:"#ffffff",
                body:"#2D808D"
            },
            textList:{
                title:"#ffffff",
                body:"#DD6B66"
            }
        }
    },
    {
        label:"themeD",
        image:themeColorImg4,
        title:"浅蓝黑色",
        themeStyle:{
            theme:"blackTheme",
            chart:{
                title:"#BBE7FF",
                body:["#00E9FF","#BBE7FF","#6AE5C1","#46ABFF","#363EFF"],
                heighLight:"#759CFF"
            },
            text:"#BBE7FF",
            indicator:{
                title:"#BBE7FF",
                body:"#3690FF",
            },
            textList:{
                title:"#ffffff",
                body:"#2D808D"
            }
        }
    },
    {
        label:"themeE",
        image:themeColorImg5,
        title:"浅灰黑色",
        themeStyle:{
            theme:"blackTheme",
            chart:{
                title:"#ffffff",
                body:["#D3DDE8","#BACBDB","#8894A0","#52606D","#F2F5F8"],
                heighLight:"#FFFFFF"
            },
            text:"#F2F5F8",
            indicator:{
                title:"#F2F5F8",
                body:"#BACBDB"
            },
            textList:{
                title:"#BBE7FF",
                body:"#3690FF",
            }
        }
    },
    {
        label:"themeF",
        image:themeColorImg6,
        title:"深紫黑色",
        themeStyle:{
            theme:"blackTheme",
            chart:{
                title:"#ffffff",
                body:["#7B6CF6","#5432D3","#241F92","#8B3B86","#E6A5FF"],
                heighLight:"#BEB6FF"
            },
            text:"#ffffff",
            indicator:{
                title:"#ffffff",
                body:"#7B6CF6"
            },
            textList:{
                title:"#F2F5F8",
                body:"#BACBDB"
            }
        }
    },
    {
        label:"themeG",
        image:themeColorImg7,
        title:"深蓝白色",
        themeStyle:{
            theme:"whiteTheme",
            chart:{
                title:"#353535",
                body:["#243BCC","#2C61FF","#499BFF","#15D1F2","#67A9FF"],
                heighLight:"#A8CFFF"
            },
            text:"#353535",
            indicator:{
                title:"#353535",
                body:"#499BFF"
            },
            textList:{
                title:"#ffffff",
               body:"#7B6CF6"
           }
        }
    },
    {
        label:"themeH",
        image:themeColorImg8,
        title:"浅青白色",
        themeStyle:{
            theme:"whiteTheme",
            chart:{
                title:"#353535",
                body:["#3FB1E3","#6CE6C1","#626C91","#A0A7E6","#97DEE8"],
                heighLight:"#83E4FF"
            },
            text:"#353535",
            indicator:{
                title:"#353535",
                body:"#3FB1E3"
            },
            textList:{
                title:"#353535",
                body:"#499BFF"
            }
        }
    },
    {
        label:"themeI",
        image:themeColorImg9,
        title:"深红白色",
        themeStyle:{
            theme:"whiteTheme",
            chart:{
                title:"#770000",
                body:["#F05940","#BE3144","#882241","#770000","#FF8418"],
                heighLight:"#FF9789"
            },
            text:"#770000",
            indicator:{
                title:"#770000",
                body:"#BE3144"
            },
            textList:{
                title:"#353535",
                body:"#3FB1E3"
            }
        }
    }
]
export default themeStyle;