# bus-planning-dashboard

# to do

## overall
- [x] wireframe website
- [x] create 3 main maps
- [x] bring in SEPTA data
- [x] add subway data
- [x] add trolley data
- [ ] refactor api calls for smaller JSON files
- [ ] general cleanup 1
- [ ] refactor stop mapping functions and popups
- [ ] split out javascript files


## stops page
- [x] style based on ridership
- [ ] option to style based on shelter status
- [x] build stop filtering by stop id (possibly import from midterm)
- [x] add popups 
- [x] add other modes' stops
- [ ] develop charts
- [ ] compile multiple route stops into 1 feature
- [x] layer control
- [x] refactor mapping functions
- [x] search by name limited viability
- [ ] possibly switch search by name to a geocoding search except mapbox geocoder doesn't support intersection based searching 
- [x] put layer control into a MDL menu
- [ ] add checkboxes to remove suburban stops


## routes page
- [x] filter out the school routes 
- [x] add user selection/filter option
- [x] once route is chosen, bring up the stops for that route
- [ ] scale line weight on ridership
- [x] color lines appropriately
- [x] add other modes' routes
- [ ] develop charts
- [x] write addStopsByRoute() to take in a route # and map stops for that route
- [x] refactor to add all routes of different modes at once 
- [ ] populate a dropdown list as the user types a route number
- [x] allow user to click to clear
- [ ] add checkboxes to remove suburban routes

## performance page
- [ ] add checkboxes to remove suburban routes
- [ ] add preset buttons
- [ ] add popups

