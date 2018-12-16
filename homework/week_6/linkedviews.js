// Name: Rebecca Davidsson
// Student number: 11252138
// Asssignment: D3 Linked views (week 6)

function onload(){

  /*
  Draw a basic world map and give colors corresponding to
  HPI values for each country.
  SOURCE: http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f
  */
  function drawmap() {

  var format = d3.format(",");

  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Happy Planet Index: </strong><span class='details'>" + format(d.hpi) +"</span>";
              })

  // Set margin values
  var margin = {top: 0, right: 20, bottom: 0, left: 200},
              width = 800 + margin.left + margin.right,
              height = 680 - margin.top - margin.bottom,
              min = 10;
              max = 45;
              legendWidth = 20;

  // Set color scale domain to min and max value
  var color = d3.scaleSequential(d3.interpolateYlGn)
      .domain([min, max])

  var path = d3.geoPath();

  // Make a new svg for the map
  var svg = d3.select("body")
              .append("svg")
              .attr("width", width)
              .attr("height", height + 200)
              .append('g')
              .attr("id", "world")
              .attr('class', 'map');

  var projection = d3.geoMercator()
                     .scale(140)
                    .translate( [width / 2, height / 1.5]);

  var path = d3.geoPath().projection(projection);

  svg.call(tip);

  // Queue to request both files and wait until all requests are fulfilled
  var requests = [d3.json("world_countries.json"), d3.tsv("hpiDictTSV.txt")];

  Promise.all(requests).then(function(response) {
    ready(response);
    // Catch errors
    }).catch(function(e){
        throw(e);
  });

  function ready(d){
    data = d[0]
    hpi=d[1]

    var hpiById = {};
    var hpiDict = {};

    // Make a dictionary of all categories
    hpi.forEach(function(d) { hpiDict[d.name] = ({"Wellbeing" : parseFloat(d["Wellbeing"]),
                                    "Inequality" : parseFloat(d["Inequality"]),
                                    "HPI" : parseFloat(d["HPI"])}) ; });

    hpi.forEach(function(d) { hpiById[d.id] = +d["HPI"] ; });
    data.features.forEach(function(d) { d.hpi = hpiById[d.id] });

    /*
    Calculate the average of a given category.
    */
    averagesDict = {};
    function calcAverage(category, data) {
      total = 0
      counter = 0
      average = [];
      Object.keys(data).forEach(function(key) {
        if (data[key][category]) {
          counter += 1;
          total += data[key][category];
        }
      });
      average = total / counter;
      averagesDict[category] = average
      return averagesDict
    }

    // Make the world! :-)
    // SOURCE: http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f
    svg.append("g")
        .attr("id", "world")
        .attr("class", "countries")
      .selectAll("path")
        .data(data.features)
      .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) { return color(hpiById[d.id]); })
        .style('stroke', 'white')
        .style('stroke-width', 1.5)
        .style("opacity",0.8)
          .style("stroke","white")
          .style('stroke-width', 0.3)
          .on('mouseover',function(d){
            tip.show(d);

            d3.select(this)
              .style("opacity", 1)
              .style("stroke","white")
              .style("stroke-width",3);
          })
          .on('mouseout', function(d){
            tip.hide(d);

            d3.select(this)
              .style("opacity", 0.8)
              .style("stroke","white")
              .style("stroke-width",0.3);
          })
          .on("mousedown", function(d) {
            try {
              update(d.properties.name, "HPI", hpiDict)
              update(d.properties.name, "Inequality", hpiDict)
              update(d.properties.name, "Wellbeing", hpiDict);
            }
            // Update to 'unkown' when country has no data
            catch(err) {
              d3.selectAll("#countryname").remove()
              addCountryName("Uknown HPI")
              d3.selectAll("#HPI").style("fill-opacity", 0.4)
              d3.selectAll("#Inequality").style("fill-opacity", 0.4)
              d3.selectAll("#Wellbeing").style("fill-opacity", 0.4)
            }
          });

    svg.append("path")
        .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
        .attr("class", "names")
        .attr("d", path);

    // Create a dropdown
    var dropDown = d3.select("#footer2")

    // Append options to the drop-down menu
    dropDown.append("select")
        		.selectAll("option")
            .data(hpi)
                .enter()
                .append("option")
                .attr("value", function(d){
                    return d.name;
                })
                .text(function(d){
                    return d.name;
                });

      // Run update function with selected country
   	  dropDown.on('change', function(){
   		var selectedCountry = d3.select(this)
              .select("select")
              .property("value")
              try {
                update(selectedCountry, "HPI", hpiDict)
                update(selectedCountry, "Inequality", hpiDict)
                update(selectedCountry, "Wellbeing", hpiDict);
              }
              // Update to 'unkown' when country has no data
              catch(err) {
                d3.selectAll("#countryname").remove()
                addCountryName("Uknown HPI")
                d3.selectAll("#HPI").style("fill-opacity", 0.4)
                d3.selectAll("#Inequality").style("fill-opacity", 0.4)
                d3.selectAll("#Wellbeing").style("fill-opacity", 0.4)
              }
      });

    function addCountryName(country) {
    // Add name of currently displayed country
    var countryname = d3.select("#world")
                        .append("svg")
                        .attr('y', 50)
                         .attr('x', width - 270)
                        .attr("id", "countryname")
                        .attr("fill", "black")

    countryname.append("text")
               .attr("text-anchor", "center")
               .attr("alignment-baseline", "hanging")
               .attr("class", "countryname")
               .text(country);
    }

    /*
    Makes the 3 donuts when html is opened.
    */
    function makeInitialDonuts(country) {
    drawDonut(country, hpiDict, "HPI", "firebrick", calcAverage("HPI", hpiDict))
    drawDonut(country, hpiDict, "Inequality", "crimson", calcAverage("Inequality", hpiDict))
    drawDonut(country, hpiDict, "Wellbeing", "palevioletred",
              calcAverage("Wellbeing", hpiDict))
    // Add the name of currently displayed country
    addCountryName(country)
    // Start with data of the USA when html is opened
    }makeInitialDonuts("USA")

    /*
    Updates the three donuts when user clicks on a country.
    */
    function update(country, category, data){

      // Set margin values
      var margin = {top: 0, right: 0, bottom: 0, left: 0},
                  width = 210 - margin.left - margin.right,
                  height = 235 - margin.top - margin.bottom,
                  padding = 50,
                  outerRadius = 60,
                  innerRadius = 50,
                  x = 3,
                  y = 2;

      // Set max values and colors
      if (category == "Wellbeing") {
        var max = 8
        var col = "palevioletred"
      }
      else if (category == "HPI") {
        var max = 100
        var col = "firebrick"
      }else {
        max = 100
        var col = "crimson"
      }

      var color = d3.scaleLinear()
              .domain([0,1])
              .range([col, "#E5E4E4"])

      // Update dataset to selected country
      var dataset = data[country][category]
      data = [dataset, max - dataset]

      // Remove old countryname and draw a new one
      d3.selectAll("#countryname").remove()
      addCountryName(country)

      // Remove old numbers in the donuts and make new ones
      d3.selectAll("#innerText" + category).remove()

      // Select donut by category
      var donut = d3.selectAll("#" + category)
                    .style("fill-opacity", 1)

      // Draw the text in the inner circle
      donut.append("text")
            .attr("id", "innerText" + category)
        	   .attr("text-anchor", "middle")
        		 .attr('font-size', '4em')
        		 .attr('y', height / 2 + 4)
             .attr('x', height / 3 - 8)
             .attr("class", "innercircle")
        	   .text(dataset);

      // Make new arc and pie variables
      var arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
      var pie = d3.pie()
                 .value(function(d) { return d; })
                 .sort(null);

      // Make the new circle
      donut.selectAll("path")
            .data(pie(data))
            .transition()
            .duration(1000)
            .attr('d', arc)
            .attr("fill", function(d,i) {
            	return color(i);
            })
            .each(function(d) { this._current = d; })
            .attr("transform", "translate(" + width / x + "," + height / y + ")");
      }
    }

    /*
    Draw a legend with colors corresponding to the world map.
    */
    function makeLegend() {
      var defs = svg.append("defs");

      var linearGradient = defs.append("linearGradient")
                                .attr("id", "linear-gradient");

      // Define color gradiënt
      linearGradient
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "0%")
          .attr("y2", "100%");

      linearGradient.selectAll("stop")
          .data([
            {offset: "0%", color: color(42)},
            {offset: "25%", color: color(32)},
            {offset: "50%", color: color(26)},
            {offset: "75%", color: color(19)},
            {offset: "100%", color: color(12)}
          ])
          .enter().append("stop")
          .attr("offset", function(d) {
            return d.offset;
          })
          .attr("stop-color", function(d) {
            return d.color;
          });

      // Append legend rectangle and fill with gradiënt color
      var legend = svg.append("rect")
              .attr("width", legendWidth)
              .attr("height", height - 100)
              .style("fill", "url(#linear-gradient)")
              .attr("transform", "translate(50,100)");

      var y = d3.scaleLinear()
              .range([legendWidth, height - 100 + legendWidth])
              .domain([max, min]);

      var yAxis = d3.axisLeft()
              .scale(y)
              .ticks(5);

      // Add legened axis
      svg.append("g")
              .attr("class", "yAxis")
              .attr("transform", "translate(50,80)")
              .call(yAxis)

      // Add axis title
      svg.append("text")
              .text("Happy Planet Index (from low to high)")
              .attr("transform", "rotate(-90, 180, 160)")

      // Add mini legend for undefined countries
      svg.append("rect")
              .attr("fill", "rgb(48,48,48)")
              .attr("height", 20)
              .attr("width", 20)
              .attr("transform", "translate(50,50)")

      // Add text to mini legend
      svg.append("text")
              .attr("transform", "translate(80,65)")
              .text("Unkown HPI")

    }makeLegend()
  }drawmap()

  /*
  Draw a donut chart for a given country and category.
  */
  function drawDonut(country, data, category, circleColor, average) {
    // Define max values for each category
    if (category == "Wellbeing") {
      max = 8
    }
    else if (category == "HPI") {
      max = 100
    }else {
      max = 100
    }

    // Update data to selected country
    var dataset = data[country][category]
    data = [dataset, max - dataset]

    var color = d3.scaleLinear()
            .domain([0,1])
            .range([circleColor, "#E5E4E4"])

    // Set margin values
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = 210 - margin.left - margin.right,
                height = 230 - margin.top - margin.bottom,
                padding = 50,
                outerRadius = 60,
                innerRadius = 50,
                x = 3,
                y = 2;

    // Append new svg element
    var donut = d3.select("body")
                .append("svg")
                .attr("id", category)
                .attr("class", "circlesvg")
                .style("fill-opacity", 0.4)
                .attr("width", width)
                .attr("height", height)
                .attr("transform", "translate(" + 10 + "," + 10 + ")");

    // Add a tooltip that shows the average of the hovered category
    var tool_tip = d3.tip()
            .attr("class", "average")
            .direction('w')
            .html(function(d) { return "Average " + category +
                  " : " + Math.round(average[category]); });
    donut.call(tool_tip);
    donut.on("mouseover", tool_tip.show)
            .on("mouseout", tool_tip.hide);

    var arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
    var pie = d3.pie()
                .value(function(d) { return d; })
                .sort(null);

    // Make the paths (circles) in the svg element(s)
    donut.selectAll("path")
          .data(pie(data))
          .enter()
          .append('path')
          .attr('d', arc)
          .transition()
          .attr("fill", function(d,i) {
          	return color(i);
          })
          .each(function(d) { this._current = d; })
          .attr("transform", "translate(" + width / x + "," + height / y + ")");

    // Add datapoint in the middle of the donut
    donut.append("text")
          .attr("id", "innerText" + category)
      	   .attr("text-anchor", "middle")
      		 .attr('font-size', '4em')
      		 .attr('y', height / y + 2)
           .attr('x', width / x)
           .attr("class", "innercircle")
      	   .text(dataset);

    // Add maximum value to inner donut text
    donut.append("text")
      	   .attr("text-anchor", "middle")
      		 .attr('font-size', '4em')
      		 .attr('y', height / y + 20)
           .attr('x', width / x)
           .attr("class", "max")
      	   .text("/" + max);

    // Add category title to donut
    donut.append("text")
       	   .attr("text-anchor", "middle")
       		 .attr('y', height / y - 90)
            .attr('x', width / x)
            .attr("class", "cirlcetitle")
       	   .text(category);
  }

  // Add (real) footer
  d3.selectAll("body")
    .append("footer")
    .attr("class", "footer2")
    .attr("id", "footer2")
    .html("The Happy Planet Index (HPI) indicates how well a country is doing. \
          The HPI is based on country wellbeing, life expectancy, inequality of \
          outcomes and ecological footprint.")
    .append("footer")
    .attr("class", "footer3")
    .text("Choose a country to view HPI elements: ")

}
