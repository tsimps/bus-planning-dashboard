# bus-planning-dashboard

Welcome to the transit analysis tool (legacy name: bus planning dashboard). This is a project for a javascript class at the University of Pennsylvania. It is still in development, so feel free to ask questions and hit me up with feature ideas.

Data is provided by [SEPTA's open data portal](https://septaopendata-septa.opendata.arcgis.com).

Check out my [website](www.tandrewsimpson.com) and feel free to [email me](mail@tandrewsimpson.com). 


## things in development
- [ ] option to style based on shelter status
- [ ] analytics charts for stops and routes
- [ ] add "serving routes ..." to the search interaction
- [ ] populate a dropdown list as the user types a route number




## to do [ legacy ]

### overall
- [x] wireframe website
- [x] create 3 main maps
- [x] bring in SEPTA data
- [x] add subway data
- [x] add trolley data
- [ ] refactor api calls for smaller JSON files
- [x] general cleanup 1
- [x] refactor stop mapping functions and popups
- [x] split out javascript files
- [x] add regional rail data


### stops page
- [x] style based on ridership
- [ ] option to style based on shelter status
- [x] build stop filtering by stop id (possibly import from midterm)
- [x] add popups 
- [x] add other modes' stops
- [ ] develop charts
- [x] compile multiple route stops into 1 feature
- [x] layer control
- [x] refactor mapping functions
- [x] search by name limited viability
- [x] build out searching features
- [x] put layer control into a MDL menu
- [ ] add checkboxes to remove suburban stops
- [ ] add "serving routes ..." to the search interaction


### routes page
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
- [x] add checkboxes to remove suburban routes
- [x] add layer control

### performance page
- [x] add checkboxes to remove suburban routes
- [x] add preset buttons
- [x] add popups

