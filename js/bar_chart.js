function bar_chart() {
    console.log('call barchart')

    var f = d3.format(".2s")
        // set the dimensions and margins of the graph
    var margin = { top: 20, right: 50, bottom: 40, left: 90 },
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

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
    // function make_x_gridlines() {
    //     return d3.axisBottom(x)
    //         .ticks(5)
    // }

    // add the X gridlines
    // svg.append("g")
    //     .attr("class", "grid")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(make_x_gridlines()
    //         .tickSize(-height)
    //         .tickFormat("")
    //     )

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

                var f = d3.format(".2s")





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

                // xAxis
                //     .transition()
                //     .duration(1000)
                //     .call(d3.axisBottom(x))
                //     .selectAll("text")
                //     .attr("transform", "translate(-10,0)rotate(-45)")
                //     .style("text-anchor", "end")
                //     .text(function(d) {
                //         // console.log
                //         // console.log(f(d))
                //         return f(d)
                //     })

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


                var labels = svg.selectAll(".label")
                    .data(data)

                // console.log(labels)

                labels
                    .enter()
                    .append("text")
                    .attr("class", "label")
                    .merge(labels)
                    .attr("y", function(d) { return y(d.Subregion); })
                    .transition() // and apply changes to all of them
                    .duration(1000)
                    .attr("x", (function(d) { return x(d.TradeValue); }))
                    .attr("y", function(d) { return y(d.Subregion) + (y.bandwidth() / 2) + 3; })
                    .attr("dy", ".75em")
                    .text(function(d) {
                        // console.log(d)
                        if (d.TradeValue < 1.0) {
                            return d.TradeValue
                        } else {
                            return f(d.TradeValue)
                        }
                    });

                labels
                    .exit()
                    .remove()





                // Below are the functions that handle actual exporting:
                // getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
                function getSVGString(svgNode) {
                    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
                    var cssStyleText = getCSSStyles(svgNode);
                    appendCSS(cssStyleText, svgNode);

                    var serializer = new XMLSerializer();
                    var svgString = serializer.serializeToString(svgNode);
                    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
                    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

                    return svgString;

                    function getCSSStyles(parentElement) {
                        var selectorTextArr = [];

                        // Add Parent element Id and Classes to the list
                        selectorTextArr.push('#' + parentElement.id);
                        for (var c = 0; c < parentElement.classList.length; c++)
                            if (!contains('.' + parentElement.classList[c], selectorTextArr))
                                selectorTextArr.push('.' + parentElement.classList[c]);

                            // Add Children element Ids and Classes to the list
                        var nodes = parentElement.getElementsByTagName("*");
                        for (var i = 0; i < nodes.length; i++) {
                            var id = nodes[i].id;
                            if (!contains('#' + id, selectorTextArr))
                                selectorTextArr.push('#' + id);

                            var classes = nodes[i].classList;
                            for (var c = 0; c < classes.length; c++)
                                if (!contains('.' + classes[c], selectorTextArr))
                                    selectorTextArr.push('.' + classes[c]);
                        }

                        // Extract CSS Rules
                        var extractedCSSText = "";
                        for (var i = 0; i < document.styleSheets.length; i++) {
                            var s = document.styleSheets[i];

                            try {
                                if (!s.cssRules) continue;
                            } catch (e) {
                                if (e.name !== 'SecurityError') throw e; // for Firefox
                                continue;
                            }

                            var cssRules = s.cssRules;
                            for (var r = 0; r < cssRules.length; r++) {
                                if (contains(cssRules[r].selectorText, selectorTextArr))
                                    extractedCSSText += cssRules[r].cssText;
                            }
                        }


                        return extractedCSSText;

                        function contains(str, arr) {
                            return arr.indexOf(str) === -1 ? false : true;
                        }

                    }

                    function appendCSS(cssText, element) {
                        var styleElement = document.createElement("style");
                        styleElement.setAttribute("type", "text/css");
                        styleElement.innerHTML = cssText;
                        var refNode = element.hasChildNodes() ? element.children[0] : null;
                        element.insertBefore(styleElement, refNode);
                    }
                }


                function svgString2Image(svgString, width, height, format, callback) {
                    var format = format ? format : 'png';

                    var imgsrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

                    var canvas = document.createElement("canvas");
                    var context = canvas.getContext("2d");

                    canvas.width = width;
                    canvas.height = height;

                    var image = new Image();
                    image.onload = function() {
                        context.clearRect(0, 0, width, height);
                        context.drawImage(image, 0, 0, width, height);

                        canvas.toBlob(function(blob) {
                            var filesize = Math.round(blob.length / 1024) + ' KB';
                            if (callback) callback(blob, filesize);
                        });


                    };

                    image.src = imgsrc;
                }


                // Set-up the export button
                d3.select('#saveButtonBar').on('click', function() {
                    // console.log(d3.select('#bar_chart').select('svg'))
                    var svgString = getSVGString(d3.select('#bar_chart').select('svg').node());

                    svgString2Image(svgString, 2 * width, 2 * height, 'png', save); // passes Blob and filesize String to the callback

                    function save(dataBlob, filesize) {
                        saveAs(dataBlob, 'D3 vis exported to PNG.png'); // FileSaver.js function
                    }
                });



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