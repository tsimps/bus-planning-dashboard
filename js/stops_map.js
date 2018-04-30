/* ======================================

STOP MAPPING PAGE

move to its own file

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

  addSeptaStopSources(map_stops);
  addStopsLayer(map_stops);
  map_stops.addControl(new mapboxgl.NavigationControl());

  var stopIDSearch = document.getElementById("stopSearch");
  var stopNameSearchInput = document.getElementById("stopNameSearch");

  // start up the stopID search event listener
  stopIDSearch.addEventListener("keyup", function(e) {
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

  // start up the stopNameSearch  event listener
  stopNameSearch.addEventListener("keyup", function(e) {
    var value = e.target.value;

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
    makeSurfaceStopPopups(coordinates, map_stops, e);
  });

  // TROLLEY STOP POPUPS
  map_stops.on("click", "trolleyStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    makeSurfaceStopPopups(coordinates, map_stops, e);
  });

  // MFL STOP POPUPS
  map_stops.on("click", "mflStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    makeRailStopPopups(coordinates, map_stops, e);
  });

  // BSL STOP POPUPS
  map_stops.on("click", "bslStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    makeRailStopPopups(coordinates, map_stops, e);
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
