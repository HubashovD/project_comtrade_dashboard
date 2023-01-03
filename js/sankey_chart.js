// https://bl.ocks.org/d3noob/06e72deea99e7b4859841f305f63ba85

function sankey_chart() {

    var f = d3.format(".2s")

    var units = "Widgets";

    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 10, bottom: 10, left: 10 },
        width = 590 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom;

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
            .attr("style", "background-color:white")
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // console.log(svg)

        // Set the sankey diagram properties
        var sankey = d3.sankey()
            .nodeWidth(36)
            .nodePadding(40)
            .size([width, height]);

        var path = sankey.link();

        country = document.querySelector('#countrySelector').querySelector('.select__toggle').value
        year = document.querySelector('#yearSelector').querySelector('.select__toggle').value
        console.log('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/mena' + country + ';' + year + '.csv')

        // load the data
        d3.csv('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/mena' + country + ';' + year + '.csv', function(error, data) {


            explainer = svg.append('text')

            explainer
                .text("Country: " + country + ' Year: ' + year)
                .attr("x", 0)
                .attr("y", 10)
                .style('font', '12px')
                .style('color', '#444444')
                .style('margin-bottom', '5px')
                .style("font-family", "'Montserrat', sans-serif")
                // d3.csv("/data/total_data.csv", function(error, data) {


            //set up graph in same style as original example but empty
            graph = { "nodes": [], "links": [] };

            data.forEach(function(d) {
                // console.log(d)
                graph.nodes.push({ "name": d.rtTitle });
                graph.nodes.push({ "name": d.Subregion });
                graph.links.push({
                    "source": d.rtTitle,
                    "target": d.Subregion,
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
                    // console.log(d)
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
            d3.select('#saveButtonSankey').on('click', function() {
                // console.log(d3.select('#bar_chart').select('svg'))
                var svgString = getSVGString(d3.select('#sankey_chart').select('svg').node());

                svgString2Image(svgString, 2 * width, 2 * height, 'png', save); // passes Blob and filesize String to the callback

                function save(dataBlob, filesize) {
                    saveAs(dataBlob, 'sankey_' + year + '_' + country + '.png'); // FileSaver.js function
                }
            });

            function exportToCsv(filename, rows) {
                var processRow = function(row) {
                    var finalVal = '';
                    for (var j = 0; j < row.length; j++) {
                        var innerValue = row[j] === null ? '' : row[j].toString();
                        if (row[j] instanceof Date) {
                            innerValue = row[j].toLocaleString();
                        };
                        var result = innerValue.replace(/"/g, '""');
                        if (result.search(/("|,|\n)/g) >= 0)
                            result = '"' + result + '"';
                        if (j > 0)
                            finalVal += ',';
                        finalVal += result;
                    }
                    return finalVal + '\n';
                };

                var csvFile = '';
                for (var i = 0; i < rows.length; i++) {
                    csvFile += processRow(rows[i]);
                }

                var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
                if (navigator.msSaveBlob) { // IE 10+
                    navigator.msSaveBlob(blob, filename);
                } else {
                    var link = document.createElement("a");
                    if (link.download !== undefined) { // feature detection
                        // Browsers that support HTML5 download attribute
                        var url = URL.createObjectURL(blob);
                        link.setAttribute("href", url);
                        link.setAttribute("download", filename);
                        link.style.visibility = 'hidden';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                }
            }



            // console.log(data)

            var dataForDownload = []
            var head = []
                // console.log(data)

            ignorelist = ["rtLat", "rtLon", "ptLon", "ptLat"]

            for (const [key, value] of Object.entries(data[0])) {
                if (ignorelist.includes(key)) {} else {
                    head.push(key)
                }
            }

            // console.log(head)


            dataForDownload.push(head)
            data.forEach((elem) => {
                row = []
                for (const [key, value] of Object.entries(elem)) {
                    if (ignorelist.includes(key)) {} else {
                        row.push(value)
                    }
                }
                dataForDownload.push(row)
            })

            // console.log(dataForDownload)

            downloadButton = document.getElementById('saveButtonSankeyData')

            var listener = function() {
                exportToCsv(country + '_' + year + '_' + flow + '_' + category, dataForDownload)
            }

            downloadButton.addEventListener('click', listener)




        });
    }
    update()
}
sankey_chart()