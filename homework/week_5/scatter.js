// Name: Rebecca Davidsson
// Student number: 11252138
// Asssignment: D3 scatterplot

// Define hight and width of svg
var h = 300
var w = 500

var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

// Queue to request both queries and wait until all requests are fulfilled
var requests = [d3.json(womenInScience), d3.json(consConf)];

Promise.all(requests).then(function(response) {

  // Add header text
  d3.select("body")
    .append("h1")
    .text("D3 Scatterplot")
    .append("p")
    .text("Name: Rebecca Davidsson, student number: 11252138, Date: 3 december 2018");


  var dataset0 = transformResponse(response[0])

  array0 = []
  for(var i=0; i<dataset0.length; i++) {
    if(dataset0[i]["country"] == "France") {
      array0.push(dataset0[i]["datapoint"])
    }
  }

  var dataset1 = transformResponse2(response[1])
  array1 = []
  for(var i=0; i<dataset1.length; i++) {
    if(dataset1[i]["Country"] == "France") {
      array1.push(dataset1[i]["datapoint"])
    }
  }

  testarray = []
  for(var i=0; i<9; i++)  {
    testarray.push([array0[i], array1[i]])
  }
  console.log(testarray)

// Setup settings for graphic
  var w = 1000;
  var h = 400;
  var padding = 50;

  // COMMENT
  var xScale = d3.scaleLinear()
      .domain([25, 30])
      .range([padding, w - 300]);

  // 6. COMMENT
  var yScale = d3.scaleLinear()
      .domain([95, 105])
      .range([h - padding, padding]);

  // Create SVG element
  var svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h)

  // Make an x-axis by appending a group element
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(d3.axisBottom(xScale));

  // Make a y-axis by appending a group element
  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(50,0)")
    .call(d3.axisLeft(yScale));

  // text label for the y axis
  svg.append("text")
      .attr("class", "text")
      .attr("transform","rotate(-90,45,25)")
      .style("text-anchor", "middle")
      .text(" Ja wat is dit");

  // text label for the x-axis
  svg.append("text")
      .attr("class", "text")
      .attr("transform","translate(680,380)")
      .style("text-anchor", "middle")
      .text(" En wat is dit")

  // again scaleOrdinal
	 const colorScale = d3.scaleOrdinal()
        .range(d3.schemePaired);

  // Create Circles
  svg.selectAll("circle")
      .data(testarray)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
          return xScale(d[0]);
      })
      .attr("cy", function(d) {
          return yScale(d[1]);
      })
      .attr("r", 3)
      .style("fill", function(d) { return colorScale(d);})



}).catch(function(e){
    throw(e);
});
