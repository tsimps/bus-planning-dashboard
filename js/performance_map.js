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

  // mute the routes layers until a route is chosen
  makeRoutesInvisible(map_performance);


  slider1.noUiSlider.on('update', function(values) {
    //console.log(values[0], values[1]);
    //console.log(typeof values[0]);
    var low = parseInt(values[0]);
    var high = parseInt(values[1]);
    var filter = [];

    // if suburban filter is true...
    if (suburbanFilter === true) {
      filterSurface = ["all", ["==", "Revenue", "City"], [">=", "Operating_Ratio", low], ["<=", "Operating_Ratio", high]];
      filterRail = ["all", [">=", "Operating_Ratio", low], ["<=", "Operating_Ratio", high]];
      map_performance.setFilter("busRoutes", filterSurface);
      map_performance.setFilter("trolleyRoutes", filterSurface);
      map_performance.setFilter("mflRoute", filterRail);
      map_performance.setFilter("bslRoute", filterRail);

      makeRoutesVisible(map_performance);
    }

    // if not...
    else {
      // show the routes that have operating ration between vales[0] and values[1]
      filter = ["all", [">=", "Operating_Ratio", low], ["<=", "Operating_Ratio", high]];
      map_performance.setFilter("busRoutes", filter);
      map_performance.setFilter("trolleyRoutes", filter);
      map_performance.setFilter("mflRoute", filter);
      map_performance.setFilter("bslRoute", filter);

      makeRoutesVisible(map_performance);
    }
  });


  // ADD USER SELECTION FEATURE

});
