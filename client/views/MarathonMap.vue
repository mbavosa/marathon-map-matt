<template>
<div id="container">
    <div class="row">
        <div class="list-group">
            <h5>States</h5>    
                <button @click="switchState(state)" v-bind:class="[state.properties.visited ? 'cool' : 'available']" v-for="state in states.features" :key="state.id">{{ state.properties.name }}</button>
        </div>
    </div>
</div>
</template>

<script> 
import * as d3 from "d3"

// import stateslived from "../assets/stateslived.csv"
// import citieslived from "../assets/citieslived.csv"
// import usStates from "../assets/us-states.json"
// import * as usStates from "../assets/us-states.json"

const json = require("../../public/assets/us-states.json")
// debugger;
// var newStateName = "../../public/assets/us-states.json"

export default {

    name: "MarathonMap",
    data: function() {
        return {
            color: null,
            selectedState: null,
            available: true,
            states: json,
            // states: [
            //     "Alabama",
            //     "Alaska",
            //     "Arkansas",
            //     "Arizona",
            //     "California",
            //     "Colorado",
            //     "Connecticut",
            //     "Delaware",
            //     "Florida",
            //     "Georgia",
            //     "Hawaii",
            //     "Iowa",
            //     "Idaho",
            //     "Illinois",
            //     "Indiana",
            //     "Kansas",
            //     "Kentucky",
            //     "Louisiana",
            //     "Maine",
            //     "Maryland",
            //     "Massachusetts",
            //     "Michigan",
            //     "Minnesota",
            //     "Missouri",
            //     "Mississippi",
            //     "Montana",
            //     "North Carolina",
            //     "North Dakota",
            //     "Nebraska",
            //     "New Hampshire",
            //     "New Jersey",
            //     "New Mexico",
            //     "Nevada",
            //     "New York",
            //     "Ohio",
            //     "Oklahoma",
            //     "Oregon",
            //     "Pennsylvania",
            //     "Rhode Island",
            //     "South Carolina",
            //     "South Dakota",
            //     "Tennessee",
            //     "Texas",
            //     "Utah",
            //     "Virginia",
            //     "Vermont",
            //     "Washington",
            //     "Wisconsin",
            //     "West Virginia",
            //     "Wyoming"
            // ]
        }
    },
    // watch: {
	// selectedState: function(state) {
	// 	d3.select('#' + state.replace(/\s+/g, '')).style('fill', this.color(1));
    // }
    // },

        methods: {
        switchState: function(state) {
        state.properties.visited = !state.properties.visited;
        this.states = Object.assign({}, this.states);
        // console.log(state.properties.visited);
        // debugger;
        d3.select('#' + state.properties.name.replace(/\s+/g, ''))
        .datum( (d) => {
            // console.log(d);
            // debugger;
            d.properties.visited = d.properties.visited ? 0:1;
            // console.log(d);
        return d;
        })
        // update d as needed
        .style('fill', (d) => {
        var value = d.properties.visited;
        // console.log(value);
                    if (value) {
                    //If value exists…
                    return this.color(value);
                    this.states = Object.assign({}, this.states);
                    } else {
                    //If value is undefined…
                    return "rgb(255,208,137)";
                    }
            });
        
        }
},

    mounted () {
        var width = 960;
        var height = 500;
        
        // D3 Projection
        var projection = d3.geoAlbersUsa()
                        .translate([width/2, height/2])    // translate to center of screen
                        .scale([1000]);          // scale things down so see entire US
                
        // Define path generator
        var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
                    .projection(projection);  // tell path generator to use albersUsa projection
                
        // Define linear scale for output
        var color = this.color=d3.scaleLinear()
                    .range(["rgb(255,208,137)","rgb(45,115,255)"]);
        var legendText = ["States Ran Marathon","Not Ran Yet"];
        //Create SVG element and append map to the SVG
        var svg = d3.select(this.$el)
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);
                    
        // Append Div for tooltip to SVG
        var div = d3.select(this.$el)
                    .append("div")   
                    .attr("class", "tooltip")               
                    .style("opacity", 0);

                    // debugger;
                    
        // Load in my states data!
        d3.csv("/assets/stateslived.csv").then(function(data) {
            // debugger;
            // console.log(data[0]);
            color.domain([0,1]); // setting the range of the input data
            // Load GeoJSON data and merge with states data
            d3.json("/assets/us-states.json").then(function(json) {
                // debugger;
                // Loop through each state data value in the .csv file
                for (var i = 0; i < data.length; i++) {
                    // Grab State Name
                    var dataState = data[i].state;
                    // Grab data value 
                    var dataValue = data[i].visited;
                    // Find the corresponding state inside the GeoJSON
                    for (var j = 0; j < json.features.length; j++)  {
                        var jsonState = json.features[j].properties.name;
                        if (dataState == jsonState) {
                            // Copy the data value into the JSON
                            json.features[j].properties.visited = parseInt(dataValue); 
                            // Stop looking through the JSON
                            break;
                        }
                    }
                }
                // Bind the data to the SVG and create one path per GeoJSON feature
                svg.selectAll("path")
                    .data(json.features)
                    .enter()
                    .append("path")
                    .attr("d", path)
                    .attr('id', function(d) { return d.properties.name.replace(/\s+/g, ''); })
                    .style("stroke", "#fff")
                    .style("stroke-width", "1")
                    .style("fill", function(d) {
                    // Get data value
                    var value = d.properties.visited;
                    if (value) {
                    //If value exists…
                    return color(value);
                    } else {
                    //If value is undefined…
                    return "rgb(255,208,137)";
                    }
                });
                var toggleColor = (function(){
                    var currentColor = "rgb(255,208,137)";

                    return function(){
                        currentColor = currentColor == "rgb(255,208,137)" ? "rgb(45,115,255)" : "rgb(255,208,137)";
                        d3.select(this).style("fill", currentColor);
                    }
                })();
                // Map the cities I have lived in!
            d3.csv("/assets/citieslived.csv").then(function(data) {
            svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function(d) {
                    return projection([d.lon, d.lat])[0];
                })
                .attr("cy", function(d) {
                    return projection([d.lon, d.lat])[1];
                })
                .attr("r", function(d) {
                    return Math.sqrt(d.years) * 4;
                })
                    .style("fill", "rgb(217,91,67)")	
                    .style("opacity", 0.85)
        	// Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks" 
                // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
                // .on("mouseover", function(d) {      
                //     div.transition()        
                //     .duration(200)      
                //     .style("opacity", .9);      
                //     div.text(d.place)
                //     .style("left", (d3.event.pageX) + "px")     
                //     .style("top", (d3.event.pageY - 28) + "px");    
                // })   
                // fade out tooltip on mouse out               
                // .on("mouseout", function(d) {       
                //     div.transition()        
                //     .duration(500)      
                //     .style("opacity", 0);   
                // });
            });
            // d3.select('#' + newStateName.replace(/\s+/g, '')).style('fill', newFillValue);
            // Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
            var legend = d3.select("body").append("svg")
                            .attr("class", "legend")
                            .attr("width", 140)
                            .attr("height", 50)
                            .selectAll("g")
                            .data(color.domain().slice().reverse())
                            .enter()
                            .append("g")
                            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
                legend.append("rect")
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", color);
                legend.append("text")
                    .data(legendText)
                    .attr("x", 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .text(function(d) { return d; });
                });
            });
    }
}
</script>

<style type="text/css">
/* On mouse hover, lighten state color */
path:hover {
  fill-opacity: 0.4;
}
/* Style for Custom Tooltip */
div.tooltip {
  position: absolute;
  text-align: center;
  width: 100px;
  height: 28px;
  padding: 2px;
  font: 12px sans-serif;
  background: white;
  border: 0px;
  border-radius: 8px;
  pointer-events: none;
}

/* Legend Font Style */
body {
  font: 11px sans-serif;
}

/* Legend Position Style */
.legend {
  position: absolute;
  left: 10px;
  top: 100px;
}

.row {
  position: absolute;
  left: 150px;
  top: 110px;
  width: 100px
}

.available {
  background-color: rgb(255,208,137);
}

.cool {
  background-color: rgb(45,115,255);
}
</style>
