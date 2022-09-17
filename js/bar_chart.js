function bar_chart() {
    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 30, bottom: 40, left: 90 },
        width = 700 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    // append the svg object to the body of the page


    var list = document.getElementById('barchartBlock')
    try {
        while (list.firstChild) {
            list.removeChild(list.lastChild);
        }
    } catch {}
    il = document.createElement('div');
    il.id = 'bar_chart'
    list.appendChild(il)

    var svg = d3.select("#bar_chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Initialize the X axis
    var x = d3.scaleLinear()
        .domain([0, 10000])
        .range([0, width]);
    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")

    // Initialize the Y axis
    var y = d3.scaleBand()
        .range([0, height])

    var yAxis = svg.append("g")
        .attr("class", "myYaxis")



    function update_bar_chart() {

        country = document.querySelector('#countrySelector').querySelector('.select__toggle').value
        year = document.querySelector('#yearSelector').querySelector('.select__toggle').value
        flow = document.querySelector('#flowsSelector').querySelector('.select__toggle').value
        category = document.querySelector('#categorySelector').querySelector('.select__toggle').value

        // Parse the Data
        d3.csv('/data/' + country + ';' + year + ';' + flow + ';' + category + '.csv',
            function(data) {

                // console.log('barchart', country, year, flow, category)
                console.log('/data/' + country + ';' + year + ';' + flow + ';' + category + '.csv', data.length, country, year, flow, category)

                // data = data.filter(d => d.rtTitle == country)
                // data = data.filter(d => d.yr == year)
                // data = data.filter(d => d.rgDesc == flow)
                // data = data.filter(d => d.cmdDescE == category)

                TradeValue = []

                data.forEach(element => {
                    TradeValue.push(element.TradeValue)
                });

                data = data.sort(function(b, a) {
                    return a.TradeValue - b.TradeValue;
                });


                // Update the X axis
                y.domain(data.map(function(d) {
                    return d.ptTitle;
                }))

                yAxis.call(d3.axisLeft(y))


                // Update the Y axis
                x.domain([0, d3.max(TradeValue)])

                xAxis
                    .transition()
                    .duration(1000)
                    .call(d3.axisBottom(x))
                    .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-45)")
                    .style("text-anchor", "end");

                // Add X axis
                // var x = d3.scaleLinear()
                //     .domain([0, d3.max(TradeValue)])
                //     .range([0, width]);
                // svg.append("g")
                //     .attr("transform", "translate(0," + height + ")")
                //     .call(d3.axisBottom(x))
                //     .selectAll("text")
                //     .attr("transform", "translate(-10,0)rotate(-45)")
                //     .style("text-anchor", "end");



                // // Y axis
                // var y = d3.scaleBand()
                //     .range([0, height])
                //     .domain(data.map(function(d) { return d.ptTitle; }))
                //     .padding(.1);
                // svg.append("g")
                //     .call(d3.axisLeft(y))

                var u = svg.selectAll("rect")
                    .data(data)

                u
                    .enter()
                    .append("rect") // Add a new rect for each new elements
                    .merge(u) // get the already existing elements as well
                    .transition() // and apply changes to all of them
                    .duration(1000)
                    .attr("x", x(0))
                    .attr("y", function(d) { return y(d.ptTitle); })
                    .attr("width", function(d) { return x(d.TradeValue); })
                    .attr("height", y.bandwidth())
                    .attr("fill", "#69b3a2")


                u
                    .exit()
                    .remove()


                //Bars
                // svg.selectAll("myRect")
                //     .data(data)
                //     .enter()
                //     .append("rect")
                //     .attr("x", x(0))
                //     .attr("y", function(d) { return y(d.ptTitle); })
                //     .attr("width", function(d) { return x(d.TradeValue); })
                //     .attr("height", y.bandwidth())
                //     .attr("fill", "#69b3a2")


                // .attr("x", function(d) { return x(d.Country); })
                // .attr("y", function(d) { return y(d.Value); })
                // .attr("width", x.bandwidth())
                // .attr("height", function(d) { return height - y(d.Value); })
                // .attr("fill", "#69b3a2")


            })

    }

    update_bar_chart()

    document.querySelector('#categorySelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update_bar_chart()
    });

}