$(document).ready(function() {

  var countries = {
    sr: 'sk',
    cr: 'cz',
    us: 'en',
  }
  var queryParams = parseQueryString(window.location);
  console.log(queryParams, countries[queryParams.country]);
  var country = (countries[queryParams.country]) ? queryParams.country : 'sr';
  // var selectedLang = countries[country];
  var selectedLang = (langs[queryParams.lang]) ? queryParams.lang : 'countries[country]';

  // set up internationalization:
  $('#sr').text(langs[selectedLang].country.sr);
  $('#cr').text(langs[selectedLang].country.cr);

  // set up chart height
  $('.chart-container').height(window.innerHeight - $('.navbar').outerHeight());

  // select country based on URL query:
  $('.nav-item#' + country).addClass('active');
  setIframeSrc(country);

  $('.nav-item').on('click',function(){
    $('.nav-item').removeClass('active');
    $(this).addClass('active');
    setIframeSrc($(this).attr('id')); 
  });  

  function setIframeSrc(country) {
    $('#chart').attr('src', 'chart/?country=' + country + '&lang=' + countries[country]);
  };

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
