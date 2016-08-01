var st = {};
st.data = [
{ "label": "open", "value": 0 },
{ "label": "Identified", "value": 0 },
{ "label": "hold", "value": 0 },
{ "label": "need clarity", "value": 0 }
];

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
        var needclarity = response.data.length - open - identified - hold;
        st.data[0].value = open;
        st.data[1].value = identified;
        st.data[2].value = hold;
        st.data[3].value = needclarity;

        drawD3PieChart(".piechart", st.data, [0, 1, 2, 3, 4, 5]);
    })
});





function drawD3PieChart(sel, data, row_id_to_bucket_num) {
    // clear any previously rendered svg
    $(sel + " svg").remove();
    // compute total
    tot = 0;
    data.forEach(function (e) { tot += e.value; });
    var w = $(sel).width();
    var h = $(sel).height();
    var r = Math.min(w, h) / 2;
    var color = d3.scale.category20c();
    var vis = d3.select(sel).append("svg:svg").attr("data-chart-context", sel).data([data])
        .attr("width", w).attr("height", h).append("svg:g")
        .attr("transform", "translate(" + (w / 2) + "," + r + ")");
    var svgParent = d3.select("svg[data-chart-context='" + sel + "']");
    var pie = d3.layout.pie().value(function (d) { return d.value; });
    var arc = d3.svg.arc().outerRadius(r);
    var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
    arcs.append("svg:path")

		.attr("fill", function (d, i) {
		    return color(i);
		})
		.attr("stroke", "#fff")
		.attr("stroke-width", "1")
		.attr("d", function (d) {
		    //console.log(arc(d));
		    return arc(d);
		})
		.attr("data-legend", function (d) { return d.data.label; })
		.classed("slice", true)


    arcs.append("svg:text").attr("transform", function (d) {
        d.innerRadius = 0;
        d.outerRadius = r;
        return "translate(" + arc.centroid(d) + ")";
    }).attr("text-anchor", "middle").text(function (d, i) {
        return (data[i].value);
    }
	).attr("fill", "#fff")
    .classed("slice-label", true);

    legend = svgParent.append("g")
		.attr("class", "legend")
      //  .attr("fill","transparent")
        .attr("background-color", "green")
		.attr("transform", "translate(50,100)")
		.style("font-size", "20px")
		.call(d3.legend);
}