function line_chart() {



    function update() {

        var list = document.getElementById('linechartBlock')
        try {
            while (list.firstChild) {
                list.removeChild(list.lastChild);
            }
        } catch {}
        il = document.createElement('div');
        il.id = 'line_chart'
        list.appendChild(il)
            // The svg

        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 30, bottom: 30, left: 60 },
            width = 700 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#line_chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        flow = document.querySelector('#flowsSelector').querySelector('.select__toggle').value
        category = document.querySelector('#categorySelector').querySelector('.select__toggle').value
            //Read the data
        d3.csv('/data/line;' + flow + ';' + category + '.csv', function(data) {

            console.log('line_chart', '/data/line;' + flow + ';' + category + '.csv')

            // group the data: I want to draw one line per group
            var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
                .key(function(d) { return d.rtTitle; })
                .entries(data);

            console.log(sumstat)

            // Add X axis --> it is a date format
            // .domain(d3.extent(data, function(d) { return d.yr; }))
            var x = d3.scaleLinear()
                .domain([2018, 2019, 2020, 2021, 2022])
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).ticks(5));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return +d.TradeValue; })])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // color palette
            var res = sumstat.map(function(d) { return d.key }) // list of group names

            console.log(res)
            var color = d3.scaleOrdinal()
                .domain(res)
                .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])

            // Draw the line
            svg.selectAll(".line")
                .data(sumstat)
                .enter()
                .append("path")
                .attr("fill", "none")
                .attr("stroke", function(d) { return color(d.key) })
                .attr("stroke-width", 1.5)
                .attr("d", function(d) {
                    return d3.line()
                        .x(function(d) { return x(d.yr); })
                        .y(function(d) { return y(+d.TradeValue); })
                        (d.values)
                })

        })
    }

    update()

    document.querySelector('#categorySelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update()
    });
}