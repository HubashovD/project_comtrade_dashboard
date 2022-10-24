function map_chart() {
    var f = d3.format(".2s")

    function update() {
        var list = document.getElementById('mapchartBlock')
        try {
            while (list.firstChild) {
                list.removeChild(list.lastChild);
            }
        } catch {}
        il = document.createElement('div');
        il.id = 'map_chart'
        list.appendChild(il)
            // The svg

        var margin = { top: 10, right: 10, bottom: 10, left: 10 },
            width = 690 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;


        var mapsvg = d3.select("#map_chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("style", "background-color:white")
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Map and projection
        var projection = d3.geoMercator()
            .scale(130)
            .translate([width / 2, height / 2 * 1.3])

        // A path generator
        var path = d3.geoPath()
            .projection(projection)

        country = document.querySelector('#countrySelector').querySelector('.select__toggle').value
        year = document.querySelector('#yearSelector').querySelector('.select__toggle').value
        flow = document.querySelector('#flowsSelector').querySelector('.select__toggle').value
        category = document.querySelector('#categorySelector').querySelector('.select__toggle').value

        console.log('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/' + country + ';' + year + ';' + flow + ';' + category + '.csv')
            // Load world shape AND list of connection
        d3.queue()
            .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson") // World shape
            // .defer(d3.csv, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_connectionmap.csv") // Position of circles
            .defer(d3.csv, 'https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/' + country + ';' + year + ';' + flow + ';' + category + '.csv') // Position of circles
            .await(ready);

        function ready(error, dataGeo, data) {
            console.log('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/' + country + ';' + year + ';' + flow + ';' + category + '.csv')





            // Reformat the list of link. Note that columns in csv file are called long1, long2, lat1, lat2
            var link = []
            var valuesList = []
            data.forEach(function(row) {
                if (row.Subregion == 'World') {} else {
                    // console.log(row)
                    valuesList.push(+row.TradeValue)
                    source = [+row.rtLon, +row.rtLat]
                    target = [+row.ptLat, +row.ptLon]
                    topush = { type: "LineString", coordinates: [source, target], rgDesc: row.rgDesc, TradeValue: row.TradeValue, Partner: row.Subregion }
                    link.push(topush)
                }
            })

            // console.log(link)

            console.log('valeus list ', valuesList)
            console.log('max value: ', d3.max(valuesList))

            valuesList.forEach(function(d) { console.log(+d) })


            const interpolator = d3.interpolateRound(1, 3)

            // Draw the map
            map_g = mapsvg.append("g")

            map_g
                .selectAll("path")
                .data(dataGeo.features)
                .enter().append("path")
                .attr("fill", "#b8b8b8")
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
                .style("stroke", "#fff")
                .style("stroke-width", 0)

            // Add the path
            map_g.selectAll("myPath")
                .data(link)
                .enter()
                .append("path")
                .attr("d", function(d) {
                    // console.log(d)
                    return path(d)
                })
                .style("fill", "none")
                .style("opacity", "0.7")
                .style('stroke-linecap', 'round')
                .style("stroke", function(d) {
                    if (d.rgDesc == 'Export') {
                        return 'red'
                    } else {
                        return 'green'
                    }
                })
                .style('stroke-width', function(d) {
                    console.log('value: ', d.TradeValue, 'max value: ', d3.max(valuesList), 'rate: ', d.TradeValue / d3.max(valuesList), 'interpolate: ', interpolator(d.TradeValue / d3.max(valuesList)))
                        // console.log(interpolator(d.TradeValue / d3.max(valuesList)))
                    return interpolator(d.TradeValue / d3.max(valuesList))
                })

            map_g.selectAll("myCircles")
                .data(link)
                .enter()
                .append("circle")
                .attr('cx', function(d) {
                    // console.log(d.coordinates[1])
                    // console.log(projection(d.coordinates[1]))
                    return projection(d.coordinates[1])[0]
                })
                .attr('cy', function(d) {
                    // console.log(d.coordinates[1][1])
                    // console.log(projection(d.coordinates[1][1]))
                    return projection(d.coordinates[1])[1]
                })
                .attr('r', function(d) {
                    return interpolator(d.TradeValue / d3.max(valuesList))
                })
                .style("fill", "white")
                .attr('class', 'circles')
                .style("stroke-width", 2)
                .style("stroke", "red");

            map_g.selectAll("myTexts")
                .data(link)
                .enter()
                .append("text")
                .attr('x', function(d) {
                    return projection(d.coordinates[1])[0]
                })
                .attr('y', function(d) {
                    return projection(d.coordinates[1])[1]
                })
                .attr('class', 'texts')
                .text(function(d) {
                    console.log(d)
                    text = d.Partner + ': ' + f(d.TradeValue)
                    return text
                })
                .style('color', "black")
                .style('font-size', '12')

            var zoom = d3.zoom()
                .scaleExtent([1, 8])
                .on('zoom', function() {
                    // console.log(d3.event.transform)
                    map_g.selectAll('path')
                        .attr('transform', d3.event.transform);
                    circles = map_g.selectAll('.circles')
                        // console.log(circles)
                    circles.attr('transform', d3.event.transform)
                        // .attr("cx", d3.event.transform.k)
                    texts = map_g.selectAll('.texts')
                    texts.attr('transform', d3.event.transform)
                    texts.style('font-size', 12 - d3.event.transform.k)
                });

            mapsvg.call(zoom);

            explainer_background = mapsvg.append('rect')


            explainer_background
                .attr('x', -10)
                .attr('y', -10)
                .style('fill', 'white')
                .style('width', '700px')
                .style('height', '40px')


            explainer = mapsvg.append('text')

            explainer
                .text("Country: " + country + ' Year: ' + year + ' Flow: ' + flow + ' Category num: ' + category)
                .attr("y", 20)
                .attr("x", 0)
                .style('font', '12px')
                .style('color', '#444444')
                .style('margin-bottom', '5px')
                .style("font-family", "'Montserrat', sans-serif")



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
            d3.select('#saveButtonMap').on('click', function() {
                // console.log(d3.select('#bar_chart').select('svg'))
                var svgString = getSVGString(d3.select('#map_chart').select('svg').node());

                svgString2Image(svgString, 2 * width, 2 * height, 'png', save); // passes Blob and filesize String to the callback

                function save(dataBlob, filesize) {
                    saveAs(dataBlob, country + '_' + year + '_' + flow + '_' + category + '.png'); // FileSaver.js function
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
                // ignorelist = []

            for (const [key, value] of Object.entries(data[0])) {
                console.log(key)
                if (ignorelist.includes(key)) {} else {
                    head.push(key)
                }
            }

            console.log(head)


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

            console.log(dataForDownload)


            // var downloadButtonDiv = document.getElementById("downloadButtonDiv");

            // try {
            //     while (downloadButtonDiv.firstChild) {
            //         downloadButtonDiv.removeChild(downloadButtonDiv.lastChild);
            //     }
            // } catch {}

            downloadButton = document.getElementById('saveButtonMapData')
                // downloadButton.type = "button"
                // downloadButton.value = "Download data"
                // downloadButton.id = "downloadButton"
                // downloadButtonDiv.appendChild(downloadButton)


            // parentIndicator = document.querySelector('#indicatorsSelector')
            // const btn9 = parentIndicator.querySelector('.select__toggle');
            // // console.log(`Выбранное значение: ${btn9.innerHTML}`);
            // csvName = btn9.innerHTML


            var listener = function() {
                exportToCsv(country + '_' + year + '_' + flow + '_' + category, dataForDownload)
            }

            downloadButton.addEventListener('click', listener)

        }

    }

    update()

    document.querySelector('#categorySelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update()
    });


}