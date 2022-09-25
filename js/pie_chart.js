function PieChart() {
    var f = d3.format(".2s")

    // Create dummy data
    d3.json('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/piechart.json', function(data) {

        function update() {

            var list = document.getElementById('pieChartBlock')
            try {
                while (list.firstChild) {
                    list.removeChild(list.lastChild);
                }
            } catch {}
            il = document.createElement('div');
            il.id = 'pie_chart'
            list.appendChild(il)


            // set the dimensions and margins of the graph
            var width = 700
            height = 700
            margin = 40

            // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
            var radius = Math.min(width, height) / 2 - margin

            // append the svg object to the div called 'my_dataviz'
            var svg = d3.select("#pie_chart")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


            country = document.querySelector('#countrySelector').querySelector('.select__toggle').value
            year = document.querySelector('#yearSelector').querySelector('.select__toggle').value
                // console.log(data)
            console.log(country)
            console.log(year)
                // var data = { a: 9, b: 20, c: 30, d: 8, e: 12 }

            filtered_data = []

            for (const [key, value] of Object.entries(data)) {
                if (key == country) {
                    console.log(key, value)
                    for (const [k, v] of Object.entries(value)) {
                        // console.log(String(k).slice(0, 4))
                        console.log(String(k).slice(0, 4) == String(year))
                        if (String(k).slice(0, 4) == String(year)) {
                            filtered_data.push(v)
                        } else {}
                    }
                } else {}
            }

            console.log(filtered_data[0].Export)

            // set the color scale
            var color = d3.scaleOrdinal()
                .domain(filtered_data[0])
                .range(d3.schemeSet2);

            // Compute the position of each group on the pie:
            var pie = d3.pie()
                .value(function(d) { return d.value; })
            var data_ready = pie(d3.entries(filtered_data[0]))
                // Now I know that group A goes from 0 degrees to x degrees and so on.

            // shape helper to build arcs:
            var arcGenerator = d3.arc()
                .innerRadius(0)
                .outerRadius(radius)

            // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
            svg
                .selectAll('mySlices')
                .data(data_ready)
                .enter()
                .append('path')
                .attr('d', arcGenerator)
                .attr('fill', function(d) { return (color(d.data.key)) })
                .attr("stroke", "black")
                .style("stroke-width", "2px")
                .style("opacity", 0.7)

            // Now add the annotation. Use the centroid method to get the best coordinates
            svg
                .selectAll('mySlices')
                .data(data_ready)
                .enter()
                .append('text')
                .text(function(d) { return d.data.key + ": " + f(d.data.value) })
                .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
                .style("text-anchor", "middle")
                .style("font-size", 17)


        }
        update()

        document.querySelector('#categorySelector').addEventListener('select.change', (e) => {
            const btn = e.target.querySelector('.select__toggle');
            update_bar_chart()
        });
    })

}