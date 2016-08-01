

var chartData = {
    type: "bar",
    //backgroundColor: "black",
    //legend: {
    //    verticalAlign: "bottom",
    //    align: "center",
    // },
    title: { "text": "Integrated Pulse  "},
    scaleX: { values: ["Open", "Identified", "Hold", "NeedClarity"] },
   // scaleY: { values: "0:200:10" },
    series: [
     {
         values: [], backgroundColor:"green yellow"
     }
    ]
};


    var app = angular.module('app', []);
    app.controller('controller1', function ($scope, $http) {
        $http.get("http://wipro.azurewebsites.net/api/integratedpulse/all").then(function (response) {
            console.log(response);
            $scope.myData = response.data;
            var open=0, identified=0, hold=0;
            for (i = 0; i < response.data.length; i++) {
               
                if (response.data[i].DemandStatus == "Open") {
                    open++;                    
                }
                else if (response.data[i].DemandStatus == "Identified") {
                    identified++;
                }
                else if (response.data[i].DemandStatus == "Hold") {
                    hold++;
                }
            }
            var needclarity = response.data.length - open - identified - hold;
            console.log(needclarity);
            console.log(open);
            console.log(identified);
            console.log(hold);
            chartData.series[0].values.push(open);
            chartData.series[0].values.push(identified);
            chartData.series[0].values.push(hold);
            chartData.series[0].values.push(needclarity);
            console.log(chartData.series[0].values);
            abc();
        })
    });

    
  function abc()
    {
        zingchart.render({
            id: 'chartDiv',
            data: chartData,
            height: 400,
            width: 600
        });
    }