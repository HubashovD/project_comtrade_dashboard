function map_chart() {


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
            width = 700 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;


        var mapsvg = d3.select("#map_chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Map and projection
        var projection = d3.geoMercator()
            .scale(85)
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
            data.forEach(function(row) {
                console.log(row)
                source = [+row.rtLon, +row.rtLat]
                target = [+row.ptLon, +row.ptLat]
                topush = { type: "LineString", coordinates: [source, target] }
                link.push(topush)
            })

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
                .attr("d", function(d) { return path(d) })
                .style("fill", "none")
                .style("stroke", "#69b3a2")
                .style("stroke-width", 2)

            var zoom = d3.zoom()
                .scaleExtent([1, 8])
                .on('zoom', function() {
                    map_g.selectAll('path')
                        .attr('transform', d3.event.transform);
                });

            mapsvg.call(zoom);

        }

    }

    update()

    document.querySelector('#categorySelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update()
    });


}