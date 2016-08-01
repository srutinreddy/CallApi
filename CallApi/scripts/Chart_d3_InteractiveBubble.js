

function graph() {
    var bubbleChart = new d3.svg.BubbleChart({
        supportResponsive: true,
        size: 600,
        innerRadius: 600 / 3.5,
        radiusMin: 50,

        data: {
            items:
                [
              { text: "Total", count: "265" },
              { text: "Open", count: "160" },
              { text: "Identified", count: "043" },
              { text: "Hold", count: "03" },
              { text: "NeedClarity", count: "059" },              
                ],
            
            eval: function (item) { return item.count; },
            classed: function (item) { return item.text.split(" ").join(""); }
        },

        plugins: [
          {
              name: "central-click",
              options: {
                  text: "(See more detail)",
                  style: {
                      "font-size": "12px",
                      "font-style": "italic",
                      "font-family": "Source Sans Pro, sans-serif",
                      //"font-weight": "700",
                      "text-anchor": "middle",
                      "fill": "white"
                  },
                  attr: { dy: "65px" },
                  centralClick: function () {
                      alert("Here is more details!!");
                  }
              }
          },
          {
              name: "lines",
              options: {
                  format: [
                    {// Line #0
                        textField: "count",
                        classed: { count: true },
                        style: {
                            "font-size": "28px",
                            "font-family": "Source Sans Pro, sans-serif",
                            "text-anchor": "middle",
                            fill: "white"
                        },
                        attr: {
                            dy: "0px",
                            x: function (d) { return d.cx; },
                            y: function (d) { return d.cy; }
                        }
                    },
                    {// Line #1
                        textField: "text",
                        classed: { text: true },
                        style: {
                            "font-size": "14px",
                            "font-family": "Source Sans Pro, sans-serif",
                            "text-anchor": "middle",
                            fill: "white"
                        },
                        attr: {
                            dy: "20px",
                            x: function (d) { return d.cx; },
                            y: function (d) { return d.cy; }
                        }
                    }
                  ],
                  centralFormat: [
                    {// Line #0
                        style: { "font-size": "50px" },
                        attr: {}
                    },
                    {// Line #1
                        style: { "font-size": "30px" },
                        attr: { dy: "40px" }
                    }
                  ]
              }
          }]
    });
};




var app = angular.module('app', []);
app.controller('controller1', function ($scope, $http) {
    $http.get("http://wipro.azurewebsites.net/api/integratedpulse/all").then(function (response) {
        console.log(response);
        $scope.myData = response.data;
        var open = 0, identified = 0, hold = 0;
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
        graph();
        
        var needclarity = response.data.length - open - identified - hold;
        //chartData[0].NoOfPositions = open;
        //chartData[1].NoOfPositions = identified;
        //chartData[2].NoOfPositions = hold;
        //chartData[3].NoOfPositions = needclarity;
        //var largest = Math.max.apply(Math, [open, identified, hold, needclarity]) + 10;
        console.log("open=" + open, "ide=" + identified, "hold" + hold, "nc" + needclarity);
        console.log();
        //maxYaxis = largest;
        //animateBarsUp();
    })
});
