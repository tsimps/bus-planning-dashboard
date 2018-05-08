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


  map_routes.addSource("mflStops", {
    type: "geojson",
    data: septaMFLStops
  });
  map_routes.addSource("bslStops", {
    type: "geojson",
    data: septaBSLStops
  });
  map_routes.addSource("trolleyStops", {
    type: "geojson",
    data: septaTrolleyStops
  });
  map_routes.addSource("busStops", {
    type: "geojson",
    data: septaBusStops
  });
  addStopsLayer(map_routes);

  addSeptaRouteSources(map_routes);
  addRoutesLayer(map_routes);

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
  makeStopsInvisible(map_routes);

  // array to hold all 4  route layers
  var mapRoutesLayers = ["busRoutes", "trolleyRoutes", "mflRoute", "bslRoute"];
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

  // listen for a click anywhere on the map
  map_routes.on("click", function(e) {

    // boolean for tracking clicks on a layer
    var layerClick = false;
    var coordinates = 0;

    function layerClicking(e) {
      layerClick = true;
      coordinates = e.lngLat;
      makeRoutePopups(coordinates, map_routes, e);
      var routeNumber = e.features[0].properties.Route;
      filterRoutes(map_routes, routeNumber);
      filterStops(map_routes, routeNumber);
      // update the search box to allow the user to clear
      $("#routeSearch")[0].parentElement.MaterialTextfield.change(
        e.features[0].properties.Route
      );
    }

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

    if (layerClick === false && popupTracker === false) {

      // clear the map
      filterRoutes(map_routes, "");
      $("#routeSearch")[0].parentElement.MaterialTextfield.change(
        ""
      );
    }
  });

  // search by text input
  routeSearchInput.addEventListener("keyup", function(e) {
    var routeNumber = e.target.value;
    if (routeNumber === "MFL") {routeNumber = "Market-Frankford Line";}
    if (routeNumber === "BSL") {routeNumber = "Broad Street Line";}

    filterRoutes(map_routes, routeNumber);
    filterStops(map_routes, routeNumber);
  });

  // LAYER CONTROL
  var busBox = document.querySelector('input[id="busRoutes"]');
  var trolleyBox = document.querySelector('input[id="trolleyRoutes"]');
  var mflBox = document.querySelector('input[id="mflRoute"]');
  var bslBox = document.querySelector('input[id="bslRoute"]');
  var rrBox = document.querySelector('input[id="rrRoute"]');

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
    };
  });
});
