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

  footer = d3.select("footer")

  footer.append("p")
        .append("text")
        .text("Happy Planet Index")
        .attr("class", "head")
        .append("p")
        .append("text")
        .text("Name: Rebecca Davidsson, student number: 11252138")
        .attr("class", "head2")
        .append("p")
        .text("Data source:");
        // .append("a")
        // .attr("xlink:href", "http://happyplanetindex.org"+"Data Source")


  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Happiness Index: </strong><span class='details'>" + format(d.population) +"</span>";
              })

  // Set margin values
  var margin = {top: 0, right: 20, bottom: 0, left: 20},
              width = 900 + margin.left + margin.right,
              height = 700 - margin.top - margin.bottom,
              min = 12.8;
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
              .attr('class', 'map');


  /*
  Draw a legend with colors corresponding to the world map.
  */
  function makeLegend() {

  var legend = svg.append("rect")
      .attr("width", legendWidth)
      .attr("height", height - 100)
      .style("fill", color(40))
      .attr("transform", "translate(50,100)")

    var y = d3.scaleLinear()
        .range([legendWidth, 600 + legendWidth])
        .domain([max, min]);

    var yAxis = d3.axisLeft()
      .scale(y)
      .ticks(5);

    svg.append("g")
      .attr("class", "yAxis")
      .attr("transform", "translate(50,80)")
      .call(yAxis)
      .append("text")
      .attr("y", 0)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("axis title");
    }makeLegend()

  var projection = d3.geoMercator()
                     .scale(140)
                    .translate( [width / 2, height / 1.5]);

  var path = d3.geoPath().projection(projection);

  svg.call(tip);

  // Queue to request both queries and wait until all requests are fulfilled
  var requests = [d3.json("world_countries.json"), d3.tsv("test.tsv")];

  Promise.all(requests).then(function(response) {
    ready(response);
  }).catch(function(e){
      throw(e);
  });

  function ready(d){
    data = d[0]
    population=d[1]

    var populationById = {};
    var test = {};

    population.forEach(function(d) { test[d.name] = ({"Wellbeing" : parseFloat(d["Wellbeing"]),
                                    "Life Expectancy" : parseFloat(d["Life Expectancy"]),
                                    "Inequality" : parseFloat(d["Inequality"]),
                                    "Ecological Footprint" : parseFloat(d["Ecological Footprint"]),
                                    "HPI" : parseFloat(d["HPI"])}) ; });

    population.forEach(function(d) { populationById[d.id] = +d["HPI"] ; });
    data.features.forEach(function(d) { d.population = populationById[d.id] });

    svg.append("g")
        .attr("class", "countries")
      .selectAll("path")
        .data(data.features)
      .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) { return color(populationById[d.id]); })
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
            update(d.properties.name)
          });

    svg.append("path")
        .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
        .attr("class", "names")
        .attr("d", path);

        function update(country) {

        // Remove old donuts
        d3.selectAll("#donut").remove()
        d3.selectAll("#countryname").remove()

        drawDonut(country, test, "HPI", 3, 2, "firebrick", tip)
        drawDonut(country, test, "Life Expectancy", 3, 2, "lightcoral")
        drawDonut(country, test, "Inequality", 3, 2, "crimson")
        drawDonut(country, test, "Wellbeing", 3, 2, "palevioletred")

        // Add name currently displayed country
        var countryname = d3.selectAll("body")
                            .append("svg")
                            .attr("width", 400)
                            .attr("height", 70)
                            .attr("id", "countryname")
                            .attr("fill", "black")

        countryname.append("text")
               	   .attr("text-anchor", "center")
                   .attr("alignment-baseline", "hanging")
                   .attr("class", "countryname")
               		 // .attr('font-size', '4em')
               		 // .attr('y', height / y - 100)
                   //  .attr('x', width / x)
               	   .text(country);


        }
      // Start with data of the Netherlands when html is opened
      update("Netherlands")
      }
  }drawmap()

  function drawDonut(country, data, category, x, y, circleColor, tip) {

    // Define max values for each category
    if (category == "Wellbeing") {
      max = 10
    } else {
      max = 100
    }

    var dataset = data[country][category]
    console.log(dataset);

    data = [dataset, max - dataset]

    var color = d3.scaleLinear()
            .domain([0,1])
            .range([circleColor, "#E5E4E4"])

    // Set margin values
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = 220 - margin.left - margin.right,
                height = 240 - margin.top - margin.bottom,
                padding = 50,
                outerRadius = 70,
                innerRadius = 60;

    var donut = d3.select("body")
                .append("svg")
                .attr("id", "donut")
                .attr("width", width)
                .attr("height", height);

    var arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius)


    var pie = d3.pie()
                .value(function(d) { return d; })
                .sort(null);

    // Make the first circle
    donut.selectAll("path")
          .data(pie(data))
          .enter()
          .append('path')
          .attr('d', arc)
          // .transition()
          .attr("fill", function(d,i) {
          	return color(i);
          })
          .each(function(d) { this._current = d; })
          .attr("transform", "translate(" + width / x + "," + height / y + ")");


    // Add datapoint in the middle of the donut
    donut.append("text")
      	   .attr("text-anchor", "middle")
      		 .attr('font-size', '4em')
      		 .attr('y', height / y + 2)
           .attr('x', width / x)
           .attr("class", "innercircle")
      	   .text(dataset);

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
       		 .attr('font-size', '4em')
       		 .attr('y', height / y - 100)
            .attr('x', width / x)
            .attr("class", "cirlcetitle")
       	   .text(category);



  }
}
