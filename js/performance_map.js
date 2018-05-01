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

var suburbanFilter = false;
var suburbanSwitch = document.getElementById('suburbanSwitch');

suburbanSwitch.addEventListener('change', function(){

  // if the switch is on:
  if (suburbanSwitch.checked) {
    suburbanFilter = false;
    console.log("checked");
  }

  //otherwise:
  else {
    suburbanFilter = true;
    console.log("unchecked");
  }

  // update the slider to get refiltering process
  slider.noUiSlider.set([null, null]);

});

var cityFilter = false;
var citySwitch = document.getElementById('citySwitch');

citySwitch.addEventListener('change', function(){

  // if the switch is on:
  if (citySwitch.checked) {
    cityFilter = false;
    console.log("checked");
  }

  //otherwise:
  else {
    cityFilter = true;
    console.log("unchecked");
  }

  // update the slider to get refiltering process
  slider.noUiSlider.set([null, null]);

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



map_performance.on("load", function() {
  addSeptaRouteSources(map_performance);
  addRoutesLayer(map_performance);

  addSeptaStopSources(map_performance);
  addStopsLayer(map_performance);

  // mute the routes layers until a route is chosen
  makeRoutesInvisible(map_performance);
  makeStopsInvisible(map_performance);

  // BUS STOP POPUPS
  map_performance.on("click", "busStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    makeSurfaceStopPopups(coordinates, map_performance, e);
    popupTracker = true;
  });

  // TROLLEY STOP POPUPS
  map_performance.on("click", "trolleyStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    makeSurfaceStopPopups(coordinates, map_performance, e);
    popupTracker = true;
  });

  // MFL STOP POPUPS
  map_performance.on("click", "mflStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    makeRailStopPopups(coordinates, map_performance, e);
    popupTracker = true;
  });

  // BSL STOP POPUPS
  map_performance.on("click", "bslStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    makeRailStopPopups(coordinates, map_performance, e);
    popupTracker = true;
  });


  slider1.noUiSlider.on('update', function(values) {
    //console.log(values[0], values[1]);
    //console.log(typeof values[0]);
    var low = parseInt(values[0]);
    var high = parseInt(values[1]);
    var filter = [];
    makeStopsInvisible(map_performance);

    // take out both
    if (suburbanFilter === true && cityFilter === true) {
      filterSurface = ["all", ["!=", "Revenue", "City"], ["!=", "Revenue", "Suburban"], [">=", "Operating_Ratio", low], ["<=", "Operating_Ratio", high]];
      filterRail = ["all", [">=", "Operating_Ratio", low], ["<=", "Operating_Ratio", high]];
    }

    // take out the suburban
    else if (suburbanFilter === true && cityFilter === false) {
      filterSurface = ["all", ["==", "Revenue", "City"], [">=", "Operating_Ratio", low], ["<=", "Operating_Ratio", high]];
      filterRail = ["all", [">=", "Operating_Ratio", low], ["<=", "Operating_Ratio", high]];
    }

    // take out the city
    else if (suburbanFilter === false && cityFilter === true) {
      filterSurface = ["all", ["!=", "Revenue", "City"], [">=", "Operating_Ratio", low], ["<=", "Operating_Ratio", high]];
      filterRail = ["all", [">=", "Operating_Ratio", low], ["<=", "Operating_Ratio", high]];
    }

    // if not...
    else {
      // show the routes that have operating ration between vales[0] and values[1]
      filterSurface = ["all", [">=", "Operating_Ratio", low], ["<=", "Operating_Ratio", high]];
      filterRail = ["all", [">=", "Operating_Ratio", low], ["<=", "Operating_Ratio", high]];
    }

    map_performance.setFilter("busRoutes", filterSurface);
    map_performance.setFilter("trolleyRoutes", filterSurface);
    map_performance.setFilter("mflRoute", filterRail);
    map_performance.setFilter("bslRoute", filterRail);
    makeRoutesVisible(map_performance);
  });

  // ADD USER SELECTION FEATURE
  function layerClicking(e) {
    makeStopsInvisible(map_performance);
    layerClick = true;
    coordinates = e.lngLat;
    makeRoutePopups(coordinates, map_performance, e);
    var routeNumber = e.features[0].properties.Route;
    filterStops(map_performance, routeNumber);
    filterRoutes(map_performance, routeNumber);
    makeStopsVisible(map_performance);
  }

  var mapRoutesLayers = ["busRoutes", "trolleyRoutes", "mflRoute", "bslRoute"];
  _.each(mapRoutesLayers, function(x) {

    // manage the cursor over each layer
    map_performance.on("mouseenter", x, function() {
      map_performance.getCanvas().style.cursor = "pointer";
    });
    map_performance.on("mouseleave", "busStops", function() {
      map_performance.getCanvas().style.cursor = "";
    });
  });

  map_performance.on("click", function(e) {

    // boolean for tracking clicks on a layer
    var layerClick = false;

    map_performance.on("click", "busRoutes", function(e) {
      layerClicking(e);
      popupTracker = true;
    });

    map_performance.on("click", "trolleyRoutes", function(e) {
      layerClicking(e);
      popupTracker = true;
    });

    map_performance.on("click", "mflRoute", function(e) {
      layerClicking(e);
      popupTracker = true;
    });

    map_performance.on("click", "bslRoute", function(e) {
      layerClicking(e);
      popupTracker = true;
    });

    if (layerClick === false && popupTracker === false) {

      // clear the map
      slider.noUiSlider.set([null, null]);
    }
  });
});
