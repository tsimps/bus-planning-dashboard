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

var shelterDatabaseLink =
"https://raw.githubusercontent.com/tsimps/tsimps.github.io/master/data/shelter_json_31318.geojson";
var stopsRouteLink =
"https://raw.githubusercontent.com/tsimps/midterm-project/master/data/stops_routes_full.geojson";
var neighborhoodsLink =
"https://raw.githubusercontent.com/tsimps/midterm-project/master/data/neighborhoods.geojson";


var newBusDataLink = "https://raw.githubusercontent.com/tsimps/bus-planning-dashboard/master/data/busData.geojson";

var stopNames = []; //used to hold stop IDs to search against
var routeSearchInput = document.getElementById("routeSearch");

var highPerformanceInput = document.getElementById("highPerformanceSlider");
var lowPerformanceInput = document.getElementById("lowPerformanceSlider");

var popupTracker = false;


var centerCoordinates = [-75.15901565579941, 39.94756033306919];


mapboxgl.accessToken =
"pk.eyJ1IjoidGFuZHJld3NpbXBzb24iLCJhIjoiY2ludXlsY3ZsMTJzN3Rxa2oyNnplZjB1ZyJ9.bftIKd0sAwvSIGWxIDbSSw";

// helper function that takes in a route number and filters to that route
function filterRoutes(map, routeNumber) {
  if (routeNumber == "") {
    map.setFilter("busRoutes", ["==", "School_Route", "No"]);
    map.setFilter("trolleyRoutes", null);
    map.setFilter("mflRoute", null);
    map.setFilter("bslRoute", null);

    // remove all stops
    map.setLayoutProperty("busStops", "visibility", "none");
    map.setLayoutProperty("trolleyStops", "visibility", "none");
    map.setLayoutProperty("mflStops", "visibility", "none");
    map_routes.setLayoutProperty("bslStops", "visibility", "none");

  } else {
    map.setFilter("busRoutes", ["==", "Route", routeNumber]);
    map.setFilter("trolleyRoutes", ["==", "Route", routeNumber]);
    map.setFilter("mflRoute", ["==", "Route", routeNumber]);
    map.setFilter("bslRoute", ["==", "Route", routeNumber]);
  }
}

function filterStops(map, routeNumber) {
  map.setFilter("busStops", ["==", "Route", routeNumber]);
  map.setLayoutProperty("busStops", "visibility", "visible");

  map.setFilter("trolleyStops", ["==", "Route", routeNumber]);
  map.setLayoutProperty("trolleyStops", "visibility", "visible");

  map.setFilter("mflStops", ["==", "Route", routeNumber]);
  map.setLayoutProperty("mflStops", "visibility", "visible");

  map.setFilter("bslStops", ["==", "Route", routeNumber]);
  map.setLayoutProperty("bslStops", "visibility", "visible");
}

// function that adds all of the septa sources to a map

function addSeptaStopSources(map) {
  var septaBusStops =
  "https://opendata.arcgis.com/datasets/e9cf307d8408475ab1188f126ccaa1ba_0.geojson";
  var septaTrolleyStops =
  "https://opendata.arcgis.com/datasets/a5667eb6b6f945e8913b7b08b6733c09_0.geojson";
  var septaMFLStops =
  "https://opendata.arcgis.com/datasets/4496133dfe404fe2b534b13932473cd2_0.geojson";
  var septaBSLStops =
  "https://opendata.arcgis.com/datasets/19b1b9b8a6a64169a0d0bea590ad131e_0.geojson";

  map.addSource("mflStops", {
    type: "geojson",
    data: septaMFLStops
  });
  map.addSource("bslStops", {
    type: "geojson",
    data: septaBSLStops
  });
  map.addSource("trolleyStops", {
    type: "geojson",
    data: septaTrolleyStops
  });
  map.addSource("busStops", {
    type: "geojson",
    data: newBusDataLink
  });
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
}

function addStopsLayer(map) {
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
          [{zoom: 15.5, value: 0}, 6],
          [{zoom: 15.5, value: 50}, 10],
          [{zoom: 15.5, value: 100}, 16],
          [{zoom: 15.5, value: 250}, 20],
          [{zoom: 15.5, value: 500}, 28],
          [{zoom: 15.5, value: 1000}, 34],
          [{zoom: 15.5, value: 3000}, 40],
          [{zoom: 15.5, value: 5000}, 45],
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
          [{zoom: 15.5, value: 0}, 6],
          [{zoom: 15.5, value: 50}, 10],
          [{zoom: 15.5, value: 100}, 16],
          [{zoom: 15.5, value: 250}, 20],
          [{zoom: 15.5, value: 500}, 28],
          [{zoom: 15.5, value: 1000}, 34],
          [{zoom: 15.5, value: 3000}, 40],
          [{zoom: 15.5, value: 5000}, 45],
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
          [{zoom: 15.5, value: 0}, 6],
          [{zoom: 15.5, value: 50}, 10],
          [{zoom: 15.5, value: 100}, 16],
          [{zoom: 15.5, value: 250}, 20],
          [{zoom: 15.5, value: 500}, 28],
          [{zoom: 15.5, value: 1000}, 34],
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
      "circle-color": "#1F2833",
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
          [{zoom: 15.5, value: 0}, 6],
          [{zoom: 15.5, value: 50}, 10],
          [{zoom: 15.5, value: 100}, 16],
          [{zoom: 15.5, value: 250}, 20],
          [{zoom: 15.5, value: 500}, 28],
          [{zoom: 15.5, value: 1000}, 34],
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
      "line-width": 3,
      "line-color": "#1f2833"
    },
    filter: ("routes", ["==", "School_Route", "No"])
  });
  map.addLayer({
    id: "trolleyRoutes",
    type: "line",
    source: "trolleyRoutes",
    paint: {
      "line-width": 3,
      "line-color": "#49b048"
    }
  });
  map.addLayer({
    id: "bslRoute",
    type: "line",
    source: "bslRoute",
    paint: {
      "line-width": 5,
      "line-color": "#f78c1f"
    }
  });
  map.addLayer({
    id: "mflRoute",
    type: "line",
    source: "mflRoute",
    paint: {
      "line-width": 5,
      "line-color": "#4377BC"
    }
  });

}

function makeSurfaceStopPopups(coordinates, map, e) {
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

function makeRoutesVisible(map){
  map.setLayoutProperty("busRoutes", "visibility", "visible");
  map.setLayoutProperty("trolleyRoutes", "visibility", "visible");
  map.setLayoutProperty("mflRoute", "visibility", "visible");
  map.setLayoutProperty("bslRoute", "visibility", "visible");
}

function makeRoutesInvisible(map){
  map.setLayoutProperty("busRoutes", "visibility", "none");
  map.setLayoutProperty("trolleyRoutes", "visibility", "none");
  map.setLayoutProperty("mflRoute", "visibility", "none");
  map.setLayoutProperty("bslRoute", "visibility", "none");
}

function makeStopsVisible(map){
  map.setLayoutProperty("busStops", "visibility", "visible");
  map.setLayoutProperty("trolleyStops", "visibility", "visible");
  map.setLayoutProperty("bslStops", "visibility", "visible");
  map.setLayoutProperty("mflStops", "visibility", "visible");
}

function makeStopsInvisible(map){
  map.setLayoutProperty("busStops", "visibility", "none");
  map.setLayoutProperty("trolleyStops", "visibility", "none");
  map.setLayoutProperty("bslStops", "visibility", "none");
  map.setLayoutProperty("mflStops", "visibility", "none");
}
