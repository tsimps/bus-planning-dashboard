// GLOBAL

var septaBusStops =
"https://opendata.arcgis.com/datasets/e9cf307d8408475ab1188f126ccaa1ba_0.geojson";
var septaBusRoutes =
"https://opendata.arcgis.com/datasets/18ed1674dca94472a5f7d40f219ba266_0.geojson";
var septaTrolleyStops =
"https://opendata.arcgis.com/datasets/a5667eb6b6f945e8913b7b08b6733c09_0.geojson";
var septaTrolleyRoutes =
"https://opendata.arcgis.com/datasets/9c2ebf233cee4b039fec0590b383344c_0.geojson";
var septaMFLStops =
"https://opendata.arcgis.com/datasets/4496133dfe404fe2b534b13932473cd2_0.geojson";
var septaMFLRoute =
"https://opendata.arcgis.com/datasets/f1f0530e1714417b8dee0dc07ce60104_0.geojson";
var septaBSLStops =
"https://opendata.arcgis.com/datasets/19b1b9b8a6a64169a0d0bea590ad131e_0.geojson";
var septaBSLRoute =
"https://opendata.arcgis.com/datasets/f58fba791c934381bfc055cda70b7d18_0.geojson";
var septaRRStops =
'https://opendata.arcgis.com/datasets/819dfd2785b64c10b7cbacde1d7b02f9_0.geojson';
var septaRRRoutes =
"https://opendata.arcgis.com/datasets/0bc475a334494b8796d87ce546e90bb4_0.geojson";
var septaLoopsCenters =
"https://opendata.arcgis.com/datasets/790a5574ccef4bbc85ba76072b62f537_0.geojson";

var shelterDatabaseLink =
"https://raw.githubusercontent.com/tsimps/tsimps.github.io/master/data/shelter_json_31318.geojson";
var stopsRouteLink =
"https://raw.githubusercontent.com/tsimps/midterm-project/master/data/stops_routes_full.geojson";
var neighborhoodsLink =
"https://raw.githubusercontent.com/tsimps/midterm-project/master/data/neighborhoods.geojson";


var newBusDataLink = "https://raw.githubusercontent.com/tsimps/bus-planning-dashboard/master/data/busData.geojson";
var newTrolleyDataLink = "https://raw.githubusercontent.com/tsimps/bus-planning-dashboard/master/data/trolleyData.geojson";

var stopNames = []; //used to hold stop IDs to search against
var routeSearchInput = document.getElementById("routeSearch");

var highPerformanceInput = document.getElementById("highPerformanceSlider");
var lowPerformanceInput = document.getElementById("lowPerformanceSlider");

var popupTracker = false;


var centerCoordinates = [-75.15901565579941, 39.94756033306919];


mapboxgl.accessToken =
"pk.eyJ1IjoidGFuZHJld3NpbXBzb24iLCJhIjoiY2ludXlsY3ZsMTJzN3Rxa2oyNnplZjB1ZyJ9.bftIKd0sAwvSIGWxIDbSSw";








// INFORMATION POPUP
var infoText = "<p> Welcome to the Transit Analysis Tool. This tool is still in development, so feel free to get in touch for additional features that could be useful and to let me know about bugs. Data is courtesy of SEPTA. Map rendering is powered by Mapbox GL. </p>" +
"<h5> How This Works </h5> <p> There are three pages to this tool. The Stops page shows ridership data aggregated to the stop level for the whole SEPTA system. <br><br>"+
"The Routes page allows the user to choose a route in the system and see ridership only for that route (i.e. if there are 4 routes that use a stop, this page will only show you the ridership for the chosen route.)<br><br>"+
"The Operating Perfomance page allows the user to understand the performance of the system from a operating ratio standpoint (i.e. profitability)</p>";

$('#info').click(function () {
  showDialog({
    title: 'About',
    text: infoText
  });
});

var options = {
  shouldSort: true,
  tokenize: true,
  //matchAllTokens: true, // fucks up with the space bar
  keys: [{
    name: 'Stop_ID',
    weight: 0.5
  }, {
    name: 'Stop_Name',
    weight: 0.5
  }],
  includeScore: true,
  threshold: 0.5,
  location: 0,
  distance: 100,
  maxPatternLength: 20,
  minMatchCharLength: 3,
};

var stopFuse;
//var result = stopFuse.search("");

var stopList = [];
Papa.parse("https://raw.githubusercontent.com/tsimps/bus-planning-dashboard/master/data/searchData.csv", {
  download: true,
  header: true,
  complete: function(results) {
    //console.log(results);
    stopList = results.data;
    stopFuse = new Fuse(stopList, options); // "list" is the item array
  }
});




// helper function that takes in a route number and filters to that route
function filterRoutes(map, routeNumber) {
  if (routeNumber == "") {
    map.setFilter("busRoutes", ["==", "School_Route", "No"]);
    map.setFilter("trolleyRoutes", null);
    map.setFilter("mflRoute", null);
    map.setFilter("bslRoute", null);
    map.setFilter("rrRoutes", null);

    // remove all stops
    map.setLayoutProperty("busStops", "visibility", "none");
    map.setLayoutProperty("trolleyStops", "visibility", "none");
    map.setLayoutProperty("mflStops", "visibility", "none");
    map.setLayoutProperty("bslStops", "visibility", "none");
    map.setLayoutProperty("rrStops", "visibility", "none");

  } else {
    //if (routeNumber === "MFL") {routeNumber = "Market-Frankford Line";}
    //if (routeNumber === "BSL") {routeNumber = "Broad Street Line";}
    let holder = routeNumber.split(", ");
    holder = holder.map(function(x){ return x.replace(/MFL/g,"Market-Frankford Line") });
    holder = holder.map(function(x){ return x.replace(/BSL/g,"Broad Street Line") });
    map.setFilter('busRoutes', ['match', ['get', 'Route'], holder, true, false]);
    map.setFilter('trolleyRoutes', ['match', ['get', 'Route'], holder, true, false]);
    map.setFilter('mflRoute', ['match', ['get', 'Route'], holder, true, false]);
    map.setFilter('bslRoute', ['match', ['get', 'Route'], holder, true, false]);
    map.setFilter('rrRoutes', ['match', ['get', 'Route'], holder, true, false]);
  }
}

function filterStops(map, routeNumber) {
  //if (routeNumber === "MFL") {routeNumber = "Market-Frankford Line";}
  //if (routeNumber === "BSL") {routeNumber = "Broad Street Line";}

  //console.log(routeNumber);
  let holder = routeNumber.split(", ");
  holder = holder.map(function(x){ return x.replace(/MFL/g,"Market-Frankford Line") });
  holder = holder.map(function(x){ return x.replace(/BSL/g,"Broad Street Line") });
  //console.log(holder);

  map.setFilter('busStops', ['match', ['get', 'Route'], holder, true, false])
  map.setLayoutProperty("busStops", "visibility", "visible");

  map.setFilter('trolleyStops', ['match', ['get', 'Route'], holder, true, false])
  map.setLayoutProperty("trolleyStops", "visibility", "visible");

  map.setFilter('mflStops', ['match', ['get', 'Route'], holder, true, false])
  map.setLayoutProperty("mflStops", "visibility", "visible");

  map.setFilter('bslStops', ['match', ['get', 'Route'], holder, true, false])
  map.setLayoutProperty("bslStops", "visibility", "visible");

  map.setFilter('rrStops', ['match', ['get', 'Route'], holder, true, false])
  map.setLayoutProperty("rrStops", "visibility", "visible");

}

// function that adds all of the septa sources to a map

function addSeptaStopSources(map, busAggregation = true) {
  var septaBusStops =
  "https://opendata.arcgis.com/datasets/e9cf307d8408475ab1188f126ccaa1ba_0.geojson";
  var septaTrolleyStops =
  "https://opendata.arcgis.com/datasets/a5667eb6b6f945e8913b7b08b6733c09_0.geojson";
  var septaMFLStops =
  "https://opendata.arcgis.com/datasets/4496133dfe404fe2b534b13932473cd2_0.geojson";
  var septaBSLStops =
  "https://opendata.arcgis.com/datasets/19b1b9b8a6a64169a0d0bea590ad131e_0.geojson";
  var septaRRStops =
  'https://opendata.arcgis.com/datasets/819dfd2785b64c10b7cbacde1d7b02f9_0.geojson';

  map.addSource("mflStops", {
    type: "geojson",
    data: septaMFLStops
  });
  map.addSource("bslStops", {
    type: "geojson",
    data: septaBSLStops
  });
  map.addSource("rrStops", {
    type: "geojson",
    data: septaRRStops
  });
  if (busAggregation === true) {
    map.addSource("busStops", {
      type: "geojson",
      data: newBusDataLink
    });
    map.addSource("trolleyStops", {
      type: "geojson",
      data: newTrolleyDataLink
    });
  }
  else {
    map.addSource("busStops", {
      type: "geojson",
      data: septaBusStops
    });
    map.addSource("trolleyStops", {
      type: "geojson",
      data: septaTrolleyStops
    });
  }
}

function addSeptaRouteSources(map) {
  var septaBusRoutes =
  "https://opendata.arcgis.com/datasets/18ed1674dca94472a5f7d40f219ba266_0.geojson";
  var septaTrolleyRoutes =
  "https://opendata.arcgis.com/datasets/9c2ebf233cee4b039fec0590b383344c_0.geojson";
  var septaMFLRoute =
  "https://opendata.arcgis.com/datasets/f1f0530e1714417b8dee0dc07ce60104_0.geojson";
  var septaBSLRoute =
  "https://opendata.arcgis.com/datasets/f58fba791c934381bfc055cda70b7d18_0.geojson";
  var septaRRRoutes =
  "https://opendata.arcgis.com/datasets/0bc475a334494b8796d87ce546e90bb4_0.geojson";

  map.addSource("busRoutes", {
    type: "geojson",
    data: septaBusRoutes
  });
  map.addSource("trolleyRoutes", {
    type: "geojson",
    data: septaTrolleyRoutes
  });
  map.addSource("bslRoute", {
    type: "geojson",
    data: septaBSLRoute
  });
  map.addSource("mflRoute", {
    type: "geojson",
    data: septaMFLRoute
  });
  map.addSource("rrRoutes", {
    type: "geojson",
    data: septaRRRoutes
  });
}

function addStopsLayer(map) {
  map.addLayer({
    id: "rrStops",
    type: "circle",
    source: "rrStops",
    paint: {
      "circle-color": "#1f2833",
      "circle-opacity": 0.5,
      "circle-radius": {
        property: "Weekday_Total_Boards",
        type: "exponential",
        stops: [
          [{zoom: 14, value: 0}, 2],
          [{zoom: 14, value: 50}, 4],
          [{zoom: 14, value: 100}, 6],
          [{zoom: 14, value: 250}, 8],
          [{zoom: 14, value: 500}, 12],
          [{zoom: 14, value: 1000}, 15],
          [{zoom: 14, value: 3000}, 20],
          [{zoom: 14, value: 5000}, 25],
          [{zoom: 14, value: 10000}, 30],
          [{zoom: 15.5, value: 0}, 6],
          [{zoom: 15.5, value: 50}, 10],
          [{zoom: 15.5, value: 100}, 16],
          [{zoom: 15.5, value: 250}, 20],
          [{zoom: 15.5, value: 500}, 28],
          [{zoom: 15.5, value: 1000}, 34],
          [{zoom: 15.5, value: 3000}, 40],
          [{zoom: 15.5, value: 5000}, 45],
          [{zoom: 15.5, value: 10000}, 50],
        ]
      }
    }
  });
  map.addLayer({
    id: "mflStops",
    type: "circle",
    source: "mflStops",
    paint: {
      "circle-color": "#4377bc",
      "circle-opacity": 0.75,
      "circle-radius": {
        property: "Average_Weekday_Ridership",
        type: "exponential",
        stops: [
          [{zoom: 14, value: 0}, 2],
          [{zoom: 14, value: 50}, 4],
          [{zoom: 14, value: 100}, 6],
          [{zoom: 14, value: 250}, 8],
          [{zoom: 14, value: 500}, 12],
          [{zoom: 14, value: 1000}, 15],
          [{zoom: 14, value: 3000}, 20],
          [{zoom: 14, value: 5000}, 25],
          [{zoom: 14, value: 10000}, 30],
          [{zoom: 15.5, value: 0}, 6],
          [{zoom: 15.5, value: 50}, 10],
          [{zoom: 15.5, value: 100}, 16],
          [{zoom: 15.5, value: 250}, 20],
          [{zoom: 15.5, value: 500}, 28],
          [{zoom: 15.5, value: 1000}, 34],
          [{zoom: 15.5, value: 3000}, 40],
          [{zoom: 15.5, value: 5000}, 45],
          [{zoom: 15.5, value: 10000}, 50],
        ]
      }
    }
  });
  map.addLayer({
    id: "bslStops",
    type: "circle",
    source: "bslStops",
    paint: {
      "circle-color": "#f78c1f",
      "circle-opacity": 0.75,
      "circle-radius": {
        property: "Average_Weekday_Ridership",
        type: "exponential",
        stops: [
          [{zoom: 14, value: 0}, 2],
          [{zoom: 14, value: 50}, 4],
          [{zoom: 14, value: 100}, 6],
          [{zoom: 14, value: 250}, 8],
          [{zoom: 14, value: 500}, 12],
          [{zoom: 14, value: 1000}, 15],
          [{zoom: 14, value: 3000}, 20],
          [{zoom: 14, value: 5000}, 25],
          [{zoom: 14, value: 10000}, 30],
          [{zoom: 15.5, value: 0}, 6],
          [{zoom: 15.5, value: 50}, 10],
          [{zoom: 15.5, value: 100}, 16],
          [{zoom: 15.5, value: 250}, 20],
          [{zoom: 15.5, value: 500}, 28],
          [{zoom: 15.5, value: 1000}, 34],
          [{zoom: 15.5, value: 3000}, 40],
          [{zoom: 15.5, value: 5000}, 45],
          [{zoom: 15.5, value: 10000}, 50],
        ]
      }
    }
  });

  map.addLayer({
    id: "trolleyStops",
    type: "circle",
    source: "trolleyStops",
    paint: {
      "circle-color": "#49B048",
      "circle-opacity": 0.75,
      "circle-radius": {
        property: "Weekday_Boards",
        type: "exponential",
        stops: [
          [{zoom: 14, value: 0}, 2],
          [{zoom: 14, value: 50}, 4],
          [{zoom: 14, value: 100}, 6],
          [{zoom: 14, value: 250}, 8],
          [{zoom: 14, value: 500}, 12],
          [{zoom: 14, value: 1000}, 15],
          [{zoom: 14, value: 3000}, 20],
          [{zoom: 14, value: 5000}, 25],
          [{zoom: 14, value: 10000}, 30],
          [{zoom: 15.5, value: 0}, 6],
          [{zoom: 15.5, value: 50}, 10],
          [{zoom: 15.5, value: 100}, 16],
          [{zoom: 15.5, value: 250}, 20],
          [{zoom: 15.5, value: 500}, 28],
          [{zoom: 15.5, value: 1000}, 34],
          [{zoom: 15.5, value: 3000}, 40],
          [{zoom: 15.5, value: 5000}, 45],
          [{zoom: 15.5, value: 10000}, 50],
        ]
      }
    }
  });

  // ADD BUS STOPS TO MAP
  map.addLayer({
    id: "busStops",
    type: "circle",
    source: "busStops",
    paint: {
      "circle-color": "#45A29E",
      "circle-opacity": 0.75,
      "circle-radius": {
        property: "Weekday_Boards",
        type: "exponential",
        stops: [
          [{zoom: 14, value: 0}, 2],
          [{zoom: 14, value: 50}, 4],
          [{zoom: 14, value: 100}, 6],
          [{zoom: 14, value: 250}, 8],
          [{zoom: 14, value: 500}, 12],
          [{zoom: 14, value: 1000}, 15],
          [{zoom: 14, value: 3000}, 20],
          [{zoom: 14, value: 5000}, 25],
          [{zoom: 14, value: 10000}, 30],
          [{zoom: 15.5, value: 0}, 6],
          [{zoom: 15.5, value: 50}, 10],
          [{zoom: 15.5, value: 100}, 16],
          [{zoom: 15.5, value: 250}, 20],
          [{zoom: 15.5, value: 500}, 28],
          [{zoom: 15.5, value: 1000}, 34],
          [{zoom: 15.5, value: 3000}, 40],
          [{zoom: 15.5, value: 5000}, 45],
          [{zoom: 15.5, value: 10000}, 50],
        ]
      }
    }
  });
}

function addRoutesLayer(map) {
  map.addLayer({
    id: "busRoutes",
    type: "line",
    source: "busRoutes",
    paint: {
      "line-width": 5,
      "line-color": "#45A29E",
      "line-opacity": 0.75
    },
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    filter: ("routes", ["==", "School_Route", "No"])
  });
  map.addLayer({
    id: "trolleyRoutes",
    type: "line",
    source: "trolleyRoutes",
    paint: {
      "line-width": 5,
      "line-color": "#49b048",
      "line-opacity": 0.75
    }
  });
  map.addLayer({
    id: "bslRoute",
    type: "line",
    source: "bslRoute",
    paint: {
      "line-width": 5,
      "line-color": "#f78c1f",
      "line-opacity": 0.75
    }
  });
  map.addLayer({
    id: "mflRoute",
    type: "line",
    source: "mflRoute",
    paint: {
      "line-width": 5,
      "line-color": "#4377BC",
      "line-opacity": 0.75
    }
  });
  map.addLayer({
    id: "rrRoutes",
    type: "line",
    source: "rrRoutes",
    paint: {
      "line-width": 5,
      "line-color": "#1f2833",
      "line-opacity": 0.75
    }
  });
}

function makeSurfaceStopPopups(coordinates, map, e) {
  //console.log(e);
  var description = [
    "<h5>" +
    e.features[0].properties.Stop_Name +
    "</h5>" +
    "<p>" +
    "Stop ID: " +
    e.features[0].properties.Stop_ID +
    "<br>" +
    "Routes that Stop Here: " +
    e.features[0].properties.routeNumbers +
    "<br>" +
    "Average Daily Boards: " +
    Math.round(e.features[0].properties.Weekday_Boards).toLocaleString() +
    "<br>" +
    "Average Daily Leaves: " +
    Math.round(e.features[0].properties.Weekday_Leaves).toLocaleString() +
    "<br>" +
    "Average Daily Total: " +
    Math.round(e.features[0].properties.Weekday_Total).toLocaleString() +
    "</p>"
  ];
  new mapboxgl.Popup({ offset: [0, -15] })
  .setLngLat(coordinates)
  .setHTML(description)
  .addTo(map)
  .on('close', function(x) {
    //console.log('closed');
    popupTracker = false;
  });
}

function makeRailStopPopups(coordinates, map, e) {
  var description = [
    "<h5>" +
    e.features[0].properties.Station +
    "</h5>" +
    "<p>" +
    "Stop ID: " +
    e.features[0].properties.Stop_ID +
    "<br>" +
    "Average Weekday Ridership: " +
    Math.round(e.features[0].properties.Average_Weekday_Ridership).toLocaleString() +
    "<br>" +
    "Average Saturday Ridership: " +
    Math.round(e.features[0].properties.Average_Saturday_Ridership).toLocaleString() +
    "<br>" +
    "Average Sunday Ridership: " +
    Math.round(e.features[0].properties.Average_Sunday_Ridership).toLocaleString() +
    "</p>"
  ];
  new mapboxgl.Popup({ offset: [0, -15] })
  .setLngLat(coordinates)
  .setHTML(description)
  .addTo(map)
  .on('close', function(x) {
    //console.log('closed');
    popupTracker = false;
  });
}

function makeRoutePopups(coordinates, map, e){
  var description = [
    "<h5>" +
    "Route " +
    e.features[0].properties.Route +
    "</h5>" +
    "<p>" +
    e.features[0].properties.Route_Name + "<br>" +
    "Average Weekday Ridership: " +
    Math.round(e.features[0].properties.Average_Weekday_Passengers).toLocaleString() + "<br>" +
    "Operating Ratio: " + e.features[0].properties.Operating_Ratio + "%" + "<br>" +
    "Vehicles Used: " + e.features[0].properties.Vehicle_Group +
    "</p>"
  ];

  // put up a popup
  new mapboxgl.Popup({ offset: [0, -15] })
  .setLngLat(coordinates)
  .setHTML(description)
  .addTo(map)
  .on('close', function(x) {
    //console.log('closed');
    popupTracker = false;
  });
  //console.log("making a popup");
}
function makeRRStopPopups(coordinates, map, e) {
  var description = [
    "<h5>" +
    e.features[0].properties.Station_Name +
    "</h5>" +
    "<p>" +
    "Stop ID: " +
    e.features[0].properties.Stop_ID +
    "<br>" +
    "Average Weekday Ridership: " +
    Math.round(e.features[0].properties["Weekday_Total_Boards"]).toLocaleString() +
    "<br>" +
    "Average Saturday Ridership: " +
    Math.round(e.features[0].properties["Saturday_Total_Boards"]).toLocaleString() +
    "<br>" +
    "Average Sunday Ridership: " +
    Math.round(e.features[0].properties["Sunday_Total_Boards"]).toLocaleString() +
    "</p>"
  ];
  new mapboxgl.Popup({ offset: [0, -15] })
  .setLngLat(coordinates)
  .setHTML(description)
  .addTo(map)
  .on('close', function(x) {
    //console.log('closed');
    popupTracker = false;
  });
}
function makeRRRoutePopups(coordinates, map, e){
  var description = [
    "<h5>" +
    e.features[0].properties.Route_Name +
    "</h5>" +
    "<p>" +
    "Average Weekday Ridership: " +
    Math.round(e.features[0].properties.Total_Weekday_Boards).toLocaleString() + "<br>" +
    "Operating Ratio: " + e.features[0].properties.Operating_Ratio + "%" + "<br>" +
    "</p>"
  ];

  // put up a popup
  new mapboxgl.Popup({ offset: [0, -15] })
  .setLngLat(coordinates)
  .setHTML(description)
  .addTo(map)
  .on('close', function(x) {
    //console.log('closed');
    popupTracker = false;
  });
  //console.log("making a popup");
}

function makeRoutesVisible(map){
  map.setLayoutProperty("busRoutes", "visibility", "visible");
  map.setLayoutProperty("trolleyRoutes", "visibility", "visible");
  map.setLayoutProperty("mflRoute", "visibility", "visible");
  map.setLayoutProperty("bslRoute", "visibility", "visible");
  map.setLayoutProperty("rrRoutes", "visibility", "visible");
}

function makeRoutesInvisible(map){
  map.setLayoutProperty("busRoutes", "visibility", "none");
  map.setLayoutProperty("trolleyRoutes", "visibility", "none");
  map.setLayoutProperty("mflRoute", "visibility", "none");
  map.setLayoutProperty("bslRoute", "visibility", "none");
  map.setLayoutProperty("rrRoutes", "visibility", "none");
}

function makeStopsVisible(map){
  map.setLayoutProperty("busStops", "visibility", "visible");
  map.setLayoutProperty("trolleyStops", "visibility", "visible");
  map.setLayoutProperty("bslStops", "visibility", "visible");
  map.setLayoutProperty("mflStops", "visibility", "visible");
  map.setLayoutProperty("rrStops", "visibility", "visible");
}

function makeStopsInvisible(map){
  map.setLayoutProperty("busStops", "visibility", "none");
  map.setLayoutProperty("trolleyStops", "visibility", "none");
  map.setLayoutProperty("bslStops", "visibility", "none");
  map.setLayoutProperty("mflStops", "visibility", "none");
  map.setLayoutProperty("rrStops", "visibility", "none");
}
