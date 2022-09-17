function categorySelector(data, flow) {

    function update(data, flow) {
        console.log('categorySelector', data.length, flow)

        var list = document.getElementById('categorySelectorBlock')
        try {
            while (list.firstChild) {
                list.removeChild(list.lastChild);
            }
        } catch {}
        il = document.createElement('div');
        il.id = 'categorySelector'
        list.appendChild(il)

        data = data.filter(d => d.rgDesc == flow)

        categories = []
        data.forEach(elem => categories.push(elem.cmdDescE))
        uniquecategories = new Set(categories)
        console.log(uniquecategories)

        categoriesList = []
        uniquecategories.forEach(elem => {
            c = []
            c.push(elem)
            c.push(elem)
            categoriesList.push(c)
        })

        categoryselector = new CustomSelect('#categorySelector', {
            name: categoriesList[0][1],
            targetValue: categoriesList[0][0],
            options: categoriesList,
        })
        bar_chart(data)

    }
    update(data, flow)

    document.querySelector('#flowsSelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update(data, btn.value)
    });



}

function flowsSelector(data, year) {

    function update(data, year) {
        console.log('flowsSelector', data.length, year)


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

        data = data.filter(d => d.yr == year)


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
        categorySelector(data, flowsList[0][0])

    }
    update(data, year)

    document.querySelector('#yearSelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update(data, btn.value)
    });
}


function yearSelector(data, country) {


    function update(data, country) {
        console.log('yearSelector', data.length, country)



        var list = document.getElementById('yearSelectorBlock')
        try {
            while (list.firstChild) {
                list.removeChild(list.lastChild);
            }
        } catch {}
        il = document.createElement('div');
        il.id = 'yearSelector'
        list.appendChild(il)


        data = data.filter(d => d.rtTitle == country)


        years = []
        data.forEach(elem => years.push(elem.yr))
        uniqueYears = new Set(years)
        console.log(uniqueYears)

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

        flowsSelector(data, yearsList[0][0])


    }
    update(data, country)


    document.querySelector('#countrySelector').addEventListener('select.change', (e) => {
        const btn = e.target.querySelector('.select__toggle');
        update(data, btn.value)
    });

}


function countrySelector() {

    d3.csv('/data/total_data.csv', function(data) {

        countries = []
        data.forEach(elem => countries.push(elem.rtTitle))
        uniquecountries = new Set(countries)
        console.log(uniquecountries)

        var countryList = []
        uniquecountries.forEach(elem => {
            cat = []
            cat.push(elem)
            cat.push(elem)
            countryList.push(cat)
        });

        console.log(countryList)

        countryselector = new CustomSelect('#countrySelector', {
            name: countryList[0][1],
            targetValue: countryList[0][0],
            options: countryList,
        })

        console.log('countrySelector', data.length)

        yearSelector(data, countryList[0][0])
    })


}
countrySelector()