// https://bl.ocks.org/d3noob/06e72deea99e7b4859841f305f63ba85

function sankey_chart() {

    var f = d3.format(".2s")

    var units = "Widgets";

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 700 - margin.left - margin.right,
        height = 1500 - margin.top - margin.bottom;

    // format variables
    var formatNumber = d3.format(",.0f"), // zero decimal places
        format = function(d) { return formatNumber(d) + " " + units; },
        color = d3.scaleOrdinal(d3.schemeCategory10);

    function update() {

        var list = document.getElementById('sankeyChartBlock')
        try {
            while (list.firstChild) {
                list.removeChild(list.lastChild);
            }
        } catch {}
        il = document.createElement('div');
        il.id = 'sankey_chart'
        list.appendChild(il)

        // append the svg object to the body of the page
        var svg = d3.select("#sankey_chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        console.log(svg)

        // Set the sankey diagram properties
        var sankey = d3.sankey()
            .nodeWidth(36)
            .nodePadding(40)
            .size([width, height]);

        var path = sankey.link();

        country = document.querySelector('#countrySelector').querySelector('.select__toggle').value
        year = document.querySelector('#yearSelector').querySelector('.select__toggle').value

        // load the data
        d3.csv('/data/mena' + country + ';' + year + '.0.csv', function(error, data) {
            // d3.csv("/data/total_data.csv", function(error, data) {

            //set up graph in same style as original example but empty
            graph = { "nodes": [], "links": [] };

            data.forEach(function(d) {
                graph.nodes.push({ "name": d.rtTitle });
                graph.nodes.push({ "name": d.ptTitle });
                graph.links.push({
                    "source": d.rtTitle,
                    "target": d.ptTitle,
                    "value": +d.TradeValue
                });
            });

            // return only the distinct / unique nodes
            graph.nodes = d3.keys(d3.nest()
                .key(function(d) { return d.name; })
                .object(graph.nodes));

            // loop through each link replacing the text with its index from node
            graph.links.forEach(function(d, i) {
                graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
                graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
            });

            // now loop through each nodes to make nodes an array of objects
            // rather than an array of strings
            graph.nodes.forEach(function(d, i) {
                graph.nodes[i] = { "name": d };
            });

            sankey
                .nodes(graph.nodes)
                .links(graph.links)
                .layout(32);

            // add in the links
            var link = svg.append("g").selectAll(".link")
                .data(graph.links)
                .enter().append("path")
                .attr("class", "link")
                .attr("d", path)
                .style("stroke-width", function(d) { return Math.max(1, d.dy); })
                .sort(function(a, b) { return b.dy - a.dy; });

            // add the link titles
            link.append("title")
                .text(function(d) {
                    return d.source.name + " → " +
                        d.target.name + "\n" + format(d.value);
                });

            // add in the nodes
            var node = svg.append("g").selectAll(".node")
                .data(graph.nodes)
                .enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
                .call(d3.drag()
                    .subject(function(d) {
                        return d;
                    })
                    .on("start", function() {
                        this.parentNode.appendChild(this);
                    })
                    .on("drag", dragmove));

            // add the rectangles for the nodes
            node.append("rect")
                .attr("height", function(d) { return d.dy; })
                .attr("width", sankey.nodeWidth())
                .style("fill", function(d) {
                    return d.color = color(d.name.replace(/ .*/, ""));
                })
                .style("stroke", function(d) {
                    return d3.rgb(d.color).darker(2);
                })
                .append("title")
                .text(function(d) {
                    return d.name + "\n" + format(d.value);
                });

            // add in the title for the nodes
            node.append("text")
                .attr("x", -6)
                .attr("y", function(d) { return d.dy / 2; })
                .attr("dy", ".35em")
                .attr("text-anchor", "end")
                .attr("transform", null)
                .text(function(d) {
                    console.log(d)
                    return d.name + " " + f(d.value)
                })
                .filter(function(d) { return d.x < width / 2; })
                .attr("x", 6 + sankey.nodeWidth())
                .attr("text-anchor", "start");

            // the function for moving the nodes
            function dragmove(d) {
                d3.select(this)
                    .attr("transform",
                        "translate(" +
                        d.x + "," +
                        (d.y = Math.max(
                            0, Math.min(height - d.dy, d3.event.y))) + ")");
                sankey.relayout();
                link.attr("d", path);
            }
        });
    }
    update()
}
sankey_chart()