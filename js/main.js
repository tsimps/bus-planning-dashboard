// GLOBAL
var septaBusStops =
"https://opendata.arcgis.com/datasets/e9cf307d8408475ab1188f126ccaa1ba_0.geojson";
var septaBusRoutes =
"https://opendata.arcgis.com/datasets/18ed1674dca94472a5f7d40f219ba266_0.geojson";


var shelterDatabaseLink =
"https://raw.githubusercontent.com/tsimps/tsimps.github.io/master/data/shelter_json_31318.geojson";
var stopsRouteLink =
"https://raw.githubusercontent.com/tsimps/midterm-project/master/data/stops_routes_full.geojson";
var neighborhoodsLink =
'https://raw.githubusercontent.com/tsimps/midterm-project/master/data/neighborhoods.geojson';

var CartoDB_Positron = L.tileLayer(
  "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
  {
    attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: "abcd",
    maxZoom: 19
  }
);
var centerCoordinates = [-75.15901565579941, 39.94756033306919];

mapboxgl.accessToken = 'pk.eyJ1IjoidGFuZHJld3NpbXBzb24iLCJhIjoiY2ludXlsY3ZsMTJzN3Rxa2oyNnplZjB1ZyJ9.bftIKd0sAwvSIGWxIDbSSw';

var map_stops = new mapboxgl.Map({
  container: 'map_stops',
  style: 'mapbox://styles/mapbox/light-v9',
  center: centerCoordinates,
  zoom: 11
});

map_stops.on('load', function () {
  map_stops.addSource('stops', {
    type: 'geojson',
    data: septaBusStops
  });

  map_stops.addLayer({
    id: "stops",
    type: "circle",
    source: "stops",
    paint: {
      'circle-radius': {
        property: 'avg_boards',
        type: 'exponential',
        stops: [
          [0, 2],
          [50, 4],
          [100, 6],
          [250, 8],
          [500, 12],
          [1000, 15]
        ]
      }
    }
  }).addControl(new mapboxgl.NavigationControl());
});



var map_routes = new mapboxgl.Map({
  container: 'map_routes',
  style: 'mapbox://styles/mapbox/light-v9',
  center: centerCoordinates,
  zoom: 11
});

map_routes.on('load', function () {
  map_routes.addSource('routes', {
    type: 'geojson',
    data: septaBusRoutes
  });

  map_routes.addLayer({
    id: "routes",
    type: "line",
    source: "routes",
    paint: {
      'line-width': 3,
    }
  }).addControl(new mapboxgl.NavigationControl());
});


var map_geographies = new mapboxgl.Map({
  container: 'map_geographies',
  style: 'mapbox://styles/mapbox/light-v9',
  center: centerCoordinates,
  zoom: 11
});

map_geographies.on('load', function () {
  map_geographies.addSource('neighborhoods', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/tsimps/midterm-project/master/data/neighborhoods.geojson'
  });

  map_geographies.addLayer({
    'id': 'neighborhoods',
    'type': 'fill',
    'source': 'neighborhoods',
    'layout': {},
    'paint': {
      'fill-color': '#66FCF1',
      'fill-opacity': 0.2,
      'fill-outline-color': '#1F2833'
    }
  });
});
