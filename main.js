$(document).ready(function() {

  var countries = {
    sr: 'sk',
    cr: 'cz'
  }
  var queryParams = parseQueryString(window.location);
  // console.log(countries[queryParams.country]);
  var country = (countries[queryParams.country]) ? queryParams.country : 'sr';
  var selectedLang = 'sk';

  // set up internationalization:
  $('#sr').text(langs[selectedLang].country.sr);
  $('#cr').text(langs[selectedLang].country.cr);

  // set up chart height
  $('.chart-container').height(window.innerHeight - $('.navbar').outerHeight());

  // select country based on URL query:
  $('.nav-item#' + country).addClass('active');
  setIframeSrc($('.nav-item.active').attr('id'));
  // setIframeSrc(country);

  $('.nav-item').on('click',function(){
    $('.nav-item').removeClass('active');
    $(this).addClass('active');
    setIframeSrc($(this).attr('id')); 
  });  

  function setIframeSrc(country) {
    // var countries = {
    //   sr: 'sk',
    //   cr: 'cz'
    // }
    $('#chart').attr('src', 'chart.html?country=' + country + '&lang=' + countries[country]);
  };

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
