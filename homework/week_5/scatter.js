// Name: Rebecca Davidsson
// Student number: 11252138
// Asssignment: D3 scatterplot

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
    .text("Name: Rebecca Davidsson, student number: 11252138, Date: 3 december 2018")
    .append("p")
    .text("Data sourse: http://stats.oecd.org/ ")
    .append("p")
    .text("Click on any country name to view the scatterplot. ");

  // Start with data of France when html is opened
  var country = "France"
  var countryArray = ["France", "Germany", "Korea", "Netherlands", "Portugal", "United Kingdom"]

  // Transform dataset
  var dataset0 = transformResponse(response[0])
  var dataset1 = transformResponse2(response[1])

  // Get the years of each datapoint
  yearsArray = []
  for(var i=0; i<9; i++)  {
    yearsArray.push(dataset0[i]["time"])
  }

  // Make an empty array and push all datapoints
  array0 = []
  for(var i=0; i<dataset0.length; i++) {
    if(dataset0[i]["country"] == country) {
      array0.push(dataset0[i]["datapoint"])
    }
  }

  // Two for-loops becayse both datasets can have a different lenghts
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
      combinedArray.push([array0[i], array1[i]])
    }
  }

  // Define width, height, padding and so legendHeight
  var w = 1000;
  var h = 400;
  var padding = 50;
  var legendHeight = 17;

  // Create SVG element
  var svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h)

  // COMMENT
  var xScale = d3.scaleLinear()
      .domain([Math.min.apply(Math, array0) - 0.5, Math.max.apply(Math, array0) + 0.5])
      .range([padding, w - 300]);

  // COMMENT
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

  // text label for the y axis
  svg.append("text")
      .attr("class", "text")
      .attr("transform","rotate(-90,60,50)")
      .style("text-anchor", "middle")
      .text("Consumer confidence");

  // text label for the x-axis
  svg.append("text")
      .attr("class", "text")
      .attr("transform","translate(400,390)")
      .style("text-anchor", "middle")
      .text("Women researchers as a percentage of total researchers (headcount)")

  // add title to the scatterplot
  svg.append("text")
        .attr("x", h)
        .attr("y", padding - 10)
        .attr("text-anchor", "middle")
        .attr("class", "title")
        .text("Correlation between number of female researchers and consumer confidence");

  // again scaleOrdinal
	const colorScale = d3.scaleOrdinal()
      .range(d3.schemePaired);

  // Create Circles
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
      .attr("r", 5)
      .style("fill", function(d) { return colorScale(d);})

  // construct legend
  var legend = svg.selectAll(".legend")
       .data(colorScale.domain())
       .enter().append("g")
       .attr("class", "legend")
       .attr("transform", function(d, i)
       { return "translate(0," + i * 30 + ")"; });

  // create rectangles for the colors of the legend
  legend.append("rect")
       .attr("x", w - legendHeight)
       .attr("width", legendHeight)
       .attr("height", legendHeight)
       .style("fill", colorScale);

  // add text to the legend
  legend.append("text")
       .attr("x", w - 24)
       .attr("y", 9)
       .attr("dy", 8)
       .style("text-anchor", "end")
       .text(function(d, i) { return yearsArray[i]; });

  // add country links
  legend.append("text")
       .attr("x", w - 150)
       .attr("y", 9)
       .attr("dy", 8)
       .attr("class", "links")
       .style("text-anchor", "end")
       .text(function(d, i) { return countryArray[i]; })
       .on("click",function(d,i) { updateData(countryArray[i]);});



   function updateData(country) {

     d3.select("svg").remove();

     // Get the years of each datapoint
     yearsArray = []
     for(var i=0; i<9; i++)  {
       yearsArray.push(dataset0[i]["time"])
     }


     // Make an empty array and push all datapoints
     array0 = []
     for(var i=0; i<dataset0.length; i++) {
       if(dataset0[i]["country"] == country) {
         array0.push(dataset0[i]["datapoint"])
       }
     }

     // Two for-loops becayse both datasets can have a different lenghts
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
         combinedArray.push([array0[i], array1[i]])
       }
     }

     // Create new SVG element
     var svg = d3.select("body")
         .append("svg")
         .attr("width", w)
         .attr("height", h)

     // COMMENT
     var xScale = d3.scaleLinear()
         .domain([Math.min.apply(Math, array0) - 0.5, Math.max.apply(Math, array0) + 0.5])
         .range([padding, w - 300]);

     // COMMENT
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

     // text label for the y axis
     svg.append("text")
         .attr("class", "text")
         .attr("transform","rotate(-90,60,50)")
         .style("text-anchor", "middle")
         .text("Consumer confidence");

     // text label for the x-axis
     svg.append("text")
         .attr("class", "text")
         .attr("transform","translate(400,390)")
         .style("text-anchor", "middle")
         .text("Women researchers as a percentage of total researchers (headcount)")

     // add title to the scatterplot
     svg.append("text")
           .attr("x", h)
           .attr("y", padding - 10)
           .attr("text-anchor", "middle")
           .attr("class", "title")
           .text("Correlation between number of female researchers and consumer confidence");

     // again scaleOrdinal
   	const colorScale = d3.scaleOrdinal()
         .range(d3.schemePaired);

     // Create Circles
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
         .attr("r", 5)
         .style("fill", function(d) { return colorScale(d);})

     // construct legend
     var legend = svg.selectAll(".legend")
          .data(colorScale.domain())
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i)
          { return "translate(0," + i * 30 + ")"; });

     // create rectangles for the colors of the legend
     legend.append("rect")
          .attr("x", w - legendHeight)
          .attr("width", legendHeight)
          .attr("height", legendHeight)
          .style("fill", colorScale);

     // add text to the legend
     legend.append("text")
          .attr("x", w - 24)
          .attr("y", 9)
          .attr("dy", 8)
          .style("text-anchor", "end")
          .text(function(d, i) { return yearsArray[i]; });

     // add country links
     legend.append("text")
          .attr("x", w - 150)
          .attr("y", 9)
          .attr("dy", 8)
          .attr("class", "links")
          .style("text-anchor", "end")
          .text(function(d, i) { return countryArray[i]; })
          .on("click",function(d,i) { updateData(countryArray[i]);});
   }


}).catch(function(e){
    throw(e);
});
