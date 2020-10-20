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
      text: 'Chýba ti tvoj obľúbeny výrok? <a href="https://github.com/granci/proroci-korony/blob/main/quotes.js" target="_blank">Doplň ho!</a>'
    },

    caption: {
      useHTML: true,
      text: 'Zdroj dát: <a href="https://mapa.covid.chat/" target="_blank">mapa.covid.chat</a>'
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
        // point: {
        //   events: {
        //     click: function (e) {
        //       hs.htmlExpand(null, {
        //         pageOrigin: {
        //           x: e.pageX || e.clientX,
        //           y: e.pageY || e.clientY
        //         },
        //         headingText: this.series.name,
        //         maincontentText: this.x,
        //         width: 200
        //       });
        //     }
        //   }
        // },
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

  function mkAnnos(quotes) {
    var annos = [];
    var colors = {
      vedec: 'rgba(255, 204, 204, 0.75)',
      politik: 'rgba(102, 204, 255, 0.75)',
      konspirator: 'rgba(173, 235, 173, 0.75)',
      influencer: 'rgba(221, 153, 255, 0.75)',
    };
    quotes.forEach(q => {
      var anno = {
        labelOptions: {
          verticalAlign: 'bottom',
          y: -15,
          useHTML: true,
        },
        labels: [
          {
            point: {
              xAxis: 0,
              yAxis: 0,
              x: new Date(q.date),
              y: 5000 + Math.random() * 10000
            },
            backgroundColor: colors[q.tag] ? colors[q.tag] : 'rgba(200, 200, 200, 0.75)',
            // overflow: 'justify',
            // className: 'label',
            text: '<div style="width: 150px; white-space: normal">"' + q.quote + '"</br><a href="' + q.link + '" target="_blank">- ' + q.name + '</a></div>'
          }
        ]
      };
      annos.push(anno);
    });
    return annos;
  };

  $.get(csvFile, function(csvData) {

    options.data.csv = csvData;
    options.annotations = mkAnnos(quotes);

    var chart = Highcharts.chart('container', options);

    chart.setSize(undefined, screen.height * 0.8);

  });


  

});
