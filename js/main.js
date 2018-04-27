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

var stopIDs = []; //used to hold stop IDs to search against
var stopSearchInput = document.getElementById("stopSearch");
var routeSearchInput = document.getElementById("routeSearch");

var centerCoordinates = [-75.15901565579941, 39.94756033306919];

mapboxgl.accessToken =
  "pk.eyJ1IjoidGFuZHJld3NpbXBzb24iLCJhIjoiY2ludXlsY3ZsMTJzN3Rxa2oyNnplZjB1ZyJ9.bftIKd0sAwvSIGWxIDbSSw";

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
        Math.round(e.features[0].properties.Weekday_Boards) +
        "<br>" +
        "Average Daily Leaves: " +
        Math.round(e.features[0].properties.Weekday_Leaves) +
        "<br>" +
        "Average Daily Total: " +
        Math.round(e.features[0].properties.Weekday_Total) +
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
        Math.round(e.features[0].properties.Weekday_Boards) +
        "<br>" +
        "Average Daily Leaves: " +
        Math.round(e.features[0].properties.Weekday_Leaves) +
        "<br>" +
        "Average Daily Total: " +
        Math.round(e.features[0].properties.Weekday_Total) +
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
        Math.round(e.features[0].properties.Average_Weekday_Ridership) +
        "<br>" +
        "Average Saturday Ridership: " +
        Math.round(e.features[0].properties.Average_Saturday_Ridership) +
        "<br>" +
        "Average Sunday Ridership: " +
        Math.round(e.features[0].properties.Average_Sunday_Ridership) +
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
        Math.round(e.features[0].properties.Average_Weekday_Ridership) +
        "<br>" +
        "Average Saturday Ridership: " +
        Math.round(e.features[0].properties.Average_Saturday_Ridership) +
        "<br>" +
        "Average Sunday Ridership: " +
        Math.round(e.features[0].properties.Average_Sunday_Ridership) +
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

map_routes.on("load", function() {
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

  map_routes.addControl(new mapboxgl.NavigationControl());

  // helper function that takes in a route number and filters to that route
  function filterRoutes(routeNumber) {
    if (routeNumber == "") {
      map_routes.setFilter("routes", ["==", "School_Route", "No"]);
      map_routes.setFilter("trolleyRoutes", null);
      map_routes.setFilter("mflRoute", null);
      map_routes.setFilter("bslRoute", null);
    } else {
      map_routes.setFilter("routes", ["==", "Route", routeNumber]);
      map_routes.setFilter("trolleyRoutes", ["==", "Route", routeNumber]);
      map_routes.setFilter("mflRoute", ["==", "Route", routeNumber]);
      map_routes.setFilter("bslRoute", ["==", "Route", routeNumber]);
    }
  }

  // collect all of the layers
  var mapRoutesLayers = ["routes", "trolleyRoutes", "mflRoute", "bslRoute"];

  // using _.each to control all of the layers at once
  _.each(mapRoutesLayers, function(x) {

    // manage the cursor over each layer
    map_routes.on("mouseenter", x, function() {
      map_routes.getCanvas().style.cursor = "pointer";
    });
    map_routes.on("mouseleave", "busStops", function() {
      map_routes.getCanvas().style.cursor = "";
    });

    // manage the logic of clicking on a layer
    map_routes.on("click", x, function(e) {
      var coordinates = e.lngLat;
      var description = [
        "<h5>" +
          "Route " +
          e.features[0].properties.Route +
          "</h5>" +
          "<p>" +
          "Average Weekday Ridership: " +
          Math.round(e.features[0].properties.Average_Weekday_Passengers) +
          "</p>"
      ];

      // put up a popup
      new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map_routes);

      var routeNumber = e.features[0].properties.Route;
      filterRoutes(routeNumber);

      // update the search box to allow the user to clear
      $("#routeSearch")[0].parentElement.MaterialTextfield.change(
        e.features[0].properties.Route
      );

      // needs logic for when user clicks elsewhere, map resets
    });
  });

  // search by text input
  routeSearchInput.addEventListener("keyup", function(e) {
    var routeNumber = e.target.value;
    filterRoutes(routeNumber);
  });

});

/* =====================================

GEOGRAPHIES MAP

===================================== */

var map_geographies = new mapboxgl.Map({
  container: "map_geographies",
  style: "mapbox://styles/mapbox/light-v9",
  center: centerCoordinates,
  zoom: 11
});

var neighborhoodsList = [];

map_geographies.on("load", function() {
  map_geographies.addSource("neighborhoods", {
    type: "geojson",
    data:
      "https://raw.githubusercontent.com/tsimps/midterm-project/master/data/neighborhoods.geojson"
  });

  map_geographies.addLayer({
    id: "neighborhoods",
    type: "fill",
    source: "neighborhoods",
    layout: {},
    paint: {
      "fill-color": "#66FCF1",
      "fill-opacity": 0.2,
      "fill-outline-color": "#1F2833"
    }
  });
});
