document.addEventListener('DOMContentLoaded', function () {
//$(document).ready(function() {

  var options = {
    chart: {
      scrollablePlotArea: {
        minWidth: 1000
      }
    },

    navigation: {
      buttonOptions: {
        enabled: false
      }
    },

    data: {
      // csvURL: 'https://mapa.covid.chat/export/csv',
      // itemDelimiter: ';',
      beforeParse: function (csv) {
        return csv.replace(/\n\n/g, '\n');
      }
    },

    caption: {
      useHTML: true,
    },

    xAxis: {
      tickInterval: 4 * 7 * 24 * 3600 * 1000, // one week
      // startOnTick: true,
      tickWidth: 0,
      gridLineWidth: 1,
      labels: {
        align: 'left',
        x: 3,
        y: 12,
        formatter: function () {
            return Highcharts.dateFormat('%b', this.value);
        }
      }
    },

    yAxis: [{ // left y axis
      title: {
        text: null
      },
      labels: {
        align: 'left',
        x: 3,
        y: 16,
        format: '{value:.,0f}'
      },
      showFirstLabel: false
    }, { // right y axis
      linkedTo: 0,
      gridLineWidth: 0,
      opposite: true,
      title: {
        text: null
      },
      labels: {
        align: 'right',
        x: -3,
        y: 16,
        format: '{value:.,0f}'
      },
      showFirstLabel: false
    }],

    legend: {
      align: 'left',
      verticalAlign: 'bottom',
      borderWidth: 0
    },

    tooltip: {
      shared: true,
      crosshairs: true
    },

    plotOptions: {
      series: {
        // showCheckbox: true,
        selected: true,
        // showInLegend: true,
        cursor: 'pointer',
        events: {
          legendItemClick: function () {
            var visibility = this.visible ? 'visible' : 'hidden';
          }
        },
        marker: {
          lineWidth: 1
        }
      }
    }
  };

  // start local server: sudo systemctl start apache2

  var countryDefs = {
    sr: {
      csv: 'data/korona.gov.sk.csv',  // https://korona.gov.sk/koronavirus-na-slovensku-v-cislach/ https://mapa.covid.chat/export/csv
      delimiter: ';'
    },
    cr: {
      csv: 'data/nakazeni-vyleceni-umrti-testy.csv',  // https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/nakazeni-vyleceni-umrti-testy.csv
      delimiter: ','
    },
    us: {
      csv: 'data/us.csv',  // https://raw.githubusercontent.com/nytimes/covid-19-data/master/us.csv
      delimiter: ','
    },  
  };
  var queryParams = parseQueryString(window.location);
  var country = (quotes[queryParams.country]) ? queryParams.country : 'sr';
  var lang = (langs[queryParams.lang]) ? queryParams.lang : 'sk';

  $.get(countryDefs[country].csv, function(csvData) {

    var parsedCsv = parseCsv(csvData, countryDefs[country].delimiter);
    var dailyCsv = addDaily(parsedCsv);
    var adjustedCsv = adjustCsvArr(dailyCsv, country, lang);

    options.data.csv = $.csv.fromArrays(adjustedCsv);
    options.data.itemDelimiter = ',';

    options.annotations = mkAnnos(sortQuotes(quotes[country]), arrayMaxVal(adjustedCsv), queryParams.filter);
    options.title = {
      text: langs[lang].title + ' (' + langs[lang].country[country] + ')'
    };
    options.caption.text = langs[lang].addRepo + ': <a href="https://github.com/granci/proroci-korony/" target="_blank">github.com/granci/proroci-korony</a>'

    var chart = Highcharts.chart('container', options);
    chart.setSize(undefined, window.innerHeight || document.documentElement.clientHeight);

  });

  function sortQuotes(quotes) {
    return quotes.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  function mkAnnos(quotes, maxVal, filteredTags) {
    var annos = [];
    var colors = {
      doctor: '102, 204, 255',
      scientist: '255, 230, 179',
      polititian: '255, 204, 204',
      republican: '255,173,175',
      democrat: '153,161,228',
      publicist: '140, 217, 140',
      conspirator: '173, 235, 173',
      artist: '221, 153, 255',
      other: '200, 200, 200',
    };
    // get approximate height of the annotation buble in chart values:
    var intervalHeight = 120 / (window.innerHeight || document.documentElement.clientHeight) * maxVal;
    var numYintervals = Math.floor(maxVal / intervalHeight);
    // console.log(numYintervals, maxVal);
    var yInterval = 0;
    quotes.forEach(q => {
      // if (!q.tag || Object.keys(colors).indexOf(q.tag) === -1) q.tag = 'other';
      if (!filteredTags || filteredTags.includes(q.tag) || filteredTags === q.tag) {
        if (yInterval === numYintervals + 1) yInterval = 0;
        var timestamp = new Date(q.date);
        // var yAnchor = Math.random() * maxVal;
        var yAnchor = intervalHeight * yInterval;
        yInterval += 1;
        var anno = {
          zIndex: yInterval + 5,
          events: {
            click: function(e) { 
              console.log("Annotation clicked:", this); 
              // this.options.labels[0].backgroundColor = colors[q.tag] ? 'rgb(' + colors[q.tag] + ')' : 'rgb(' + colors.other + ')';
            }
          },
          labelOptions: {
            verticalAlign: 'bottom',
            y: -15,
            useHTML: true,
            allowOverlap: true,
            overflow: 'justify',
            accessibility: {
              description: '"' + q.quote + '" - ' + q.name
            },
            // shape: 'connector',
            // align: 'right',
          },
          labels: [
            {
              point: {
                xAxis: 0,
                yAxis: 0,
                x: timestamp,
                y: yAnchor
              },
              // backgroundColor: 'rgba(' + colors[q.tag] + ', 0.7)',
              backgroundColor: colors[q.tag] ? 'rgba(' + colors[q.tag] + ', 0.7)' : 'rgba(' + colors.other + ', 0.7)',
              // borderColor: colors[q.tag] ? 'rgb(' + colors[q.tag] + ')' : 'rgba(' + colors.other + ')',
              text: '<div style="width: 150px; white-space: normal">"' + q.quote + '"</br><a href="' + q.link + '" target="_blank">- ' + q.name + '</a></div>'
            }
          ]
        };
        annos.push(anno);
      }
    });
    return annos;
  };

  function parseCsv (csvString, delimiter) {
    var csvArr = $.csv.toArrays(csvString, {separator: delimiter});
    var numArr = csvArr.map(x => x.map(y => {
      if (!Number.isNaN(+y)) return +y;
      else return y;
    }));
    return numArr;
  }

  function addDaily(csvArr) {
    for (i = 0; i < csvArr.length; i++) {
      csvArr[i].forEach((val, j) => {
        if (j > 0) {
          if (i === 0 && j > 0) csvArr[i].push(val + '_daily');
          else if (i === 1 && j > 0) csvArr[i].push(val);
          else csvArr[i].push(csvArr[i][j] - csvArr[i-1][j]);
        }
      });
    }
    return csvArr;
  }

  function adjustCsvArr(csvArr, country, lang) {
    var skipColumns = [1, 2];
    var columns = {
      cases: { sr: 5, cr: 5, us: 3 },
      daths: { sr: 6, cr: 3, us: 2 }
    }
    var filtered = csvArr.map(x => x.filter((y, i, arr) => (i === 0 || i === columns.cases[country] || i === columns.daths[country])));
    if (country === 'sr') filtered = filtered.map(x => ([x[0], x[1], x[2]] = [x[0], x[2], x[1]]));
    filtered[0][1] = langs[lang].series.deaths;
    filtered[0][2] = langs[lang].series.cases;
    return filtered;
  }

  function arrayMaxVal(csvArr) {
    var numArr = [].concat.apply([], csvArr).map(x => +x).filter(y => !Number.isNaN(y)); // converts 2d array to 1d numeric array
    return Math.max(... numArr);
  }

  function csvMaxVal(csvString, delimiter, endColumn) {
    var csvArr = $.csv.toArrays(csvString, {separator: delimiter});
    // console.log([].concat.apply([], csvArr.map(z => z.slice(0, z.length-1))));
    var numArr = [].concat.apply([], csvArr.map(z => z.slice(0, z.length-1))).map(x => +x).filter(y => !Number.isNaN(y)); // converts 2d array to 1d numeric array
    return Math.max(... numArr);
  }

  function parseQueryString(url) {
    var params = {}, queries, temp, i, l;

    // Split into key/value pairs
    queries = url.search.substring(1).split("&");

    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        if (queries[i].indexOf('=') > -1) {
          temp = queries[i].split('=');
          params[temp[0]] = (temp[1].indexOf(',') > -1) ? temp[1].split(',') : temp[1];
        }
    }

    return params;

  };

});
