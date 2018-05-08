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
      map_stops.setFilter("rrStops", null);
    } else {
      // if there is a value present, filter based on that value
      map_stops.setFilter("busStops", ["==", "Stop_ID", parseInt(value)]);
      map_stops.setFilter("trolleyStops", ["==", "Stop_ID", parseInt(value)]);
      map_stops.setFilter("mflStops", ["==", "Stop_ID", parseInt(value)]);
      map_stops.setFilter("bslStops", ["==", "Stop_ID", parseInt(value)]);
      map_stops.setFilter("rrStops", ["==", "Stop_ID", parseInt(value)]);
    }
  });

  // start up the stopNameSearch  event listener
  stopNameSearch.addEventListener("keyup", function(e) {
    var value = e.target.value;
    var options = {
      keys: ['features.properites.Station_Name']
    };

    //var f = new Fuse(books, options);
    //var result = f.search('brwn');

    // when the value is null, don't filter
    if (value == "") {
      map_stops.setFilter("busStops", null);
      map_stops.setFilter("trolleyStops", null);
      map_stops.setFilter("mflStops", null);
      map_stops.setFilter("bslStops", null);
      map_stops.setFilter("rrStops", null);
    } else {
      // if there is a value present, filter based on that value
      map_stops.setFilter("busStops", ["==", "Stop_Name", value]);
      map_stops.setFilter("trolleyStops", ["==", "Stop_Name", value]);
      map_stops.setFilter("mflStops", ["==", "Station", value]);
      map_stops.setFilter("bslStops", ["==", "Station", value]);
      map_stops.setFilter("rrStops", ["==", "Station_Name", value]);
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

  map_stops.on("click", "rrStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    makeRRStopPopups(coordinates, map_stops, e);
  });

  var mapStopsLayers = ["busStops", "trolleyStops", "mflStops", "bslStops", "rrStops"];
  _.each(mapStopsLayers, function(x) {
    map_stops.on("mouseenter", x, function() {
      map_stops.getCanvas().style.cursor = "pointer";
    });
    map_stops.on("mouseleave", "busStops", function() {
      map_stops.getCanvas().style.cursor = "";
    });
  });

  /*
  busStops.features.forEach(function(feature) {
  var label = feature.properties.Weekday_Boards;

  map_stops.addLayer({
  id: "busStopsLabels",
  type: "symbol",
  source: "busStops",
  layout: {
  "text-field": label
},
paint: {
},
minzoom: 15
});
});
*/

var slider2 = document.getElementById('slider2');

noUiSlider.create(slider2, {
  start: [0, 35000],
  connect: true,
  step: 10,
  behaviour: 'drag',
  format: wNumb({
    decimals: 0,
  }),
  range: {
    'min': [  0 ],
    '30%': [  250 ],
    '70%': [  5000 ],
    'max': [ 35000 ]
  },
  tooltips: [ true, true ],
});

slider2.noUiSlider.on('update', function(values) {

  var low = parseInt(values[0]);
  var high = parseInt(values[1]);

  filterSurface = ["all",  [">=", "Weekday_Boards", low], ["<=", "Weekday_Boards", high]];
  filterRail = ["all", [">=", "Average_Weekday_Ridership", low], ["<=", "Average_Weekday_Ridership", high]];
  filterRR = ["all", [">=", "Weekday_Total_Boards", low], ["<=", "Weekday_Total_Boards", high]];

  map_stops.setFilter("busStops", filterSurface);
  map_stops.setFilter("trolleyStops", filterSurface);
  map_stops.setFilter("mflStops", filterRail);
  map_stops.setFilter("bslStops", filterRail);
  map_stops.setFilter("rrStops", filterRR);

});

document.getElementById('lowRidershipButton').addEventListener('click', function(){
  slider2.noUiSlider.set( [0, 5] );
});
document.getElementById('mediumRidershipButton').addEventListener('click', function(){
  slider2.noUiSlider.set( [40, 400] );
});
document.getElementById('highRidershipButton').addEventListener('click', function(){
  slider2.noUiSlider.set( [400, 35000] );
});
document.getElementById('fullRidershipButton').addEventListener('click', function(){
  slider2.noUiSlider.set( [0, 35000] );
});

});

// LAYER CONTROL
var allBox = document.querySelector('input[id="all"]');
var busBox = document.querySelector('input[id="bus"]');
var trolleyBox = document.querySelector('input[id="trolley"]');
var mflBox = document.querySelector('input[id="mfl"]');
var bslBox = document.querySelector('input[id="bsl"]');
var rrBox = document.querySelector('input[id="rr"]');


document.getElementById("demo-menu-lower-left").click();


var layerBoxes = [allBox, busBox, trolleyBox, mflBox, bslBox, rrBox];

_.each(layerBoxes, function(box) {
  //console.log(box);
  box.onchange = function() {
    if (allBox.checked){
      map_stops.setLayoutProperty("busStops", "visibility", "none");
      map_stops.setLayoutProperty("trolleyStops", "visibility", "none");
      map_stops.setLayoutProperty("mflStops", "visibility", "none");
      map_stops.setLayoutProperty("bslStops", "visibility", "none");
      map_stops.setLayoutProperty("rrStops", "visibility", "none");
    } else {
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
      if (rrBox.checked) {
        map_stops.setLayoutProperty("rrStops", "visibility", "visible");
      } else {
        map_stops.setLayoutProperty("rrStops", "visibility", "none");
      }
    }
  };
});
