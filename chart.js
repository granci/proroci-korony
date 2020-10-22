document.addEventListener('DOMContentLoaded', function () {
//$(document).ready(function() {

  var options = {
    chart: {
      // height: '100%',
      scrollablePlotArea: {
        minWidth: 700
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
      tickInterval: 7 * 24 * 3600 * 1000, // one week
      tickWidth: 0,
      gridLineWidth: 1,
      labels: {
        align: 'left',
        x: 3,
        y: -3
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

  var countryDefs = {
    sr: {
      csv: 'korona.gov.sk.csv',  // https://mapa.covid.chat/export/csv
      delimiter: ';'
    },
    cr: {
      csv: 'nakazeni-vyleceni-umrti-testy.csv',  // https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/nakazeni-vyleceni-umrti-testy.csv
      delimiter: ','
    },  
  };
  var queryParams = parseQueryString(window.location);
  var country = (quotes[queryParams.country]) ? queryParams.country : 'sr';
  var lang = (langs[queryParams.lang]) ? queryParams.lang : 'sk';
  var endColumn = (country === 'cr') ? 3 : undefined;

  $.get(countryDefs[country].csv, function(csvData) {

    options.data.csv = csvData;
    options.data.itemDelimiter = countryDefs[country].delimiter;
    options.data.endColumn = endColumn;

    // console.log(quotes, quotes[country]);
    options.annotations = mkAnnos(quotes[country], csvMaxVal(csvData, countryDefs[country].delimiter, endColumn), queryParams.filter);
    options.title = {
      text: langs[lang].title + ' (' + langs[lang].country[country] + ')'
    };
    options.caption.text = langs[lang].addRepo + ': <a href="https://github.com/granci/proroci-korony/" target="_blank">github.com/granci/proroci-korony</a>'

    var chart = Highcharts.chart('container', options);
    // console.log(window.innerHeight, document.documentElement.clientHeight);
    chart.setSize(undefined, window.innerHeight || document.documentElement.clientHeight);

  });

  function mkAnnos(quotes, maxVal, allowedTags) {
    var annos = [];
    var colors = {
      scientist: '255, 204, 204',
      doctor: '255, 230, 179',
      polititian: '102, 204, 255',
      publicist: '230, 230, 0',
      influencer: '173, 235, 173',
      artist: '221, 153, 255',
      other: '200, 200, 200',
    };
    quotes.forEach(q => {
      if (!allowedTags || allowedTags.includes(q.tag) || allowedTags === q.tag) {
        var timestamp = new Date(q.date);
        var yAnchor = 5000 + Math.random() * (maxVal - 5000);
        // console.log(Date.parse(timestamp), q.date, colors[q.tag]);
        var anno = {
          labelOptions: {
            verticalAlign: 'bottom',
            y: -15,
            useHTML: true,
            allowOverlap: true,
            overflow: 'justify',
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
        temp = queries[i].split('=');
        params[temp[0]] = (temp[1].indexOf(',') > -1) ? temp[1].split(',') : temp[1];
    }

    return params;
  };

});
