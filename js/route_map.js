/* =====================================

ROUTES MAP

===================================== */

var map_routes = new mapboxgl.Map({
  container: "map_routes",
  style: "mapbox://styles/mapbox/light-v9",
  center: centerCoordinates,
  zoom: 11
});
map_routes.addControl(new mapboxgl.NavigationControl());

var routeMapIsFresh = true;


map_routes.on("load", function() {

  addSeptaStopSources(map_routes, busAggregation = false);
  addStopsLayer(map_routes);
  // mute the stops layers until a route is chosen
  makeStopsInvisible(map_routes);

  addSeptaRouteSources(map_routes);
  addRoutesLayer(map_routes);
  //mapRegionalRailRoutes(map_routes);

  // BUS STOP POPUPS
  map_routes.on("click", "busStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    makeSurfaceStopPopups(coordinates, map_routes, e);
    popupTracker = true;
  });

  // TROLLEY STOP POPUPS
  map_routes.on("click", "trolleyStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    makeSurfaceStopPopups(coordinates, map_routes, e);
    popupTracker = true;
  });

  // MFL STOP POPUPS
  map_routes.on("click", "mflStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    makeRailStopPopups(coordinates, map_routes, e);
    popupTracker = true;
  });

  // BSL STOP POPUPS
  map_routes.on("click", "bslStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    makeRailStopPopups(coordinates, map_routes, e);
    popupTracker = true;
  });

  map_routes.on("click", "rrStops", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    makeRRRoutePopups(coordinates, map_routes, e);
    popupTracker = true;
  });

  var slider3 = document.getElementById('slider3');

  noUiSlider.create(slider3, {
    start: [0, 200000],
    connect: true,
    step: 100,
    behaviour: 'drag',
    format: wNumb({
      decimals: 0,
      //thousand: ',',
    }),
    range: {
      'min': [  0 ],
      '30%': [  5000 ],
      '50%': [  10000 ],
      '70%': [  40000 ],
      'max': [ 200000 ]
    },
    tooltips: [ true, true ],
    pips: {
      mode: 'positions',
  		values: [0,25,50,75,100],
  		density: 4,
      stepped: true,
      format: wNumb({
        decimals: 0,
        thousand: ',',
      }),
    }
  });


  slider3.noUiSlider.on('update', function(values) {
    //console.log(values[0], values[1]);
    //console.log(typeof values[0]);
    var low = parseInt(values[0]);
    var high = parseInt(values[1]);
    var filter = [];
    //makeStopsInvisible(map_routes);
    filterRoutes(map_routes, "");

    filterSurface = ["all",  [">=", "Average_Weekday_Passengers", low], ["<=", "Average_Weekday_Passengers", high], ["==", "School_Route", "No"]];
    filterRail = ["all", [">=", "Average_Weekday_Passengers", low], ["<=", "Average_Weekday_Passengers", high]];
    filterRR = ["all", [">=", "Total_Weekday_Boards", low], ["<=", "Total_Weekday_Boards", high]];

    map_routes.setFilter("busRoutes", filterSurface);
    map_routes.setFilter("trolleyRoutes", filterSurface);
    map_routes.setFilter("mflRoute", filterRail);
    map_routes.setFilter("bslRoute", filterRail);
    map_routes.setFilter("rrRoutes", filterRR);

    makeRoutesVisible(map_routes);
  });

  document.getElementById('lowRouteButton').addEventListener('click', function(){
    slider3.noUiSlider.set( [0, 3500] );
  });
  document.getElementById('midRouteButton').addEventListener('click', function(){
    slider3.noUiSlider.set( [3500, 10000] );
  });
  document.getElementById('highRoutebutton').addEventListener('click', function(){
    slider3.noUiSlider.set( [10000, 200000] );
  });
  document.getElementById('fullRouteButton').addEventListener('click', function(){
    slider3.noUiSlider.set( [0, 200000] );
  });

  // array to hold all 4  stop layers
  var mapStopsLayers = ["busStops", "trolleyStops", "mflStops", "bslStops", "rrStops"];

  // set the pointer/graber for each layer
  _.each(mapStopsLayers, function(x) {
    map_routes.on("mouseenter", x, function() {
      map_routes.getCanvas().style.cursor = "pointer";
    });
    map_routes.on("mouseleave", "busStops", function() {
      map_routes.getCanvas().style.cursor = "";
    });
  });

  // array to hold all 4  route layers
  var mapRoutesLayers = ["busRoutes", "trolleyRoutes", "mflRoute", "bslRoute", "rrRoutes"];
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

  function layerClicking(e) {
    layerClick = true;
    coordinates = e.lngLat;
    makeRoutePopups(coordinates, map_routes, e);
    var routeNumber = e.features[0].properties.Route;
    //console.log(e.features[0].properties.Route);
    filterRoutes(map_routes, routeNumber);
    filterStops(map_routes, routeNumber);
    // update the search box to allow the user to clear
    $("#routeSearch")[0].parentElement.MaterialTextfield.change(
      e.features[0].properties.Route
    );
  };

  // listen for a click anywhere on the map
  map_routes.on("click", function(e) {

    // boolean for tracking clicks on a layer
    var layerClick = false;
    var coordinates = 0;

    map_routes.on("click", "busRoutes", function(e) {
      if(popupTracker === false){layerClicking(e);}
      popupTracker = true;
    });
    map_routes.on("click", "trolleyRoutes", function(e) {
      if(popupTracker === false){layerClicking(e);}
      popupTracker = true;
    });
    map_routes.on("click", "mflRoute", function(e) {
      if(popupTracker === false){layerClicking(e);}
      popupTracker = true;
    });
    map_routes.on("click", "bslRoute", function(e) {
      if(popupTracker === false){layerClicking(e);}
      popupTracker = true;
    });
    map_routes.on("click", "rrRoutes", function(e) {
      coordinates = e.lngLat;
      if(popupTracker === false){
        makeRRRoutePopups(coordinates, map_routes, e);
        var routeNumber = e.features[0].properties.Route_Name; //number is actually a name b/c no more R1, R2, etc.
        filterRoutes(map_routes, routeNumber);
        // console.log('Show stops:');
        // console.log('Route '+ routeNumber);

        //note: due to bad data practice by septa, not able to join RR stops to
        // RR lines at this time. will discuss at next chance
        filterStops(map_routes, routeNumber);
      }
      popupTracker = true;
      $("#routeSearch")[0].parentElement.MaterialTextfield.change(
        e.features[0].properties.Route_Name
      );
    });
    if (layerClick === false && popupTracker === false) {

      // clear the map
      filterRoutes(map_routes, "");
      $("#routeSearch")[0].parentElement.MaterialTextfield.change(
        ""
      );
      slider3.noUiSlider.set([null, null]);
    }
  });

  // search by text input
  routeSearchInput.addEventListener("keyup", function(e) {
    var routeNumber = e.target.value;


    filterRoutes(map_routes, routeNumber);
    filterStops(map_routes, routeNumber);

    //console.log(routeNumber);
    coordinates = map_routes.getCenter();
    console.log(mapRoutesLayers[0]);
    //makeRoutePopups(coordinates, map_routes, e);
    /*
    if (popupTracker === false) {
      layerClicking(e);
      popupTracker = true;
    }
    */

  });

  // LAYER CONTROL
  var busBox = document.querySelector('input[id="busRoutes"]');
  var trolleyBox = document.querySelector('input[id="trolleyRoutes"]');
  var mflBox = document.querySelector('input[id="mflRoute"]');
  var bslBox = document.querySelector('input[id="bslRoute"]');
  var rrBox = document.querySelector('input[id="rrRoutes"]');

  var layerBoxes = [busBox, trolleyBox, mflBox, bslBox, rrBox];

  _.each(layerBoxes, function(box) {
    //console.log(box);
    box.onchange = function() {
      if (busBox.checked) {
        map_routes.setLayoutProperty("busRoutes", "visibility", "visible");
      } else {
        map_routes.setLayoutProperty("busRoutes", "visibility", "none");
      }
      if (trolleyBox.checked) {
        map_routes.setLayoutProperty("trolleyRoutes", "visibility", "visible");
      } else {
        map_routes.setLayoutProperty("trolleyRoutes", "visibility", "none");
      }
      if (mflBox.checked) {
        map_routes.setLayoutProperty("mflRoute", "visibility", "visible");
      } else {
        map_routes.setLayoutProperty("mflRoute", "visibility", "none");
      }
      if (bslBox.checked) {
        map_routes.setLayoutProperty("bslRoute", "visibility", "visible");
      } else {
        map_routes.setLayoutProperty("bslRoute", "visibility", "none");
      }
      if (rrBox.checked) {
        map_routes.setLayoutProperty("rrRoutes", "visibility", "visible");
      } else {
        map_routes.setLayoutProperty("rrRoutes", "visibility", "none");
      }
    };
  });
});
