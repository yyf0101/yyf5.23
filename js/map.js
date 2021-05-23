var ROOT_PATH = 'http://' + window.location.host + '/ncp/map';
var mapchart = echarts.init(document.getElementById('cont_pro_map'),'dark');
window.addEventListener('resize', () => {mapchart.resize();});
$(window).on("load", map());
function map() {
    $.get(ROOT_PATH + '/world.json', function(geoJson) {
        echarts.registerMap('world', geoJson);
        var xAxis_data = [];
        var setoptions = [];
        var city_name = [];
        var bar_data = [];      //直方图数据轴
        var map_data = [];
        //本身项目原因，当天数据为前一天统计值，故时间从前一天开始计算
        for (var i = 0; i < 17; i++) {
            city_name.push([]);
            bar_data.push([]);
            map_data.push([]);
            var start = moment().subtract('days', 17-i).format('YYYY-MM-DD');
            xAxis_data.push(start);
            var data = {
                "start": start,
            };
            $.ajax({
                url: 'http://*********/analyse/ncp',
                data: JSON.stringify(data),
                type: 'post',
                async: false,
                contentType: "application/json;charset=UTF-8",
                dataType: 'json',
                success: function(result) {
                    map_data[i].push(result);	             //第i天数据项，作为地图的数据项
                    function sortNumber(a, b) {
                        return a.value < b.value ? 1 : -1;
                    };
                    map_data[i][0].sort(sortNumber);
                    console.log(map_data[i]);
                    for (var j = 0; j < map_data[i][0].length; j++) {
                        city_name[i].push(map_data[i][0][j].name); //获取第i天中城市名称，作为直方图的Y轴
                        bar_data[i].push(map_data[i][0][j].value);
                    }
                }
            });
            setoptions.push({               //OptionS 是推送一个{}字典，字典中是一个series ，series中包含要呈现的图像
                xAxis: {                             //开始设置直方图
                    type: 'value',
                    show: false,
                },
                yAxis: {
                    type: 'category',
                    inverse:true,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: 'white',
                        }
                    },
                    data: city_name[i].slice(0,20),
                },
                series:[
                    {
                        name: 'Confirmed Cases',   //tooltip中使用
                        type: 'map',    //series 类型
                        mapType: 'world', // 地图显示，与初始化一致
                        top: '5%',     //位置调整
                        left: '3%',
                        right:'40%',
                        zoom: 1,
                        label: {
                            show: false
                        },
                        data: map_data[i][0]
                    },
                    {
                        type: 'bar',
                        // itemStyle: {
                        // barBorderRadius: 70,
                        // },
                        data:  map_data[i][0].slice(0,20),
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    var colorList = [{
                                        colorStops: [{
                                            offset: 0,
                                            color: '#f0515e'
                                        }, {
                                            offset: 1,
                                            color: '#ef8554'
                                        }]
                                    },
                                        {
                                            colorStops: [{
                                                offset: 0,
                                                color: '#3c38e4'
                                            }, {
                                                offset: 1,
                                                color: '#24a5cd'
                                            }]
                                        }
                                    ];
                                    if (params.dataIndex < 5) {
                                        return colorList[0]
                                    } else {
                                        return colorList[1]
                                    }
                                },
                                barBorderRadius: [0,15,15,0]
                            }
                        },
                        label:{
                            normal: {
                                show: true,
                                color:'white',
                                textBorderColor: '#ef8554',
                                textBorderWidth: 1
                            }
                        },
                    }]
            });
        };
        console.log('map_data:',city_name, bar_data);
        mapchart.setOption({
            baseOption: {
                backgroundColor:'#222222',
                timeline: {                          //设置timeline的baseoption
                    //loop: false,
                    axisType: 'category',
                    show: true,
                    autoPlay: true,
                    left: '5%',
                    right: '5%',
                    top: '90%',
                    width: '90%',
                    playInterval: 1000,
                    data: xAxis_data
                },                                   //timeline设置结束
                xAxis: {                             //开始设置直方图
                    min: 0,
                    max: 1000000,
                    show: false,
                },
                yAxis: {
                },
                grid: {                          //bar图的位置
                    left: '70%',
                    right: '10%',
                    top: '5%',
                    bottom: '10%',
                    width: '40%'
                },
                tooltip: {
                    formatter: function(e, t, n) {
                        return .5 == e.value ? e.name : e.seriesName + "<br />" + e.name + "：" + e.value
                    }
                },                             //直方图结束
                visualMap: {                   //开始设置地图
                    min: 1000,
                    max: 50000,
                    text: ['high', 'low'],
                    calculable: true,
                    realtime: true,
                    left:'40',
                    bottom:'130',
                    inRange: {
                        color: ['lightskyblue', 'yellow', 'orangered']
                    },
                    textStyle: {
                        color: 'white',
                        fontSize: 14,
                    },
                    seriesIndex: [0],
                },
                geo: {
                    label: {
                        normal: {
                            fontSize: "14",
                            color: "rgba(0,0,0,0.7)"
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            areaColor: "#f2d5ad",
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            borderWidth: 0
                        }
                    }
                },
                title: {
                    text: '全球新型冠状病毒确诊病例',
                    subtext:'         统计数据来自丁香园',
                    x: 'center',
                    y: 'top',
                    textAlign: 'left',
                    textStyle: {
                        color: 'white',
                    }
                },
                series: [               //设置baseoption中两个图的基本类型
                    {

                        type: 'map',
                        mapType: 'world',
                    },
                    {
                        name: '确诊病例',
                        'type': 'bar',
                        zlevel: 2,
                        barWidth: '40%',
                        label: {
                            normal: {
                                show: true,
                                fontSize: 14,
                                position: 'right',
                                formatter: '{c}'
                            }
                        },
                    },
                ],
            }, //baseoption结束
            options: setoptions
        });
    });}

mapchart.on('click', function(result) { //回调函数，点击时触发，参数params格式参加官方API
    var data = {
        "name": result.name,
    };
    $.ajax({
        url: 'http://*********/analyse/star',
        data: JSON.stringify(data),
        type: 'post',
        async: false,
        contentType: "application/json;charset=UTF-8",
        dataType: 'json',
        success: function(result) {
            $('.modal-body').empty();
            $('#myModal').modal();
            for (var k = 0; k < result.length; k++) {
                var html = "<div class=\"row\"><div class=\"col-xs-6\"><img class=\"card_picture\" src=\""+result[k].pic+"\"></div><div class=\"col-xs-6\"><h3 class=\"card_title\">"+result[k].names+"</h3><p class=\"card_text\">"+result[k].occupution+"</p></div></div> </div> ";
                var $html = $(html);
                $(".modal-body").append($html);
            }
        }
    });
});
