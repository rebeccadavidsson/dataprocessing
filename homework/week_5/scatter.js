// Name: Rebecca Davidsson
// Student number: 11252138
// Asssignment: D3 scatterplot

var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

var request = new XMLHttpRequest();
request.open("GET", womenInScience)

window.onload = function() {
  console.log('Testtest test test TEST!!!!!')
};



request.onload = function () {
  console.log("test2")

  // Accessing json data
  var data = JSON.parse(this.response);

  // Test if data is parsed correctly
  Object.keys(data).forEach(function(value) {
    console.log(value, data["structure"]["dimensions"]["keyposition"]);
  })



}

request.send();
