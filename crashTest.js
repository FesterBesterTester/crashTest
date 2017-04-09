// requires d3.js


function initSVGs(svgIDs)
{
  for (svgID of document.querySelectorAll(".graph"))
  {
    var svg = d3.select(svgID);
    svg.append("g");
  }
}


function getSVGGroup(svgID)
{
  return d3.select(svgID + " g");
}


var parseTime = d3.timeParse("%d-%b-%y");


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

              var xData    = response.map(function(d) { return {x: d.time, y: d.x} });
              var yData    = response.map(function(d) { return {x: d.time, y: d.y} });
              var zData    = response.map(function(d) { return {x: d.time, y: d.z} });
              var yExtent = extent(response);

              updateSVG("#x_graph", yExtent, xData, "X", "Time", "G");
              updateSVG("#y_graph", yExtent, yData, "Y", "Time", "G");
              updateSVG("#z_graph", yExtent, zData, "Z", "Time", "G");
            });
}


function updateSVG(id, yExtent, data, title, xName, yName)
{
   var svg = document.querySelector(id);
   var dsvg = d3.select(id + " g");
   var style = window.getComputedStyle(svg);
   var boundingRect = svg.getBoundingClientRect();
   var height = boundingRect.height;
   var width = boundingRect.width;

   var svgGroup = dsvg;

   var xAxis = d3.scaleTime()
     .rangeRound([0, width]);

   var yAxis = d3.scaleLinear()
     .rangeRound([height, 0]);

   var d3_line = d3.line()
     .x(function(d) { return xAxis(d.x); })
     .y(function(d) { return yAxis(d.y); });

   xAxis.domain(d3.extent(data, function(d) { return d.x }));
   yAxis.domain(yExtent);

   /* remove old data */
   svgGroup.select(".line").remove();
   svgGroup.select(".xAxis").remove();
   svgGroup.select(".yAxis").remove();
   svgGroup.select(".title").remove();

   /* add new data */

  svgGroup.append("text")
       .attr("class", "title")
       .attr("x", width / 2 )
       .attr("y", "-0.5em")
       .style("text-anchor", "middle")
       .text(title);

   svgGroup.append("g")
       .call(d3.axisBottom(xAxis))
       .attr("class", "xAxis")
       .attr("transform", "translate(0," + height + ")")
       .append("text")
       .attr("x", width / 2)
       .attr("y", "3em")
       .attr("fill", "#000")
       .text(xName);


   svgGroup.append("g")
       .call(d3.axisLeft(yAxis))
       .attr("class", "yAxis")
       .append("text")
       .attr("fill", "#000")
       .attr("x", "-4em")
       .attr("y", height / 2)
       .attr("dy", "2em")
       .attr("text-anchor", "middle")
       .text(yName);

   svgGroup.append("path")
       .datum(data)
       .attr("class", "line")
       .attr("fill", "none")
       .attr("stroke", "red")
       .attr("stroke-linejoin", "round")
       .attr("stroke-linecap", "round")
       .attr("stroke-width", 1.5)
       .attr("d", d3_line);
}

