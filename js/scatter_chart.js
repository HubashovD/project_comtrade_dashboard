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

        console.log('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/' + "scatter;" + year + '.0;' + country + '.csv')

        //Read the data
        d3.csv('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/' + "scatter;" + year + '.0;' + country + '.csv', function(data) {

            // console.log('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/' + "scatter;" + year + '.0;' + country + '.csv')



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
            d3.select('#saveButtonScatter').on('click', function() {
                // console.log(d3.select('#bar_chart').select('svg'))
                var svgString = getSVGString(d3.select('#scatter_chart').select('svg').node());

                svgString2Image(svgString, 2 * width, 2 * height, 'png', save); // passes Blob and filesize String to the callback

                function save(dataBlob, filesize) {
                    saveAs(dataBlob, 'D3 vis exported to PNG.png'); // FileSaver.js function
                }
            });

        })
    }
    update()

    document.querySelector('#categorySelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update()
    });
}