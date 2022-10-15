function bar_chart() {
    console.log('call barchart')

    var f = d3.format(".2s")
        // set the dimensions and margins of the graph
    var margin = { top: 20, right: 50, bottom: 40, left: 90 },
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

    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(x)
            .ticks(5)
    }

    // add the X gridlines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        )

    function update_bar_chart() {
        console.log('call update_bar_chart()')

        country = document.querySelector('#countrySelector').querySelector('.select__toggle').value
        year = document.querySelector('#yearSelector').querySelector('.select__toggle').value
        flow = document.querySelector('#flowsSelector').querySelector('.select__toggle').value
        category = document.querySelector('#categorySelector').querySelector('.select__toggle').value

        console.log('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/' + country + ';' + year + ';' + flow + ';' + category + '.csv')

        // Parse the Data
        d3.csv('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/' + country + ';' + year + ';' + flow + ';' + category + '.csv',
            // d3.csv('/data/' + country + ';' + year + ';' + flow + ';' + category + '.csv',
            function(data) {





                data = data.filter(d => d.Subregion != 'World')

                TradeValue = []

                data.forEach(element => {
                    TradeValue.push(+element.TradeValue)
                });

                data = data.sort(function(b, a) {
                    return a.TradeValue - b.TradeValue;
                });



                TradeValue = TradeValue.sort(function(b, a) {
                    return a - b;
                });

                // console.log(TradeValue)


                // Update the X axis
                y.domain(data.map(function(d) {
                    return d.Subregion;
                }))

                yAxis.call(d3.axisLeft(y))


                // Update the Y axis
                x.domain([0, d3.max(TradeValue)])
                    // console.log(d3.max(TradeValue))

                xAxis
                    .transition()
                    .duration(1000)
                    .call(d3.axisBottom(x))
                    .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-45)")
                    .style("text-anchor", "end")
                    .text(function(d) {
                        // console.log
                        // console.log(f(d))
                        return f(d)
                    })

                var u = svg.selectAll("rect")
                    .data(data)

                u
                    .enter()
                    .append("rect") // Add a new rect for each new elements
                    .merge(u) // get the already existing elements as well
                    .transition() // and apply changes to all of them
                    .duration(1000)
                    .attr("x", x(0))
                    .attr("y", function(d) { return y(d.Subregion); })
                    .attr("width", function(d) { return x(d.TradeValue); })
                    .attr("height", y.bandwidth())
                    .attr("fill", "#69b3a2")


                u
                    .exit()
                    .remove()



            })

    }

    update_bar_chart()

    document.querySelector('#yearSelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update_bar_chart()
    });

    document.querySelector('#categorySelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update_bar_chart()
    });

}