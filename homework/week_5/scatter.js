// Name: Rebecca Davidsson
// Student number: 11252138
// Asssignment: D3 scatterplot

var womenInScience = "https://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var consConf = "https://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

// Queue to request both queries and wait until all requests are fulfilled
var requests = [d3.json(womenInScience), d3.json(consConf)];

Promise.all(requests).then(function(response) {

  // Add header text
  d3.select("body")
    .append("h1")
    .text("D3 Scatterplot")
    .append("p")
    .text("Name: Rebecca Davidsson, student number: 11252138, Date: December 5th, 2018")
    .append("p")
    .text("Data sourse: http://stats.oecd.org/ ")
    .append("p")
    .text("Click on any country name to view the scatterplot. ")
    .append("p")
    .text("Move your mouse over any point to view the corresponding year. ");

  // Start with data of the United Kingdom when html is opened
  var country = "France"

  // Make an array of countries, used to display links of countries
  var countryArray = ["France", "Germany", "Korea", "Netherlands", "Portugal", "United Kingdom"]

  // Define width, height, padding, and legendHeight
  var w = 1000;
  var h = 400;
  var padding = 50;
  var legendHeight = 17;

  // Add SVG element
  // Draw the first scatterplot for when html is opened
  var svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h)

  addInfo()
  // Add information to the scatterplot like lables and title
  function addInfo() {
  // Add a text label for the y axis
  svg.append("text")
      .attr("class", "text")
      .attr("transform","rotate(-90,60,50)")
      .style("text-anchor", "middle")
      .text("Consumer confidence");

  // Add a text label for the x-axis
  svg.append("text")
      .attr("class", "text")
      .attr("transform","translate(400,390)")
      .style("text-anchor", "middle")
      .text("Women researchers as a percentage of total researchers (headcount)")

  // Add a title to the scatterplot
  svg.append("text")
      .attr("x", h)
      .attr("y", padding - 10)
      .attr("text-anchor", "middle")
      .attr("class", "title")
      .text("Correlation between number of female researchers and consumer confidence");
  }

  // Transform dataset
  var dataset0 = transformResponse(response[0])
  var dataset1 = transformResponse2(response[1])

  // Get all the data of the chosen country
  function getData(country) {
    // Make an empty array and push all datapoints
    yearsArray = []
    array0 = []
    for(var i=0; i<dataset0.length; i++) {
      if(dataset0[i]["country"] == country) {
        array0.push(dataset0[i]["datapoint"])
        yearsArray.push(dataset0[i]["time"])
      }
    }

    // Two for-loops because both datasets can have a different lenghts
    array1 = []
    for(var i=0; i<dataset1.length; i++) {
      if(dataset1[i]["Country"] == country) {
        array1.push(dataset1[i]["datapoint"])
      }
    }

    // Make an array of a combined datapoint (of both json files)
    combinedArray = []
    for(var i=0; i<9; i++)  {
      // Filter out empty datapoints
      if (array0[i] != undefined && array1[i] != undefined){
        combinedArray.push([array0[i], array1[i], yearsArray[i]])
      }
    }
  }

  // Make an xScale and yScale, used to scale datapoints
  var xScale = d3.scaleLinear()
      .range([padding, w - 300]);
  var yScale = d3.scaleLinear()
      .range([h - padding, padding]);

  // Get all the data of the chosen country
  getData(country)

  // Define range and domain for xScale and yScale (used for positioning of axis and legenda)
  var xScale = d3.scaleLinear()
      .domain([Math.min.apply(Math, array0) - 0.5, Math.max.apply(Math, array0) + 0.5])
      .range([padding, w - 300]);
  var yScale = d3.scaleLinear()
      .domain([Math.min.apply(Math, array1) - 1, Math.max.apply(Math, array1) + 1])
      .range([h - padding, padding]);

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

  // Add the text of currently displayed country
  svg.append("text")
      .attr("x", h)
      .attr("y", h/2 + 10)
      .attr("class", "countryname")
      .style("text-anchor", "middle")
      .text(country);

  // Show a value of a specific point when hovering over that point
  var tip = d3.tip()
      .attr("class", "d3-tip")
      .html(function(d, i) {
        return "<span style='color:white'>" + "Year: " + yearsArray[i] + "</span>";
      })
  svg.call(tip);

  // Make a colorScale to give each point a different color
  const colorScale = d3.scaleOrdinal()
      .range(d3.schemePaired)
      .domain(["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]);

  // Create Circles and give each circle a colour with colorScale
  svg.selectAll("circle")
      .data(combinedArray)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return xScale(d[0]);
      })
      .attr("cy", function(d) {
        return yScale(d[1]);
      })
      .attr("r", 5.5)
      .style("fill", function(d) { return colorScale(d[2]);})
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)

  // Make a legend for all the measured years;
  // colorScale.domain() is used to ensure that every measured year
  // has one element in the legend
  var legend = svg.selectAll(".legend")
      .data(combinedArray)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i)
      { return "translate(0," + i * 30 + ")"; });

  // Make rectangles for the colors of the legend
  legend.append("rect")
      .attr("x", w - legendHeight)
      .attr("width", legendHeight)
      .attr("height", legendHeight)
      .style("fill", function(d) { return colorScale(d[2]);});

  // Add years to the legend using the yearsArray
  legend.append("text")
      .attr("x", w - 24)
      .attr("y", 9)
      .attr("dy", 8)
      .style("text-anchor", "end")
      .text(function(d, i) { return yearsArray[i]; });

  // Add countries to click on;
  // When clicked, update data with the selected country.
  var links = svg.selectAll(".links")
    .data(countryArray)
    .enter().append("g")
    .attr("transform", function(d, i)
    { return "translate(0," + i * 30 + ")"; });

  links.append("text")
      .attr("x", w - 150)
      .attr("y", 9)
      .attr("dy", 8)
      .attr("class", "links")
      .style("text-anchor", "end")
      .text(function(d, i) { return countryArray[i]; })
      .on("click",function(d,i) { updateData(countryArray[i]);})
      .on("mouseover", function(d) {
        d3.select(this).style("cursor", "pointer");
  });
// Updates scatterplot with new axes and points when user clicks on a country
function updateData(country) {

  // Select all old elements to remove
  svg.selectAll("circle")
      .remove()
  svg.selectAll(".countryname")
      .remove()

  // Get data of this country
  getData(country)

  // Define range and domain for xScale and yScale (used for positioning of axis and legenda)
  var xScale = d3.scaleLinear()
      .domain([Math.min.apply(Math, array0) - 0.5, Math.max.apply(Math, array0) + 0.5]).nice()
      .range([padding, w - 300]);
  var yScale = d3.scaleLinear()
      .domain([Math.min.apply(Math, array1) - 1, Math.max.apply(Math, array1) + 1])
      .range([h - padding, padding]);

  // Make a new x-axis
  svg.select(".x")
      .attr("class", "x axis")
      .transition()
      .duration(500)
      .call(d3.axisBottom(xScale));

  // Make a new y-axis
  svg.select(".y")
      .attr("class", "y axis")
      .transition()
      .duration(400)
      .call(d3.axisLeft(yScale));

  // Add the text of currently displayed country
  svg.append("text")
      .attr("x", 400)
      .attr("y", 210)
      .attr("class", "countryname")
      .style("text-anchor", "middle")
      .text(country);

  // Create Circles and give each circle a colour with colorScale
  svg.selectAll("circle")
      .data(combinedArray)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return xScale(d[0]);
      })
      .attr("cy", function(d) {
        return yScale(d[1]);
      })
      .attr("r", 5.5)
      .transition()
      .duration(400)
      .style("fill", function(d) { return colorScale(d[2]);})

  // Show the year when mouse hovers over a datapoint
  svg.selectAll("circle")
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)

}

}).catch(function(e){
    throw(e);
});
