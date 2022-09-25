function line_chart() {
    var f = d3.format(".2s")


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
        d3.csv('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/line;' + flow + ';' + category + '.csv', function(data) {

            console.log('line_chart', 'https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/line;' + flow + ';' + category + '.csv')


            // data = data.forEach(function(d) {
            //     return d.yr = Date.parse(String(d.yr).slice(0, 4) + "-01-01")
            // })

            console.log(data)

            // group the data: I want to draw one line per group
            var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
                .key(function(d) { return d.rtTitle; })
                .entries(data);

            console.log(sumstat)

            // Add X axis --> it is a date format
            // .domain(d3.extent(data, function(d) { return d.yr; }))
            // Add X axis --> it is a date format

            // ТУТ ТРЕБА БУДЕ ЗМІНИТИ ПОТІМ, КОЛИ ФОРРМАТИ ДАТ ПРИВЕДУТЬСЯ ДО НОРМАЛЬНИХ !"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
            var x = d3.scaleTime()
                .domain(d3.extent(data, function(d) {
                    // console.log(String(d.yr).slice(0, 4) + "-01-01")
                    return Date.parse(String(d.yr).slice(0, 4) + "-01-01");
                }))
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).ticks(window.innerWidth / 150));

            // var x = d3.scaleLinear()
            //     .domain([d3.min(data, function(d) { return +d.yr; }), d3.max(data, function(d) { return +d.yr; })])
            //     .range([0, width])
            // svg.append("g")
            //     .attr("transform", "translate(0," + height + ")")
            //     .call(d3.axisBottom(x).ticks(5));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return +d.TradeValue; })])
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

            // color palette
            var res = sumstat.map(function(d) { return d.key }) // list of group names

            // console.log(res)

            var color = d3.scaleOrdinal()
                .domain(res)
                .range([
                    "#ccece6",
                    "#99d8c9",
                    "#66c2a4",
                    "#41ae76",
                    "#238b45",
                    "#006d2c",
                    "#00441b",
                    "#e0f3db",
                    "#ccebc5",
                    "#a8ddb5",
                    "#7bccc4",
                    "#4eb3d3",
                    "#2b8cbe",
                    "#0868ac",
                    "#084081",
                ])

            // gridlines in x axis function
            function make_x_gridlines() {
                return d3.axisBottom(x)
                    .ticks(5)
            }

            // gridlines in y axis function
            function make_y_gridlines() {
                return d3.axisLeft(y)
                    .ticks(5)
            }

            // add the Y gridlines
            svg.append("g")
                .attr("class", "grid")
                .call(make_y_gridlines()
                    .tickSize(-width)
                    .tickFormat("")
                )

            // add the X gridlines
            svg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0," + height + ")")
                .call(make_x_gridlines()
                    .tickSize(-height)
                    .tickFormat("")
                )



            var glines = svg.selectAll('.line-group')
                .data(sumstat).enter()
                .append('g')
                .attr('class', 'line-group');

            // Draw the line
            // glines = svg.selectAll(".line")
            //     .data(sumstat)
            //     .enter()
            //     .append("path")
            //     .attr('class', 'line-interactive')
            //     .attr("fill", "none")
            //     .attr("stroke", function(d) { return color(d.key) })
            //     .attr("stroke-width", 1.5)
            //     .attr("d", function(d) {
            //         return d3.line()
            //             .x(function(d) { return x(d.yr); })
            //             .y(function(d) { return y(+d.TradeValue); })
            //             (d.values)
            //     });

            glines
                .append('path')
                .attr('class', 'line-interactive')
                .attr("fill", "none")
                .attr("stroke", function(d) {
                    return color(d.key)
                })
                .attr("stroke-width", 1.5)
                .attr("d", function(d) {
                    return d3.line()
                        .x(function(d) { return x(Date.parse(String(d.yr).slice(0, 4) + "-01-01")); })
                        .y(function(d) { return y(+d.TradeValue); })
                        (d.values)
                })


            // svg
            //     .append('rect')
            //     .style("fill", "none")
            //     .style("pointer-events", "all")
            //     .attr('width', width)
            //     .attr('height', height)


            /* tooltips */
            var mouseG = glines.append("g") // black vertical line
                .attr("class", "mouse-over-effects");

            console.log(mouseG)

            mouseG.append("path")
                .attr("class", "mouse-line")
                .style("stroke", "black")
                .style("stroke-width", "1px")
                .style("opacity", "1");

            var mousePerLine = mouseG
                .append("g")
                .attr("class", "mouse-per-line");

            console.log(mousePerLine)

            mousePerLine.append("circle")
                .attr("r", 7)
                .style("stroke", 'black')
                .style("fill", "none")
                .style("stroke-width", "1px")
                .style("opacity", "1");

            // .style("stroke", function(d) {
            //     return color(d.key);
            // })

            mousePerLine.append("text")
                .attr("transform", "translate(10,3)");

            var lines = document.getElementsByClassName("line-interactive");

            console.log(lines)

            mouseG.append("rect")
                .attr("width", width)
                .attr("height", height)
                .attr("fill", "none")
                .attr("pointer-events", "all")
                .on("mouseout", function() {
                    d3.select(".mouse-line").style("opacity", "1");
                    d3.selectAll(".mouse-per-line circle").style("opacity", "1");
                    d3.selectAll(".mouse-per-line text").style("opacity", "1")
                })
                .on("mouseover", function() {
                    console.log('Hello')
                    d3.select(".mouse-line").style("opacity", "1");
                    d3.selectAll(".mouse-per-line circle").style("opacity", "1");
                    d3.selectAll(".mouse-per-line text").style("opacity", "1")
                })
                .on("mousemove", function() {
                    // console.log('Hello')
                    var bisect = d3.bisector(function(d) { return Date(String(d.yr).slice(0, 4) + "-01-01") }).right;
                    // console.log(bisect)
                    var mouse = d3.mouse(this);
                    // console.log(mouse)
                    var xDate = x.invert(mouse[0]);
                    // console.log(xDate)
                    d3.select(".mouse-line")
                        .attr("d", function() {
                            var d = "M" + mouse[0] + "," + height;
                            d += " " + mouse[0] + "," + 0;
                            return d;
                        });

                    d3.selectAll(".mouse-per-line")
                        .attr("transform", function(d, i) {
                            var idx = bisect(d.values, xDate);
                            // console.log(xDate)

                            var beginning = 0,
                                end = lines[i].getTotalLength(),
                                target = null;

                            while (true) {
                                target = Math.floor((beginning + end) / 2);
                                pos = lines[i].getPointAtLength(target);
                                if ((target === end || target == beginning) && pos.x !== mouse[0]) {
                                    break;
                                }
                                if (pos.x > mouse[0]) end = target;
                                else if (pos.x < mouse[0]) beginning = target;
                                else break; // position found
                            }

                            d3.select(this)
                                .select("text")
                                .text(function() {
                                    var textValue = d.values.filter(function(k) {
                                        // console.log(k)
                                        //витягуємо з повернутої bisect дати:
                                        // - рік (додаємо до нього 1900, щоб він виглядав нормально)  
                                        // -місяць
                                        // -дату ставимо вручну такою, що дорівнює 1 числу   
                                        // console.log(xDate.getYear() + 1900)
                                        // console.log('k.yr')
                                        // console.log(Number(String(k.yr).slice(0, 4)))
                                        let target_date = new Date(xDate.getYear() + 1900, xDate.getMonth(), 01)
                                            // console.log(String(k.yr).slice(0, 4) + "-01-01")
                                            // console.log(new Date(String(k.yr).slice(0, 4) + "-01-01"))

                                        y = Date(String(k.yr).slice(0, 4) + "-01-01")
                                            // console.log(target_date.getTime())
                                            // console.log(Date.parse(target_date))
                                            // console.log(Date.parse(y))
                                            //порівнюємо штучну дату в датасеті зі штучно скомпановою вище - вуаля
                                            // if (Date(String(k.yr).slice(0, 4) + "-01-01").getYear() + 1900 === xDate.getYear() + 1900) {
                                            //     console.log(y)
                                            // } else {}
                                        return new Date(String(k.yr).slice(0, 4) + "-01-01").getFullYear() === target_date.getFullYear()
                                    });
                                    // console.log(textValue)

                                    if (textValue.length > 0) {
                                        // console.log(textValue[0])
                                        return textValue[0].rtTitle + ": " + f(textValue[0].TradeValue)
                                    }
                                })
                                .style("fill", function(d) {
                                    return color(d.key)
                                })
                            return "translate(" + mouse[0] + "," + (pos.y) + ")";
                        })

                });



            legend_block = document.getElementById('legend_block')

            try {
                while (legend_block.firstChild) {
                    legend_block.removeChild(legend_block.lastChild);
                }
            } catch {}

            legend_block.style.cssText = "display: grid; grid-template-columns: repeat(9, 1fr);  grid-auto-flow: row; margin-bottom 1vh; grid-template-rows: auto 1fr;" //grid-gap: 5px;

            res.forEach(country => {
                legendElement = document.createElement('div');
                colorSquare = document.createElement('div');
                legendText = document.createElement('p');
                legendText.innerHTML = country
                colorSquare.style.cssText = "height: 10px; width: 10px; background-color:" + color(country) + "; height: 12px;"
                legendElement.style.cssText = "display: grid; grid-template-columns: 1fr 95%; align-items: center; height: fit-content; min-height: 12px;"
                legend_block.appendChild(legendElement)
                legendElement.appendChild(colorSquare)
                legendElement.appendChild(legendText)

            })
        })

    }

    update()

    document.querySelector('#categorySelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update()
    });
}