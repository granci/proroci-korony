$(document).ready(function() {

  var countries = {
    sr: 'sk',
    cr: 'cz',
    us: 'en',
  }
  var queryParams = parseQueryString(window.location);
  var country = (countries[queryParams.country]) ? queryParams.country : 'sr';
  var selectedLang = (langs[queryParams.lang]) ? queryParams.lang : countries[country];

  // set up chart height
  $('.chart-container').height(window.innerHeight - $('.navbar').outerHeight());

  // select country based on URL query and internationalization:
  $('.nav-item#' + country).addClass('active');
  setIframeSrc(country, selectedLang, getFilter());
  setI18n();

  // allign langs right
  if ($('.navbar-toggler').css('display') == 'none') $('.navbar-right').addClass('right');
  else $('.navbar-right').removeClass('right');

  // change country
  $('.country').on('click',function(){
    $('.country').removeClass('active');
    $(this).addClass('active');
    country = $(this).attr('id');
    setIframeSrc(country, selectedLang, getFilter());
  });

  // change lang
  $('.lang').on('click',function(){
    selectedLang = $(this).attr('id');
    setI18n();
    setIframeSrc(country, selectedLang, getFilter());
  });

  // change filter
  $('input[name="filter"]').on('click',function(){
    setIframeSrc(country, selectedLang, getFilter());
  });

  function getFilter() {
    var filter = [];
    $('input[name="filter"]').each(function() {
      if (this.checked) filter.push(this.value);
    });
    return filter.join(',');
  };

  function setIframeSrc(country, lang, filter) {
    $('#chart').attr('src', 'chart/?country=' + country + '&lang=' + lang + '&filter=' + filter);
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

  function setI18n() {
    Object.keys(countries).forEach(key => {
      $('#' + key).text(langs[selectedLang].country[key]);
    });
    $('#langDropdown').text(langs[selectedLang].lang);
    ['polititian', 'scientist', 'doctor', 'other'].forEach(f => $('label[for=' + f + ']').text(langs[selectedLang].filter[f]));
  };

});
