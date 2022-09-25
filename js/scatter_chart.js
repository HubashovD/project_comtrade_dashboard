function scatterChart() {

    var f = d3.format(".2s")

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 700 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;


    function update() {

        var list = document.getElementById('scatterchartBlock')
        try {
            while (list.firstChild) {
                list.removeChild(list.lastChild);
            }
        } catch {}
        il = document.createElement('div');
        il.id = 'scatter_chart'
        list.appendChild(il)

        // append the svg object to the body of the page
        var svg = d3.select("#scatter_chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");



        country = document.querySelector('#countrySelector').querySelector('.select__toggle').value
        year = document.querySelector('#yearSelector').querySelector('.select__toggle').value

        //Read the data
        d3.csv('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/' + "scatter;" + year + '.0;' + country + '.csv', function(data) {

            console.log('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/' + "scatter;" + year + '.0;' + country + '.csv')



            // Add X axis
            var x = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return +d.TradeValue_export })])
                .range([0, width]);

            xAxis = svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            xAxis
                .selectAll("text")
                .text(function(d) {
                    // console.log
                    // console.log(f(d))
                    return f(d)
                })

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return +d.TradeValue_import })])
                .range([height, 0]);

            yAxis = svg.append("g")
                .call(d3.axisLeft(y));

            yAxis
                .selectAll("text")
                .text(function(d) {
                    // console.log
                    // console.log(f(d))
                    return f(d)
                })

            // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
            // Its opacity is set to 0: we don't see it by default.
            var tooltip = d3.select("#scatter_chart")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px")



            // A function that change this tooltip when the user hover a point.
            // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
            var mouseover = function(d) {
                tooltip
                    .style("opacity", 1)
            }

            var mousemove = function(d) {
                tooltip
                    .html("Catrgory: " + d.cmdDescE + "<br>Export value: " + f(d.TradeValue_export) + "<br>Import value: " + f(d.TradeValue_import))
                    .style("left", (d3.mouse(this)[0] + 90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                    .style("top", (d3.mouse(this)[1]) + "px")
            }

            // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
            var mouseleave = function(d) {
                tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", 0)
            }

            // Add dots
            svg.append('g')
                .selectAll("dot")
                .data(data) // the .filter part is just to keep a few dots on the chart, not all of them
                .enter()
                .append("circle")
                .attr("cx", function(d) { return x(d.TradeValue_export); })
                .attr("cy", function(d) { return y(d.TradeValue_import); })
                .attr("r", 7)
                .style("fill", "#69b3a2")
                .style("opacity", 0.3)
                .style("stroke", "white")
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)

        })
    }
    update()

    document.querySelector('#categorySelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update()
    });
}