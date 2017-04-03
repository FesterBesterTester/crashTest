// requires d3.js

var WIDTH = 960;
var HEIGHT = 250;

var margin = {top: 40, right: 40, bottom: 40, left: 70};
var width = WIDTH - margin.left - margin.right;
var height = HEIGHT - margin.top - margin.bottom;


function initSVGs(svgIDs)
{
  for (svgID of svgIDs)
  {
    var svg = d3.select(svgID);
    svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
}


function getSVGGroup(svgID)
{
  return d3.select(svgID + " g");
}


var parseTime = d3.timeParse("%d-%b-%y");

var xAxis = d3.scaleTime()
    .rangeRound([0, width]);

var yAxis = d3.scaleLinear()
    .rangeRound([height, 0]);

var d3_line = d3.line()
    .x(function(d) { return xAxis(d.x); })
    .y(function(d) { return yAxis(d.y); });


function extent(data)
{
  var x = d3.extent(data, function(d) { return d.x });
  var y = d3.extent(data, function(d) { return d.y });
  var z = d3.extent(data, function(d) { return d.z });

  return [Math.min(x[0], y[0], z[0]), Math.max(x[1], y[1], z[1])];
}


function update()
{
   d3.json("http://127.0.0.1:8000/api/v1/getrecord/test",
            function(error, response) {
              if (error) return console.warn(error);

              var xGroup   = getSVGGroup("#x_graph");
              var yGroup   = getSVGGroup("#y_graph");
              var zGroup   = getSVGGroup("#z_graph");

              var xData    = response.map(function(d) { return {x: d.time, y: d.x} });
              var yData    = response.map(function(d) { return {x: d.time, y: d.y} });
              var zData    = response.map(function(d) { return {x: d.time, y: d.z} });
              var yExtent = extent(response);

              updateSVG(xGroup, yExtent, xData, "X", "Time", "G");
              updateSVG(yGroup, yExtent, yData, "Y", "Time", "G");
              updateSVG(zGroup, yExtent, zData, "Z", "Time", "G");
            });
}


function updateSVG(svgGroup, yExtent, data, title, xName, yName)
{
   xAxis.domain(d3.extent(data, function(d) { return d.x }));
   yAxis.domain(yExtent);

   /* remove old data */
   svgGroup.select("#line").remove();
   svgGroup.select("#xAxis").remove();
   svgGroup.select("#yAxis").remove();
   svgGroup.select("#title").remove();

   /* add new data */

  svgGroup.append("text")
       .attr("id", "title")
       .attr("x", width / 2 )
       .attr("y", 0 - margin.top / 2)
       .style("text-anchor", "middle")
       .text(title);

   svgGroup.append("g")
       .call(d3.axisBottom(xAxis))
       .attr("id", "xAxis")
       .attr("transform", "translate(0," + height + ")")
       .append("text")
       .attr("transform", "translate(" + width / 2 + ", " + margin.bottom / 2 + ")")
       .attr("fill", "#000")
       .text(xName);


   svgGroup.append("g")
       .call(d3.axisLeft(yAxis))
       .attr("id", "yAxis")
       .append("text")
       .attr("fill", "#000")
       /* .attr("transform", "rotate(-90)") */
       .attr("x", 0 - margin.left / 2)
       .attr("y", height / 2)
       .attr("dy", "0.71em")
       .attr("text-anchor", "middle")
       .text(yName);

   svgGroup.append("path")
       .datum(data)
       .attr("id", "line")
       .attr("fill", "none")
       .attr("stroke", "red")
       .attr("stroke-linejoin", "round")
       .attr("stroke-linecap", "round")
       .attr("stroke-width", 1.5)
       .attr("d", d3_line);
}



