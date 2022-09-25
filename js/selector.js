function categorySelector(country, year, flow) {

    function update(country, year, flow) {


        var list = document.getElementById('categorySelectorBlock')
        try {
            while (list.firstChild) {
                list.removeChild(list.lastChild);
            }
        } catch {}
        il = document.createElement('div');
        il.id = 'categorySelector'
        list.appendChild(il)

        d3.csv('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/countries_years.csv', function(data) {
            data = data.filter(d => d.rtTitle == country)
            data = data.filter(d => d.yr == year)
            data = data.filter(d => d.rgDesc == flow)

            console.log('categorySelector', data.length, country, year, flow)

            categoriesList = []
            data.forEach(function(d) {
                catrgory = []

                catrgory.push(d.cmdCode)
                catrgory.push(d.cmdDescE)
                categoriesList.push(catrgory)
            })

            categoryselector = new CustomSelect('#categorySelector', {
                name: categoriesList[0][1],
                targetValue: categoriesList[0][0],
                options: categoriesList,
            })

            bar_chart()
            map_chart()
            line_chart()
            scatterChart()
            hierarchy()
            sankey_chart()
            PieChart()
        })

    }
    update(country, year, flow)

    document.querySelector('#flowsSelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update(country, year, btn.value)
    });

}

function flowsSelector(country, year) {

    function update(country, year) {


        var list = document.getElementById('flowsSelectorBlock')
        try {
            while (list.firstChild) {
                list.removeChild(list.lastChild);
            }
        } catch {}
        il = document.createElement('div');
        il.id = 'flowsSelector'
        list.appendChild(il)


        // rgDesc

        d3.csv('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/countries_years.csv', function(data) {
            data = data.filter(d => d.rtTitle == country)
            data = data.filter(d => d.yr == year)
            console.log('flowsSelector', data.length, country, year)

            flows = []
            data.forEach(elem => flows.push(elem.rgDesc))
            uniqueflows = new Set(flows)
            console.log(uniqueflows)

            flowsList = []
            uniqueflows.forEach(elem => {
                f = []
                f.push(elem)
                f.push(elem)
                flowsList.push(f)
            })

            flowsselector = new CustomSelect('#flowsSelector', {
                name: flowsList[0][1],
                targetValue: flowsList[0][0],
                options: flowsList,
            })
            categorySelector(country, year, flowsList[0][0])
        })

    }
    update(country, year)

    document.querySelector('#yearSelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update(country, btn.value)
    });
}


function yearSelector(country) {


    function update(country) {


        var list = document.getElementById('yearSelectorBlock')
        try {
            while (list.firstChild) {
                list.removeChild(list.lastChild);
            }
        } catch {}
        il = document.createElement('div');
        il.id = 'yearSelector'
        list.appendChild(il)

        d3.csv('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/countries_years.csv', function(data) {
            data = data.filter(d => d.rtTitle == country)
            console.log('yearSelector', data.length, country)

            years = []
            data.forEach(elem => years.push(elem.yr))
            uniqueYears = new Set(years)

            yearsList = []
            uniqueYears.forEach(elem => {
                y = []
                y.push(elem)
                y.push(elem)
                yearsList.push(y)
            })

            yearselector = new CustomSelect('#yearSelector', {
                name: yearsList[0][1],
                targetValue: yearsList[0][0],
                options: yearsList,
            })

            flowsSelector(country, yearsList[0][0])
        })


    }
    update(country)


    document.querySelector('#countrySelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update(btn.value)
    });

}


function countrySelector() {

    d3.csv('https://raw.githubusercontent.com/HubashovD/project_comtrade_dashboard/main/data/rtList.csv', function(data) {

        var countryList = []
        data.forEach(elem => {
            cat = []
            cat.push(elem.rtTitle)
            cat.push(elem.rtTitle)
            countryList.push(cat)
        });

        console.log('countrySelector')

        countryList = countryList.sort(function(b, a) {
            return b - a
        });

        countryselector = new CustomSelect('#countrySelector', {
            name: countryList[0][1],
            targetValue: countryList[0][0],
            options: countryList,
        })

        yearSelector(countryList[0][0])
    })


}
countrySelector()