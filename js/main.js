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

var stopNames = []; //used to hold stop IDs to search against
var stopSearchInput = document.getElementById("stopSearch");
var stopNameSearchInput = document.getElementById("stopNameSearch");
var routeSearchInput = document.getElementById("routeSearch");

var highPerformanceInput = document.getElementById("highPerformanceSlider");
var lowPerformanceInput = document.getElementById("lowPerformanceSlider");


var centerCoordinates = [-75.15901565579941, 39.94756033306919];

mapboxgl.accessToken =
"pk.eyJ1IjoidGFuZHJld3NpbXBzb24iLCJhIjoiY2ludXlsY3ZsMTJzN3Rxa2oyNnplZjB1ZyJ9.bftIKd0sAwvSIGWxIDbSSw";

// helper function that takes in a route number and filters to that route
function filterRoutes(routeNumber) {
  if (routeNumber == "") {
    map_routes.setFilter("routes", ["==", "School_Route", "No"]);
    map_routes.setFilter("trolleyRoutes", null);
    map_routes.setFilter("mflRoute", null);
    map_routes.setFilter("bslRoute", null);

    // remove all stops
    map_routes.setLayoutProperty("busStops", "visibility", "none");
    map_routes.setLayoutProperty("trolleyStops", "visibility", "none");
    map_routes.setLayoutProperty("mflStops", "visibility", "none");
    map_routes.setLayoutProperty("bslStops", "visibility", "none");

  } else {
    map_routes.setFilter("routes", ["==", "Route", routeNumber]);
    map_routes.setFilter("trolleyRoutes", ["==", "Route", routeNumber]);
    map_routes.setFilter("mflRoute", ["==", "Route", routeNumber]);
    map_routes.setFilter("bslRoute", ["==", "Route", routeNumber]);


  }
}


/* ======================================

STOP MAPPING PAGE

====================================== */

// Set up the map for the stops page
var map_stops = new mapboxgl.Map({
  container: "map_stops",
  style: "mapbox://styles/mapbox/light-v9",
  center: centerCoordinates,
  zoom: 11
});

// on load, add the sources and layers
map_stops.on("load", function() {
  map_stops.addSource("mflStops", {
    type: "geojson",
    data: septaMFLStops
  });
  map_stops.addSource("bslStops", {
    type: "geojson",
    data: septaBSLStops
  });
  map_stops.addSource("trolleyStops", {
    type: "geojson",
    data: septaTrolleyStops
  });
  map_stops.addSource("busStops", {
    type: "geojson",
    data: septaBusStops
  });

  map_stops.addLayer({
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
          [0, 2],
          [50, 4],
          [100, 6],
          [250, 8],
          [500, 12],
          [1000, 15],
          [3000, 20],
          [5000, 25]
        ]
      }
    }
  });

  map_stops.addLayer({
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
          [0, 2],
          [50, 4],
          [100, 6],
          [250, 8],
          [500, 12],
          [1000, 15],
          [3000, 20],
          [5000, 25]
        ]
      }
    }
  });

  map_stops.addLayer({
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
          [0, 2],
          [50, 4],
          [100, 6],
          [250, 8],
          [500, 12],
          [1000, 15],
          [2000, 20],
          [3000, 25]
        ]
      }
    }
  });

  // ADD BUS STOPS TO MAP
  map_stops.addLayer({
    id: "busStops",
    type: "circle",
    source: "busStops",
    paint: {
      "circle-color": "#1F2833",
      "circle-opacity": 0.75,
      "circle-radius": {
        property: "Weekday_Boards",
        type: "exponential",
        stops: [[0, 2], [50, 4], [100, 6], [250, 8], [500, 12], [1000, 15]]
      }
    }
  });

  //septaBusStops.features.forEach(function(feature) {}

  map_stops.addControl(new mapboxgl.NavigationControl());

  // start up the stopID search event listener
  stopSearchInput.addEventListener("keyup", function(e) {
    var value = e.target.value.trim().toLowerCase();

    // when the value is null, don't filter
    if (value == "") {
      map_stops.setFilter("busStops", null);
      map_stops.setFilter("trolleyStops", null);
      map_stops.setFilter("mflStops", null);
      map_stops.setFilter("bslStops", null);
    } else {
      // if there is a value present, filter based on that value
      map_stops.setFilter("busStops", ["==", "Stop_ID", parseInt(value)]);
      map_stops.setFilter("trolleyStops", ["==", "Stop_ID", parseInt(value)]);
      map_stops.setFilter("mflStops", ["==", "Stop_ID", parseInt(value)]);
      map_stops.setFilter("bslStops", ["==", "Stop_ID", parseInt(value)]);
    }
  });

  //console.log(map_stops.getLayer("busStops"));



  //stopNames.push(feature.properties.Stop_Name);

  // start up the stopNameSearch  event listener
  stopNameSearch.addEventListener("keyup", function(e) {
    var value = e.target.value;
    console.log('VALUE', value);

    // when the value is null, don't filter
    if (value == "") {
      map_stops.setFilter("busStops", null);
      map_stops.setFilter("trolleyStops", null);
      map_stops.setFilter("mflStops", null);
      map_stops.setFilter("bslStops", null);
    } else {
      // if there is a value present, filter based on that value
      map_stops.setFilter("busStops", ["==", "Stop_Name", value]);
      map_stops.setFilter("trolleyStops", ["==", "Stop_Name", value]);
      map_stops.setFilter("mflStops", ["==", "Station", value]);
      map_stops.setFilter("bslStops", ["==", "Station", value]);
    }
  });

  // BUS STOP POPUPS
  map_stops.on("click", "busStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = [
      "<h5>" +
      e.features[0].properties.Stop_Name +
      "</h5>" +
      "<p>" +
      "Stop ID: " +
      e.features[0].properties.Stop_ID +
      "<br>" +
      "Direction: " +
      e.features[0].properties.Direction +
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
    .addTo(map_stops);
  });

  // TROLLEY STOP POPUPS
  map_stops.on("click", "trolleyStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = [
      "<h5>" +
      e.features[0].properties.Stop_Name +
      "</h5>" +
      "<p>" +
      "Stop ID: " +
      e.features[0].properties.Stop_ID +
      "<br>" +
      "Direction: " +
      e.features[0].properties.Direction +
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
    .addTo(map_stops);
  });

  // MFL STOP POPUPS
  map_stops.on("click", "mflStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
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
    .addTo(map_stops);
  });

  // BSL STOP POPUPS
  map_stops.on("click", "bslStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
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
    .addTo(map_stops);
  });

  var mapStopsLayers = ["busStops", "trolleyStops", "mflStops", "bslStops"];
  _.each(mapStopsLayers, function(x) {
    map_stops.on("mouseenter", x, function() {
      map_stops.getCanvas().style.cursor = "pointer";
    });
    map_stops.on("mouseleave", "busStops", function() {
      map_stops.getCanvas().style.cursor = "";
    });
  });
});

// LAYER CONTROL
var busBox = document.querySelector('input[id="bus"]');
var trolleyBox = document.querySelector('input[id="trolley"]');
var mflBox = document.querySelector('input[id="mfl"]');
var bslBox = document.querySelector('input[id="bsl"]');

var layerBoxes = [busBox, trolleyBox, mflBox, bslBox];

_.each(layerBoxes, function(box) {
  //console.log(box);
  box.onchange = function() {
    if (busBox.checked) {
      map_stops.setLayoutProperty("busStops", "visibility", "visible");
    } else {
      map_stops.setLayoutProperty("busStops", "visibility", "none");
    }
    if (trolleyBox.checked) {
      map_stops.setLayoutProperty("trolleyStops", "visibility", "visible");
    } else {
      map_stops.setLayoutProperty("trolleyStops", "visibility", "none");
    }
    if (mflBox.checked) {
      map_stops.setLayoutProperty("mflStops", "visibility", "visible");
    } else {
      map_stops.setLayoutProperty("mflStops", "visibility", "none");
    }
    if (bslBox.checked) {
      map_stops.setLayoutProperty("bslStops", "visibility", "visible");
    } else {
      map_stops.setLayoutProperty("bslStops", "visibility", "none");
    }
  };
});



/* =====================================

ROUTES MAP

===================================== */



var map_routes = new mapboxgl.Map({
  container: "map_routes",
  style: "mapbox://styles/mapbox/light-v9",
  center: centerCoordinates,
  zoom: 11
});
var routeMapIsFresh = true;

map_routes.on("load", function() {
  var popupTracker = false;

  map_routes.addSource("routes", {
    type: "geojson",
    data: septaBusRoutes
  });
  map_routes.addSource("trolleyRoutes", {
    type: "geojson",
    data: septaTrolleyRoutes
  });
  map_routes.addSource("bslRoute", {
    type: "geojson",
    data: septaBSLRoute
  });
  map_routes.addSource("mflRoute", {
    type: "geojson",
    data: septaMFLRoute
  });

  map_routes.addLayer({
    id: "routes",
    type: "line",
    source: "routes",
    paint: {
      "line-width": 3,
      "line-color": "#1f2833"
    },
    filter: ("routes", ["==", "School_Route", "No"])
  });
  map_routes.addLayer({
    id: "trolleyRoutes",
    type: "line",
    source: "trolleyRoutes",
    paint: {
      "line-width": 3,
      "line-color": "#49b048"
    }
  });
  map_routes.addLayer({
    id: "bslRoute",
    type: "line",
    source: "bslRoute",
    paint: {
      "line-width": 5,
      "line-color": "#f78c1f"
    }
  });
  map_routes.addLayer({
    id: "mflRoute",
    type: "line",
    source: "mflRoute",
    paint: {
      "line-width": 5,
      "line-color": "#4377BC"
    }
  });

  // ADD STOP LAYER DATA
  // if a bus...
  map_routes.addSource("busStops", {
    type: "geojson",
    data: septaBusStops
  });
  map_routes.addSource("trolleyStops", {
    type: "geojson",
    data: septaTrolleyStops
  });
  map_routes.addSource("mflStops", {
    type: "geojson",
    data: septaMFLStops
  });
  map_routes.addSource("bslStops", {
    type: "geojson",
    data: septaBSLStops
  });

  // ADD BUS STOPS TO MAP
  map_routes.addLayer({
    id: "busStops",
    type: "circle",
    source: "busStops",
    paint: {
      "circle-color": "#1F2833",
      "circle-opacity": 0.75,
      "circle-radius": {
        property: "Weekday_Boards",
        type: "exponential",
        stops: [[0, 2], [50, 4], [100, 6], [250, 8], [500, 12], [1000, 15]]
      }
    },
  });

  map_routes.addLayer({
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
          [0, 2],
          [50, 4],
          [100, 6],
          [250, 8],
          [500, 12],
          [1000, 15],
          [3000, 20],
          [5000, 25]
        ]
      }
    }
  });

  map_routes.addLayer({
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
          [0, 2],
          [50, 4],
          [100, 6],
          [250, 8],
          [500, 12],
          [1000, 15],
          [3000, 20],
          [5000, 25]
        ]
      }
    }
  });

  map_routes.addLayer({
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
          [0, 2],
          [50, 4],
          [100, 6],
          [250, 8],
          [500, 12],
          [1000, 15],
          [2000, 20],
          [3000, 25]
        ]
      }
    }
  });

  // BUS STOP POPUPS
  map_routes.on("click", "busStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();

    var description = [
      "<h5>" +
      e.features[0].properties.Stop_Name +
      "</h5>" +
      "<p>" +
      "Stop ID: " +
      e.features[0].properties.Stop_ID +
      "<br>" +
      "Direction: " +
      e.features[0].properties.Direction +
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
    .addTo(map_routes)
    .on('close', function(b) {
      console.log('closed');
      popupTracker = false;
    });

    popupTracker = true;
  });

  // TROLLEY STOP POPUPS
  map_routes.on("click", "trolleyStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = [
      "<h5>" +
      e.features[0].properties.Stop_Name +
      "</h5>" +
      "<p>" +
      "Stop ID: " +
      e.features[0].properties.Stop_ID +
      "<br>" +
      "Direction: " +
      e.features[0].properties.Direction +
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
    .addTo(map_routes)
    .on('close', function(b) {
      console.log('closed');
      popupTracker = false;
    });

    popupTracker = true;
  });

  // MFL STOP POPUPS
  map_routes.on("click", "mflStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
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
    .addTo(map_routes)
    .on('close', function(b) {
      console.log('closed');
      popupTracker = false;
    });

    popupTracker = true;
  });

  // BSL STOP POPUPS
  map_routes.on("click", "bslStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
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
    .addTo(map_routes)
    .on('close', function(b) {
      console.log('closed');
      popupTracker = false;
    });

    popupTracker = true;
  });

  // array to hold all 4  stop layers
  var mapStopsLayers = ["busStops", "trolleyStops", "mflStops", "bslStops"];

  // set the pointer/graber for each layer
  _.each(mapStopsLayers, function(x) {
    map_routes.on("mouseenter", x, function() {
      map_routes.getCanvas().style.cursor = "pointer";
    });
    map_routes.on("mouseleave", "busStops", function() {
      map_routes.getCanvas().style.cursor = "";
    });
  });

  // mute the stops layers until a route is chosen
  map_routes.setLayoutProperty("busStops", "visibility", "none");
  map_routes.setLayoutProperty("trolleyStops", "visibility", "none");
  map_routes.setLayoutProperty("bslStops", "visibility", "none");
  map_routes.setLayoutProperty("mflStops", "visibility", "none");

  map_routes.addControl(new mapboxgl.NavigationControl());





  // array to hold all 4  route layers
  var mapRoutesLayers = ["routes", "trolleyRoutes", "mflRoute", "bslRoute"];
  var data;
  var dataArray = [];
  _.each(mapRoutesLayers, function(x) {

    // manage the cursor over each layer
    map_routes.on("mouseenter", x, function() {
      map_routes.getCanvas().style.cursor = "pointer";
    });
    map_routes.on("mouseleave", "busStops", function() {
      map_routes.getCanvas().style.cursor = "";
    });

    var a = map_routes.querySourceFeatures(x);



  });


  var routeRidershipDatabase = {};

  map_routes.on("data", function(data) {

    if (data.dataType === 'source' && data.isSourceLoaded && routeMapIsFresh === true) {
      console.log('data loaded', data);


      _.each(mapRoutesLayers, function(x) {
        var a = map_routes.querySourceFeatures(x);
        //console.log(a);
        // dataArray now holds four different array, each of which has all of the features
        dataArray.push(a);
      });

      //console.log(dataArray);
      var labels = [busRidership, trolleyRidership, mflRidership, bslRidership];
      var dat = [];
      var busRidership, trolleyRidership, mflRidership, bslRidership;


      // for each data arracy
      _.each(dataArray, function(x) {
        //console.log(x);
        // for each array within dataArray[0] i.e. the busRoutes...
        var ridershipHolder = 0;

        _.each(x, function(y) {
          //console.log(y);
          //console.log(y.properties.Route);
          // filter out school routes

          //labels.push(y.properties.Route);
          //dat.push(y.properties.Average_Weekday_Passengers);
          var ridership = y.properties.Average_Weekday_Passengers;

          if (ridership > 0 && y.properties.School_Route === "No" ){
            ridershipHolder += ridership;
          }
          else if (y.properties.Route === "Market-Frankford Line" || y.properties.Route === "Broad Street Line") {
            ridershipHolder += ridership;
          }

        });
        dat.push(ridershipHolder);
        //console.log('DAT', dat);

      });
      //console.log(labels);
      //console.log(dat);

      var toolTipNumber = wNumb({
        decimals: 0,
        thousand: ',',
      });

      // construct chart here
      var ctx = document.getElementById("routesChart").getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ["Bus", "Trolley", "MFL", "BSL"],
          datasets: [{
            data: dat,
            backgroundColor: ["rgba(11,12,16,0.7)", "rgba(051,181,011,0.7)", "rgba(000,128,255,0.7)", "rgba(255,140,000,0.7)"],
            backgroundOpacity: 0.75
          }],
        },
        options: {
          title: {
            display: true,
            position: "top",
            text: 'Ridership by Mode'
          }
        }
      });


      // stop listening to map.on('data'), if applicable
      routeMapIsFresh = false;

    }
  });

  map_routes.querySourceFeatures("routes");

  _.each(map_routes.querySourceFeatures("routes"), function(x){
    console.log('loop');

  });
  //console.log(sourceRoutes);






  map_routes.on("click", function(e) {

    var layerClick = false;

    // using _.each to control all of the layers at once
    _.each(mapRoutesLayers, function(x) {

      // manage the logic of clicking on a layer feature, where x is the feature
      map_routes.on("click", x, function(e) {
        console.log("layer click");
        layerClick = true;

        var coordinates = e.lngLat;
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
        .addTo(map_routes);

        // hold the routeNumber the user clicked on
        var routeNumber = e.features[0].properties.Route;

        // use the filterRoutes helper function
        filterRoutes(routeNumber);

        // make the now filtered routes visible
        //refactor this code into filterStops() helper
        map_routes.setFilter("busStops", ["==", "Route", routeNumber]);
        map_routes.setLayoutProperty("busStops", "visibility", "visible");

        map_routes.setFilter("trolleyStops", ["==", "Route", routeNumber]);
        map_routes.setLayoutProperty("trolleyStops", "visibility", "visible");

        map_routes.setFilter("mflStops", ["==", "Route", routeNumber]);
        map_routes.setLayoutProperty("mflStops", "visibility", "visible");

        map_routes.setFilter("bslStops", ["==", "Route", routeNumber]);
        map_routes.setLayoutProperty("bslStops", "visibility", "visible");

        // update the search box to allow the user to clear
        $("#routeSearch")[0].parentElement.MaterialTextfield.change(
          e.features[0].properties.Route
        );
      });

      if (layerClick === false && popupTracker === false) {
        console.log('mapclick');

        // clear the map
        var routeNumber = "";
        filterRoutes(routeNumber);
        $("#routeSearch")[0].parentElement.MaterialTextfield.change(
          ""
        );
        if (routeMapIsFresh === false){
          routeMapIsFresh = true;
        }
        if (routeMapIsFresh === true){
          routeMapIsFresh = false;
        }
      }
    });
  });

  // search by text input
  routeSearchInput.addEventListener("keyup", function(e) {
    var routeNumber = e.target.value;
    filterRoutes(routeNumber);

    map_routes.setFilter("busStops", ["==", "Route", routeNumber]);
    map_routes.setLayoutProperty("busStops", "visibility", "visible");

    map_routes.setFilter("trolleyStops", ["==", "Route", routeNumber]);
    map_routes.setLayoutProperty("trolleyStops", "visibility", "visible");

    map_routes.setFilter("mflStops", ["==", "Route", routeNumber]);
    map_routes.setLayoutProperty("mflStops", "visibility", "visible");

    map_routes.setFilter("bslStops", ["==", "Route", routeNumber]);
    map_routes.setLayoutProperty("bslStops", "visibility", "visible");

  });
});

/* =====================================

PERFORMANCE MAP

===================================== */

var map_performance = new mapboxgl.Map({
  container: "map_performance",
  style: "mapbox://styles/mapbox/light-v9",
  center: centerCoordinates,
  zoom: 11
});

var slider = document.getElementById('slider1');

noUiSlider.create(slider, {
  start: [0, 100],
  connect: true,
  step: 1,
  behaviour: 'drag',
  format: wNumb({
    decimals: 0,
    suffix: '%',
  }),
  range: {
    'min': 0,
    'max': 100
  },

  tooltips: [ true, true ],
});

document.getElementById('lowPerformanceButton').addEventListener('click', function(){
  slider1.noUiSlider.set( [0, 20] );
});
document.getElementById('midPerformanceButton').addEventListener('click', function(){
  slider1.noUiSlider.set( [20, 40] );
});
document.getElementById('highPerformanceButton').addEventListener('click', function(){
  slider1.noUiSlider.set( [40, 100] );
});
document.getElementById('fullSystemButton').addEventListener('click', function(){
  slider1.noUiSlider.set( [0, 100] );
});
document.getElementById('filterSuburbanButton').addEventListener('click', function(){
  var filter = ["all", ["==", "Revenue", "City"]];
  map_performance.setFilter("busRoutes", filter);
  map_performance.setFilter("trolleyRoutes", filter);

  map_performance.setLayoutProperty("busRoutes", "visibility", "visible");
  map_performance.setLayoutProperty("trolleyRoutes", "visibility", "visible");
});


map_performance.on("load", function() {
  map_performance.addSource("busRoutes", {
    type: "geojson",
    data: septaBusRoutes
  });
  map_performance.addSource("trolleyRoutes", {
    type: "geojson",
    data: septaTrolleyRoutes
  });
  map_performance.addSource("bslRoute", {
    type: "geojson",
    data: septaBSLRoute
  });
  map_performance.addSource("mflRoute", {
    type: "geojson",
    data: septaMFLRoute
  });
  map_performance.addLayer({
    id: "busRoutes",
    type: "line",
    source: "busRoutes",
    paint: {
      "line-width": 5,
      "line-color": "#1f2833"
    },
    //filter: (["==", "School_Route", "No"]) //check this shit out above
  });
  map_performance.addLayer({
    id: "trolleyRoutes",
    type: "line",
    source: "trolleyRoutes",
    paint: {
      "line-width": 3,
      "line-color": "#49b048"
    }
  });
  map_performance.addLayer({
    id: "bslRoute",
    type: "line",
    source: "bslRoute",
    paint: {
      "line-width": 5,
      "line-color": "#f78c1f"
    }
  });
  map_performance.addLayer({
    id: "mflRoute",
    type: "line",
    source: "mflRoute",
    paint: {
      "line-width": 5,
      "line-color": "#4377BC"
    }
  });

  // mute the routes layers until a route is chosen
  map_performance.setLayoutProperty("busRoutes", "visibility", "none");
  map_performance.setLayoutProperty("trolleyRoutes", "visibility", "none");
  map_performance.setLayoutProperty("bslRoute", "visibility", "none");
  map_performance.setLayoutProperty("mflRoute", "visibility", "none");


  slider1.noUiSlider.on('update', function(values) {
    //console.log(values[0], values[1]);
    //console.log(typeof values[0]);
    var low = parseInt(values[0]);
    var high = parseInt(values[1]);

    // show the routes that have operating ration between vales[0] and values[1]
    var filter = ["all", [">=", "Operating_Ratio", low], ["<=", "Operating_Ratio", high]];
    map_performance.setFilter("busRoutes", filter);
    map_performance.setFilter("trolleyRoutes", filter);
    map_performance.setFilter("mflRoute", filter);
    map_performance.setFilter("bslRoute", filter);

    map_performance.setLayoutProperty("busRoutes", "visibility", "visible");
    map_performance.setLayoutProperty("trolleyRoutes", "visibility", "visible");
    map_performance.setLayoutProperty("mflRoute", "visibility", "visible");
    map_performance.setLayoutProperty("bslRoute", "visibility", "visible");


  });


  // ADD USER SELECTION FEATURE

});
