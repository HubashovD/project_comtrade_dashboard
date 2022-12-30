function PieChart() {
    console.log('PieChart()')

    var f = d3.format(".2s")
    console.log('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/piechart.json')
        // Create dummy data
    d3.json('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/piechart.json', function(data) {

        function update() {
            // console.log('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/piechart.json')

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
            var width = 690
            height = 350
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
                // console.log(country)
                // console.log(year)
                // var data = { a: 9, b: 20, c: 30, d: 8, e: 12 }

            filtered_data = []

            for (const [key, value] of Object.entries(data)) {
                if (key == country) {
                    // console.log(key, value)
                    for (const [k, v] of Object.entries(value)) {
                        // console.log(String(k).slice(0, 4))
                        // console.log(String(k).slice(0, 4) == String(year))
                        if (String(k).slice(0, 4) == String(year)) {
                            filtered_data.push(v)
                        } else {}
                    }
                } else {}
            }

            // console.log(filtered_data[0].Export)

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


            explainer = svg.append('text')

            explainer
                .text("Country: " + country + ' Year: ' + year)
                .attr("y", -150)
                .attr("x", -330)
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
            d3.select('#saveButtonBar').on('click', function() {
                // console.log(d3.select('#bar_chart').select('svg'))
                var svgString = getSVGString(d3.select('#bar_chart').select('svg').node());

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


            // var downloadButtonDiv = document.getElementById("downloadButtonDiv");

            // try {
            //     while (downloadButtonDiv.firstChild) {
            //         downloadButtonDiv.removeChild(downloadButtonDiv.lastChild);
            //     }
            // } catch {}

            downloadButton = document.getElementById('saveButtonPieData')
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
        update()

        document.querySelector('#categorySelector').addEventListener('select.change', (e) => {
            const btn = e.target.querySelector('.select__toggle');
            update()
        });
    })

}