(function run() {
    var targetNode = document.querySelector('#table-wrapper');
    var data = getData('people');

    drawTable(targetNode, data, getData('add_columns'), callback);
    drawTable(targetNode, getAverageLifetimeList(data));
    drawTable(targetNode, getMotherChildrenComparedAgesList(data));

 //   drawTable(targetNode, getMotherChildrenComparedAgesList_worse(data));
})();


function drawTable(target, dataArray, additionalColumns, callback) {
    var table = document.createElement('table');

    if (dataArray.length > 0) {
        makeTableHeader(table, dataArray[0], additionalColumns);
    } else return;

    dataArray.forEach(function (obj) {
        var rowsCount = table.getElementsByTagName('tr').length;
        var newRow = table.insertRow(rowsCount);
        Object.values(obj).concat(additionalColumns || []).forEach(function (value, index) {
            newRow.insertCell(index).innerHTML = index < Object.keys(obj).length
                ? value
                : callback && callback(value, obj) || 'err';
        });
    });

    target.appendChild(table);

    function makeTableHeader(table, obj, otherCols) {
        var row = table.insertRow(0);

        Object.keys(obj).concat(otherCols || []).forEach(function(key, i) {
            row.insertCell(i).innerHTML = '<b>' + key.toUpperCase() + '</b>';
        });
    }
}

function delRow(elem) {
    var row = elem.parentNode.parentNode;
    var table = row.parentNode;
    table.deleteRow(row.rowIndex);
}

function callback(column, obj) {
    var columns = getData('add_columns');
    switch(column.toLowerCase()) {
        case columns[0]:
            return getAge(obj);
        case columns[1]:
            return '<img src="icons/delete.svg" width="20px" style="cursor: pointer" onclick="delRow(this)">';
    }
}


function getAverageLifetimeList(data) {
    var transformedData = {};
    data.forEach(function (item) {
        var century = getCentury(item);
        if (!transformedData[century]) transformedData[century] = [];

        transformedData[century].push(getAge(item));
    });
    
    var resultArray = [];
    Object.keys(transformedData).forEach(function (key) {
        var agesArr = transformedData[key];
        resultArray.push({
            'century': key,
            'life-time': agesArr.length === 0
                ? 'N/A'
                : Math.round(agesArr.reduce(function(sum, current) {return sum + current}, 0) * 100 / agesArr.length) / 100
        });
    });
    function getCentury(item) {
        var centuryBorn = Math.trunc(item.born / 100) * 100;
        var centuryDied = Math.trunc(item.died / 100) * 100;
        return (centuryDied - item.born > item.died - centuryDied)
            ? centuryBorn + ' - ' + centuryDied
            : centuryDied + ' - ' + (centuryDied + 100);
    }

    // return resultArray.sort(function(b, a){return b['life-time'] - a['life-time']});
    return resultArray.sort(function(a, b){return b['century'] < a['century']});
}


function getMotherChildrenComparedAgesList(data) {
    var women = {};
    data.forEach(function (item) { (item.sex === 'f') && (women[item.name] = {'age': getAge(item)}) });

    var withMother = data.filter(function (item) {return Object.keys(women).includes(item.mother)});

    var resultArr = [];
    withMother.forEach(function (item) {
        var itemAge = getAge(item);
        var itemsMotherAge = women[item.mother].age;
        resultArr.push({
            'name': item.name,
            'age': itemAge,
            'mother': item.mother,
            'mothers-age': itemsMotherAge,
            'age-difference': Math.abs(itemsMotherAge - itemAge)
        });
    });
   return resultArr;
}

function getMotherChildrenComparedAgesList_worse(data) {
    var womenList = data.filter(function (item) {return item.sex === 'f'}).map(function (item) {return item.name});
    var withMother = data.filter(function (item) {return womenList.includes(item.mother)});

    var resultArr = [];
    withMother.forEach(function (item) {
        var itemsMother = data.filter(function (obj) {return obj.name === item.mother})[0];
        var itemAge = getAge(item);
        var itemsMotherAge = getAge(itemsMother);
        resultArr.push({
            'name': item.name,
            'age': itemAge,
            'mother': item.mother,
            'mothers-age': itemsMotherAge,
            'age-difference': Math.abs(itemsMotherAge - itemAge)
        });
    });
    return resultArr;
}


function getAge(item) {
    return item.died - item.born;
}

function getData(key) {
    var data = {
        people: [
            { "name": "Carolus Haverbeke", "sex": "m", "born": 1832, "died": 1905, "father": "Carel Haverbeke", "mother": "Maria van Brussel" },
            { "name": "Emma de Milliano", "sex": "f", "born": 1876, "died": 1956, "father": "Petrus de Milliano", "mother": "Sophia van Damme" },
            { "name": "Maria de Rycke", "sex": "f", "born": 1683, "died": 1724, "father": "Frederik de Rycke", "mother": "Laurentia van Vlaenderen" },
            { "name": "Jan van Brussel", "sex": "m", "born": 1714, "died": 1748, "father": "Jacobus van Brussel", "mother": "Joanna van Rooten" },
            { "name": "Philibert Haverbeke", "sex": "m", "born": 1907, "died": 1997, "father": "Emile Haverbeke", "mother": "Emma de Milliano" },
            { "name": "Jan Frans van Brussel", "sex": "m", "born": 1761, "died": 1833, "father": "Jacobus Bernardus van Brussel", "mother": null },
            { "name": "Pauwels van Haverbeke", "sex": "m", "born": 1535, "died": 1582, "father": "N. van Haverbeke", "mother": null },
            { "name": "Clara Aernoudts", "sex": "f", "born": 1918, "died": 2012, "father": "Henry Aernoudts", "mother": "Sidonie Coene" },
            { "name": "Emile Haverbeke", "sex": "m", "born": 1877, "died": 1968, "father": "Carolus Haverbeke", "mother": "Maria Sturm" },
            { "name": "Lieven de Causmaecker", "sex": "m", "born": 1696, "died": 1724, "father": "Carel de Causmaecker", "mother": "Joanna Claes" },
            { "name": "Pieter Haverbeke", "sex": "m", "born": 1602, "died": 1642, "father": "Lieven van Haverbeke", "mother": null },
            { "name": "Livina Haverbeke", "sex": "f", "born": 1692, "died": 1743, "father": "Daniel Haverbeke", "mother": "Joanna de Pape" },
            { "name": "Pieter Bernard Haverbeke", "sex": "m", "born": 1695, "died": 1762, "father": "Willem Haverbeke", "mother": "Petronella Wauters" },
            { "name": "Lieven van Haverbeke", "sex": "m", "born": 1570, "died": 1636, "father": "Pauwels van Haverbeke", "mother": "Lievijne Jans" },
            { "name": "Joanna de Causmaecker", "sex": "f", "born": 1762, "died": 1807, "father": "Bernardus de Causmaecker", "mother": null },
            { "name": "Willem Haverbeke", "sex": "m", "born": 1668, "died": 1731, "father": "Lieven Haverbeke", "mother": "Elisabeth Hercke" },
            { "name": "Pieter Antone Haverbeke", "sex": "m", "born": 1753, "died": 1798, "father": "Jan Francies Haverbeke", "mother": "Petronella de Decker" },
            { "name": "Maria van Brussel", "sex": "f", "born": 1801, "died": 1834, "father": "Jan Frans van Brussel", "mother": "Joanna de Causmaecker" },
            { "name": "Angela Haverbeke", "sex": "f", "born": 1728, "died": 1734, "father": "Pieter Bernard Haverbeke", "mother": "Livina de Vrieze" },
            { "name": "Elisabeth Haverbeke", "sex": "f", "born": 1711, "died": 1754, "father": "Jan Haverbeke", "mother": "Maria de Rycke" },
            { "name": "Lievijne Jans", "sex": "f", "born": 1542, "died": 1582, "father": null, "mother": null },
            { "name": "Bernardus de Causmaecker", "sex": "m", "born": 1721, "died": 1789, "father": "Lieven de Causmaecker", "mother": "Livina Haverbeke" },
            { "name": "Jacoba Lammens", "sex": "f", "born": 1699, "died": 1740, "father": "Lieven Lammens", "mother": "Livina de Vrieze" },
            { "name": "Pieter de Decker", "sex": "m", "born": 1705, "died": 1780, "father": "Joos de Decker", "mother": "Petronella van de Steene" },
            { "name": "Joanna de Pape", "sex": "f", "born": 1654, "died": 1723, "father": "Vincent de Pape", "mother": "Petronella Wauters" },
            { "name": "Daniel Haverbeke", "sex": "m", "born": 1652, "died": 1723, "father": "Lieven Haverbeke", "mother": "Elisabeth Hercke" },
            { "name": "Lieven Haverbeke", "sex": "m", "born": 1631, "died": 1676, "father": "Pieter Haverbeke", "mother": "Anna van Hecke" },
            { "name": "Martina de Pape", "sex": "f", "born": 1666, "died": 1727, "father": "Vincent de Pape", "mother": "Petronella Wauters" },
            { "name": "Jan Francies Haverbeke", "sex": "m", "born": 1725, "died": 1779, "father": "Pieter Bernard Haverbeke", "mother": "Livina de Vrieze" },
            { "name": "Maria Haverbeke", "sex": "m", "born": 1905, "died": 1997, "father": "Emile Haverbeke", "mother": "Emma de Milliano" },
            { "name": "Petronella de Decker", "sex": "f", "born": 1731, "died": 1781, "father": "Pieter de Decker", "mother": "Livina Haverbeke" },
            { "name": "Livina Sierens", "sex": "f", "born": 1761, "died": 1826, "father": "Jan Sierens", "mother": "Maria van Waes" },
            { "name": "Laurentia Haverbeke", "sex": "f", "born": 1710, "died": 1786, "father": "Jan Haverbeke", "mother": "Maria de Rycke" },
            { "name": "Carel Haverbeke", "sex": "m", "born": 1796, "died": 1837, "father": "Pieter Antone Haverbeke", "mother": "Livina Sierens" },
            { "name": "Elisabeth Hercke", "sex": "f", "born": 1632, "died": 1674, "father": "Willem Hercke", "mother": "Margriet de Brabander" },
            { "name": "Jan Haverbeke", "sex": "m", "born": 1671, "died": 1731, "father": "Lieven Haverbeke", "mother": "Elisabeth Hercke" },
            { "name": "Anna van Hecke", "sex": "f", "born": 1607, "died": 1670, "father": "Paschasius van Hecke", "mother": "Martijntken Beelaert" },
            { "name": "Maria Sturm", "sex": "f", "born": 1835, "died": 1917, "father": "Charles Sturm", "mother": "Seraphina Spelier" },
            { "name": "Jacobus Bernardus van Brussel", "sex": "m", "born": 1736, "died": 1809, "father": "Jan van Brussel", "mother": "Elisabeth Haverbeke" }
        ],
        add_columns: ['age', ' ']
    };
    return data[key];
}
