var chartData = [
{ DemandStatus: 'open', NoOfPositions: 0 },
{ DemandStatus: 'identified', NoOfPositions: 0 },
{ DemandStatus: 'hold', NoOfPositions: 0 },
{ DemandStatus: 'needclarity', NoOfPositions: 0 },
];

var svgHeight = 300;
var svgWidth = 450;
var maxYaxis;
var barSpacing = 1;
var padding = { left: 30, right: 0, top: 20, bottom: 20 };


var app = angular.module('app', []);

app.controller('controller1', function ($scope, $http) {
    $http.get("http://wipro.azurewebsites.net/api/integratedpulse/all").then(function (response) {
        console.log(response);
        $scope.myData = response.data;
        var open = 0, identified = 0, hold = 0;
        for (i = 0; i < response.data.length; i++)
        {
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
        chartData[0].NoOfPositions = open;
        chartData[1].NoOfPositions = identified;
        chartData[2].NoOfPositions = hold;
        chartData[3].NoOfPositions = needclarity;
        var largest = Math.max.apply(Math, [open, identified, hold, needclarity]) + 10;
        console.log(largest);
        maxYaxis = largest;
        animateBarsUp();
    })
});


    function animateBarsUp() {
        var maxWidth = svgWidth - padding.left - padding.right;
        var maxHeight = svgHeight - padding.top - padding.bottom;

        // Define your conversion functions
        var convert = {
            x: d3.scale.ordinal(),
            y: d3.scale.linear()
        };

        // Define your axis
        var axis = {
            x: d3.svg.axis().orient('bottom'),
            y: d3.svg.axis().orient('left')
        };

        // Define the conversion function for the axis points
        axis.x.scale(convert.x);
        axis.y.scale(convert.y);

        // Define the output range of your conversion functions
        convert.y.range([maxHeight, 0]);
        convert.x.rangeRoundBands([0, maxWidth]);

        // Once you get your data, compute the domains
        convert.x.domain(chartData.map(function (d) {
            return d.DemandStatus;
        })
        );
        convert.y.domain([0, maxYaxis]);

        // Setup the markup for your SVG
        var svg = d3.select('.chart')
          .attr({
              width: svgWidth,
              height: svgHeight
          });

        // The group node that will contain all the other nodes
        // that render your chart
        var chart = svg.append('g')
          .attr({
              transform: function (d, i) {
                  return 'translate(' + padding.left + ',' + padding.top + ')';
              }
          });

        chart.append('g') // Container for the axis
          .attr({
              class: 'x axis',
              transform: 'translate(0,' + maxHeight + ')'
          })
          .call(axis.x); // Insert an axis inside this node

        chart.append('g') // Container for the axis
          .attr({
              class: 'y axis',
              height: maxHeight
          })
          .call(axis.y); // Insert an axis inside this node

        var bars = chart
          .selectAll('g.bar-group')
          .data(chartData)
          .enter()
          .append('g') // Container for the each bar
          .attr({
              transform: function (d, i) {
                  return 'translate(' + convert.x(d.DemandStatus) + ', 0)';
              },
              class: 'bar-group'
          });

        bars.append('rect')
              .attr({
                  y: maxHeight,
                  height: 0,
                  width: function (d) { return convert.x.rangeBand(d) - 1; },
                  class: 'bar'
              })
          .transition()
          .duration(1500)
          .attr({
              y: function (d, i) {
                  return convert.y(d.NoOfPositions);
              },
              height: function (d, i) {
                  return maxHeight - convert.y(d.NoOfPositions);
              }
          });

        return chart;
    }