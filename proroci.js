document.addEventListener('DOMContentLoaded', function () {
//$(document).ready(function() {

  var csvFile = 'korona.gov.sk.csv';

  var options = {
    chart: {
      // height: '100%',
      scrollablePlotArea: {
        minWidth: 700
      }
    },

    data: {
      // csvURL: 'https://mapa.covid.chat/export/csv',
      itemDelimiter: ';',
      beforeParse: function (csv) {
        return csv.replace(/\n\n/g, '\n');
      }
    },

    title: {
      text: 'Komentovaný denný vývoj pandámie Covid-19 na Slovensku'
    },

    subtitle: {
      text: 'Zdroj: mapa.covid.chat'
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
      verticalAlign: 'top',
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
        point: {
          events: {
            click: function (e) {
              hs.htmlExpand(null, {
                pageOrigin: {
                  x: e.pageX || e.clientX,
                  y: e.pageY || e.clientY
                },
                headingText: this.series.name,
                maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x),
                width: 200
              });
            }
          }
        },
        events: {
          legendItemClick: function () {
            var visibility = this.visible ? 'visible' : 'hidden';
          }
        },
        marker: {
          lineWidth: 1
        }
      }
    },

    // series: [{
    //   name: 'All sessions',
    //   lineWidth: 4,
    //   marker: {
    //     radius: 4
    //   }
    // }, {
    //   name: 'New users'
    // }]

  };

  $.get(csvFile, function(csvData) {
    options.data.csv = csvData;
    var chart = Highcharts.chart('container', options);
    chart.setSize(undefined, screen.height * 0.8);
  });


  

});
