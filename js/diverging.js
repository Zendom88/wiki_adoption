//var selectedVar = []; -refer to main js

var margin = {top: 50, right: 20, bottom: 10, left: 185},
    width = 500 - margin.left - margin.right,
    height = 1200 - margin.top - margin.bottom;

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .3);

var x = d3.scale.linear()
    .rangeRound([0, width]);

var color = d3.scale.ordinal()
    .range(["#c7001e", "#f6a580", "#cccccc", "#92c6db", "#086fad"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

var svg = d3.select("#figure").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "d3-plot")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  color.domain(["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]);

  d3.csv("data/response_cnt.csv", function(error, data) {

  data.forEach(function(d) {
    // calc percentages
    d["Strongly disagree"] = +d[1]*100/d.N;
    d["Disagree"] = +d[2]*100/d.N;
    d["Neutral"] = +d[3]*100/d.N;
    d["Agree"] = +d[4]*100/d.N;
    d["Strongly agree"] = +d[5]*100/d.N;
    var x0 = -1*(d["Neutral"]/2+d["Disagree"]+d["Strongly disagree"]);
    var idx = 0;
    d.boxes = color.domain().map(function(name) { return {name: name, x0: x0, x1: x0 += +d[name], N: +d.N, n: +d[idx += 1]}; });
  });

  var min_val = d3.min(data, function(d) {
          return d.boxes["0"].x0;
          });

  var max_val = d3.max(data, function(d) {
          return d.boxes["4"].x1;
          });

  x.domain([min_val, max_val]).nice();
  y.domain(data.map(function(d) { return d.Question; }));

  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("id", "nav_axis")
      .call(yAxis)

  d3.selectAll("#nav_axis").selectAll("g").selectAll("text")
      .data(data)
      .attr("class","unselected")
      //.attr("id",function(d){ return d.Question})
      .on("click",function() {
          var varName = d3.select(this).text();
          var idx = selectedVar.indexOf(varName);
          //console.log("Before:"+selectedVar);

            if (idx <0) {
              if (selectedVar.length + 1 <= 4) {
                selectedVar.push(varName);
                d3.select(this).attr("class","selected");
              } else {
                var strAleart;
                strAleart = "Only accept max 4 variables.";
                strAleart = strAleart + "4 Selected variables are:\n\n";
                strAleart = strAleart + selectedVar.join("\n");
                window.alert(strAleart);
              }
            } else {
              selectedVar.splice(idx,1);
              d3.select(this).attr("class","unselected");
            }
            //console.log("After:"+selectedVar);
            updateData();
        })


  var vakken = svg.selectAll(".question")
      .data(data)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) {return "translate(0," + y(d.Question) + ")"; });

  var bars = vakken.selectAll("rect")
      .data(function(d) {

        return d.boxes; })
    .enter()
    .append("g").attr("class", "subbar")

      ;

  bars.append("rect")
      .attr("height", y.rangeBand())
      .attr("x", function(d) { return x(d.x0); })
      .attr("width", function(d) { return x(d.x1) - x(d.x0); })
      .style("fill", function(d) { return color(d.name); })
      ;

  bars.append("text")
      .attr("x", function(d) { return x(d.x0); })
      .attr("y", y.rangeBand()/2)
      .attr("dy", "0.5em")
      .attr("dx", "0.5em")
      .style("font" ,"10px sans-serif")
      .style("text-anchor", "begin")
      .text(function(d) {
        return d.n !== 0 && (d.x1-d.x0)>3 ? d.n : "" });

  vakken.insert("rect",":first-child")
      .attr("height", y.rangeBand())
      .attr("x", "1")
      .attr("width", width)
      .attr("fill-opacity", "0.5")
      .style("fill", "#F5F5F5")
      .attr("class", function(d,index) { return index%2==0 ? "even" : "uneven"; });

  svg.append("g")
      .attr("class", "y axis")
  .append("line")
      .attr("x1", x(0))
      .attr("x2", x(0))
      .attr("y2", height);

  var startp = svg.append("g").attr("class", "legendbox").attr("id", "mylegendbox");
  // this is not nice, we should calculate the bounding box and use that
  //var legend_tabs = [0, 120, 200, 375, 450];

  var legend_tabs = [-30, 80, 150, 220, 270];
  var legend = startp.selectAll(".legend")
      .data(color.domain().slice())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + legend_tabs[i] + ",-45)"; });

  legend.append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", 22)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "begin")
      .style("font" ,"10px sans-serif")
      .text(function(d) { return d; });

  d3.selectAll(".axis path")
      .style("fill", "none")
      .style("stroke", "#000")
      .style("shape-rendering", "crispEdges")

  d3.selectAll(".axis line")
      .style("fill", "none")
      .style("stroke", "#000")
      .style("shape-rendering", "crispEdges")

  var movesize = width/2 - startp.node().getBBox().width/2;
  d3.selectAll(".legendbox").attr("transform", "translate(" + movesize  + ",0)");
});
