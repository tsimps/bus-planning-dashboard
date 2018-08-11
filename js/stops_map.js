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

var features = [];

var isLoading;

function goToStop(stopID, map = map_stops){
  map.flyTo({
    center: centerCoordinates,
    zoom: 11
  });

  // needs a way to figure out which mode the stop is.
  // probably needs to be done in R. 

  map.setFilter("busStops", ["==", "Stop_ID", stopID]);
  map.setLayoutProperty("busStops", "visibility", "visible");

  map.setFilter("trolleyStops", ["==", "Stop_ID", stopID]);
  map.setLayoutProperty("trolleyStops", "visibility", "visible");

  map.setFilter("mflStops", ["==", "Stop_ID", stopID]);
  map.setLayoutProperty("mflStops", "visibility", "visible");

  map.setFilter("bslStops", ["==", "Stop_ID", stopID]);
  map.setLayoutProperty("bslStops", "visibility", "visible");

  map.setFilter("rrStops", ["==", "Stop_ID", stopID]);
  map.setLayoutProperty("rrStops", "visibility", "visible");

  features = map_stops.querySourceFeatures("busStops");
  features = _.union(features, map_stops.querySourceFeatures("rrStops"));
  features = _.union(features, map_stops.querySourceFeatures("trolleyStops"));
  features = _.union(features, map_stops.querySourceFeatures("mflStops"));
  features = _.union(features, map_stops.querySourceFeatures("bslStops"));

  //console.log(features);

  var selection = [];
  _.each(features, function(e) {
    if(e.properties.Stop_ID == stopID){
      selection.push(e);
    }
  });
  //console.log(selection);

  var coordinates = selection[0].geometry.coordinates;

  map.flyTo({
    center: coordinates,
    zoom: 15
  });

  //map.setZoom(15);
  //console.log(selection);

  var description = [
    "<h5>" +
    selection[0].properties.Stop_Name +
    "</h5>" +
    "<p>" +
    "Stop ID: " +
    selection[0].properties.Stop_ID +
    "<br>" +
    "Routes that Stop Here: " +
    selection[0].properties.routeNumbers +
    "<br>" +
    "Average Daily Boards: " +
    Math.round(selection[0].properties.Weekday_Boards).toLocaleString() +
    "<br>" +
    "Average Daily Leaves: " +
    Math.round(selection[0].properties.Weekday_Leaves).toLocaleString() +
    "<br>" +
    "Average Daily Total: " +
    Math.round(selection[0].properties.Weekday_Total).toLocaleString() +
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
  popupTracker = true;
}

// on load, add the sources and layers
map_stops.on("load", function() {

  isLoading = true;

  addSeptaStopSources(map_stops);
  addStopsLayer(map_stops);


  map_stops.addControl(new mapboxgl.NavigationControl());

  var stopIDSearch = document.getElementById("stopSearch");
  var stopNameSearchInput = document.getElementById("stopNameSearch");

  /*
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
*/

// start up the stopNameSearch  event listener
stopNameSearch.addEventListener("keyup", function(e) {
  var x = e.keyCode;
  var value = e.target.value;
  var options = {
    keys: ['features.properites.Station_Name']
  };

  if (value == "" && x != 32) {
    map_stops.setFilter("busStops", null);
    map_stops.setFilter("trolleyStops", null);
    map_stops.setFilter("mflStops", null);
    map_stops.setFilter("bslStops", null);
    map_stops.setFilter("rrStops", null);

    // clear the list
    document.getElementById('auto-complete-list').innerHTML = "";
    document.getElementById('auto-complete-list').removeElement('div');
  } else {

  }

  document.getElementById('auto-complete-list').innerHTML = "";

  var result = stopFuse.search(value);
  //console.log(result[0]);

  var div = document.createElement('div');

  div.className = 'row';

  div.innerHTML =
  '<ul class="demo-list-three mdl-list">' +
  '<li class="mdl-list__item mdl-list__item--two-line">' +
  '<span class="mdl-list__item-primary-content">' +
  '<span>' + result[0].item.Stop_Name + '</span>' +
  '<span class="mdl-list__item-sub-title"> Stop ID: ' + result[0].item.Stop_ID + '</span>' +
  '</span>' +
  '<span class="mdl-list__item-secondary-content">' +
  '<button class="mdl-button mdl-js-button" onclick="goToStop('+result[0].item.Stop_ID+')"> Go Here </button>' +
  '</span>' +
  '</li>' +
  '</ul>' +
  '<ul class="demo-list-three mdl-list">' +
  '<li class="mdl-list__item mdl-list__item--two-line">' +
  '<span class="mdl-list__item-primary-content">' +
  '<span>' + result[1].item.Stop_Name + '</span>' +
  '<span class="mdl-list__item-sub-title"> Stop ID: ' + result[1].item.Stop_ID + '</span>' +
  '</span>' +
  '<span class="mdl-list__item-secondary-content">' +
  '<button class="mdl-button mdl-js-button" onclick="goToStop('+result[1].item.Stop_ID+')"> Go Here </button>' +
  '</span>' +
  '</li>' +
  '</ul>' +
  '<ul class="demo-list-three mdl-list">' +
  '<li class="mdl-list__item mdl-list__item--two-line">' +
  '<span class="mdl-list__item-primary-content">' +
  '<span>' + result[3].item.Stop_Name + '</span>' +
  '<span class="mdl-list__item-sub-title"> Stop ID: ' + result[3].item.Stop_ID + '</span>' +
  '</span>' +
  '<span class="mdl-list__item-secondary-content">' +
  '<button class="mdl-button mdl-js-button" onclick="goToStop('+result[3].item.Stop_ID+')"> Go Here </button>' +
  '</span>' +
  '</li>' +
  '</ul>';


  document.getElementById('auto-complete-list').appendChild(div);
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
  pips: {
    mode: 'range',
    density: 4,
    format: wNumb({
      decimals: 0,
      thousand: ',',
    }),
  }
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

  isLoading = false;

});

var opts = {
  lines: 13, // The number of lines to draw
  length: 38, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: '#1f2833', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '30%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  position: 'absolute' // Element positioning
};

var target = document.getElementById('main');
var spinner = new Spinner(opts).spin(target);
map_stops.on('render', function(){
  //console.log('rendering');

  if (isLoading === false) {
    //spinner.spin(target);
  }
  if (isLoading === true) {
    spinner.stop();
  }


  //console.log(isLoading);
});

/*
map_stops.off('render', function(){
//console.log('rendering')
if (map_stops.areTilesLoaded() == true) {
console.log(map_stops.areTilesLoaded());

}
spinner.stop();
});
*/
