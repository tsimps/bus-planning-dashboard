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

  var routeRidershipDatabase = {};

  /*

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
*/

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
});
