function map_chart() {

    var width = 950;
    var height = 650;

    var projection = d3.geoKavrayskiy7()
        .scale(302)
        .rotate([-210, -10])
        .translate([width / 2, height / 2])
        .precision(0.1);

    var path = d3.geoPath().projection(projection);
    var svg = d3.select("#map_chart").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create a few groups to layer elements correctly
    var g1 = svg.append("g");
    var g2 = svg.append("g");

    // d3.json("world.json", function(error, world) {

    //     console.log(world)
    //     g1.insert("path")
    //         .datum(topojson.feature(world, world.objects.land))
    //         .attr("class", "land")
    //         .attr("d", path);

    //     g2.append("circle")
    //         .attr("cx", function() { return projection(ports["Puget Sound"].loc)[0]; })
    //         .attr("cy", function() { return projection(ports["Puget Sound"].loc)[1]; })
    //         .attr("r", 6)
    //         .attr("class", "source-port");

    //     g2.append("text")
    //         .attr("x", function() { return projection(ports["Puget Sound"].loc)[0] + 5; })
    //         .attr("y", function() { return projection(ports["Puget Sound"].loc)[1] + 0; })
    //         .text("Puget Sound");

    //     drawTrade();
    // });



    // Draw a set of routes 
    function drawTrade() {
        d3.csv("js/lumber.csv", function(error, routes) {
            console.timeLog(routes)
            var maxVolume = d3.max(routes, function(d) { return d.vol; });

            routePath = g1.selectAll(".route")
                .data(routes)
                .enter()
                .append("path")
                .attr("class", "route")
                .style("stroke-width", function(d) {
                    return 50 * d.vol;
                })
                .attr('d', function(d) {
                    return path({
                        type: "LineString",
                        coordinates: [ports["Puget Sound"].loc, ports[d.destination].loc]
                    });
                })

            portMarkers = g1.selectAll(".ports")
                .data(routes)
                .enter()
                .append("circle")
                .attr("class", "ports")
                .attr("cx", function(d) { return projection(ports[d.destination].loc)[0] })
                .attr("cy", function(d) { return projection(ports[d.destination].loc)[1] })
                .attr("r", function(d) { return d.vol * 25 })
                .style("fill", "white")
                .style("stroke-width", 2)
                .style("stroke", "red");

            portLabels = g2.selectAll(".port-labels")
                .data(routes)
                .enter()
                .append("text")
                .attr("x", function(d) { return projection(ports[d.destination].loc)[0] + ports[d.destination].off[0] })
                .attr("y", function(d) { return projection(ports[d.destination].loc)[1] - ports[d.destination].off[1] })
                .text(function(d) { return d.destination })
                .attr("class", "port-label");
        });
    }

    drawTrade();

    // Ports reference and text offset for labels.	
    var ports = {
        Honolulu: { loc: [-157.816667, 21.3], off: [-67, 0] },
        "Puget Sound": { loc: [-123.365556, 48.428611], off: [5, 5] },
        Sydney: { loc: [151.209444, -33.859972], off: [10, -5] },
        Yokohama: { loc: [139.653905, 35.455161], off: [-25, -15] },
        "Hong Kong": { loc: [114.204277, 22.330869], off: [-50, 11] },
        Callao: { loc: [-77.131981, -11.876547], off: [10, 5] },
        Shanghai: { loc: [121.475449, 31.230331], off: [-60, 7] },
        Melbourne: { loc: [144.96668, -37.812339], off: [-75, -3] },
        Valparaiso: { loc: [-71.616667, -33.05], off: [6, -5] },
        Iquique: { loc: [-70.15, -20.216667], off: [8, -4] },
        Coquimbo: { loc: [-71.345873, -29.949609], off: [2, 7] },
        Tahiti: { loc: [-149.561182, -17.538858], off: [10, 0] },
        Guaymas: { loc: [-110.900017, 27.920381], off: [-70, 0] },
        Adelaide: { loc: [138.601, -34.929], off: [-60, -3] },
        Noumea: { loc: [166.466667, -22.266667], off: [10, -5] },
        Antofagasto: { loc: [-70.4, -23.65], off: [10, 0] },
        Fiji: { loc: [178.45, -18.166667], off: [10, 0] }
    };

}