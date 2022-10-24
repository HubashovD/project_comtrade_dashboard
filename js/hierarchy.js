function hierarchy() {



    function update() {

        var list = document.getElementById('hierarchyBlock')
        try {
            while (list.firstChild) {
                list.removeChild(list.lastChild);
            }
        } catch {}
        il = document.createElement('div');
        il.id = 'hierarchy'
        list.appendChild(il)


        var diameter = 690,
            radius = diameter / 2,
            innerRadius = radius - 120;

        var cluster = d3.cluster()
            .size([360, innerRadius]);

        var line = d3.radialLine()
            .curve(d3.curveBundle.beta(0.85))
            .radius(function(d) { return d.y; })
            .angle(function(d) { return d.x / 180 * Math.PI; });

        var svg = d3.select("#hierarchy").append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .append("g")
            .attr("transform", "translate(" + radius + "," + radius + ")");

        var link = svg.append("g").selectAll(".link"),
            node = svg.append("g").selectAll(".node");

        country = document.querySelector('#countrySelector').querySelector('.select__toggle').value
        year = document.querySelector('#yearSelector').querySelector('.select__toggle').value

        d3.json("https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/hierarchy;" + year + ";" + country + ".json", function(classes) {
            console.log("https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/hierarchy;" + year + ";" + country + ".json")

            // classes.forEach(d => console.log(d))

            var root = packageHierarchy(classes)
                .sum(function(d) { return d.size; });

            cluster(root);

            link = link
                .data(packageImports(root.leaves()))
                .enter().append("path")
                .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
                .attr("class", "link")
                .attr("d", line);

            node = node
                .data(root.leaves())
                .enter().append("text")
                .attr("class", "node")
                .attr("dy", "0.31em")
                .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
                .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                .text(function(d) { return d.data.key; });
        });

        // Lazily construct the package hierarchy from class names.
        function packageHierarchy(classes) {
            var map = {};

            function find(name, data) {
                var node = map[name],
                    i;
                if (!node) {
                    node = map[name] = data || { name: name, children: [] };
                    if (name.length) {
                        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
                        node.parent.children.push(node);
                        node.key = name.substring(i + 1);
                    }
                }
                return node;
            }

            classes.forEach(function(d) {
                find(d.name, d);
            });

            return d3.hierarchy(map[""]);
        }

        // Return a list of imports for the given array of nodes.
        function packageImports(nodes) {
            var map = {},
                imports = [];

            // Compute a map from name to node.
            nodes.forEach(function(d) {
                map[d.data.name] = d;
            });

            // For each import, construct a link from the source to target node.
            nodes.forEach(function(d) {
                if (d.data.imports) d.data.imports.forEach(function(i) {
                    try {
                        // console.log(i)
                        imports.push(map[d.data.name].path(map[i]));
                    } catch {}
                });
            });

            return imports;
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
        d3.select('#saveButtonhierarchy').on('click', function() {
            // console.log(d3.select('#bar_chart').select('svg'))
            var svgString = getSVGString(d3.select('#hierarchy').select('svg').node());

            svgString2Image(svgString, 2 * width, 2 * height, 'png', save); // passes Blob and filesize String to the callback

            function save(dataBlob, filesize) {
                saveAs(dataBlob, country + '_' + year + '_' + flow + '_' + category + '.png'); // FileSaver.js function
            }
        });



    }
    update()

    document.querySelector('#yearSelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update_bar_chart()
    });
}