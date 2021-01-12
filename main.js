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
  displayFilters();
  internationalize();
  setIframeSrc(country, selectedLang, '');

  // allign langs right
  if ($('.navbar-toggler').css('display') == 'none') $('.navbar-right').addClass('right');
  else $('.navbar-right').removeClass('right');

  // change country
  $('.country').on('click',function(){
    $('.country').removeClass('active');
    $(this).addClass('active');
    country = $(this).attr('id');
    displayFilters();
  });

  // change lang
  $('.lang').on('click',function(){
    selectedLang = $(this).attr('id');
    internationalize();
  });

  // refresh chart after change country, lang, search, filter, overlap
  ['.country', '.lang', 'input[name="filter"]', 'input[name="overlap"]'].forEach(btn => $(btn).on('click', function(){
    setIframeSrc(country, selectedLang, '');
  }));
  $('#submit').on('click', function(){
    setIframeSrc(country, selectedLang, $('#search').val());
  });
  // $('#search').keyup(function (e) {
  //   var searchStr = $('#search').val();
  //   console.log(searchStr);
  //   if (e.keyCode == 13) {
  //     setIframeSrc(country, selectedLang, searchStr);
  //     $('#search').val() = searchStr;
  //   }
  // });

  function setIframeSrc(country, lang, search) {
    $('#chart').attr('src', 'chart/?country=' + country + '&lang=' + lang + '&filter=' + getFilter() + '&search=' + search + '&overlap=' + $('#overlap').prop('checked').toString());
  };

  function getFilter() {
    var filter = [];
    $('input[name="filter"]').each(function() {
      if (this.checked) filter.push(this.value);
    });
    return filter.join(',');
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

  function displayFilters() {
    if (country === 'us') {
      $('.us-item').css('display', '');
      $('.non-us-item').css('display', 'none');
    }
    else {
      $('.us-item').css('display', 'none');
      $('.non-us-item').css('display', '');
    }
  }

  function internationalize() {
    Object.keys(countries).forEach(key => {
      $('#' + key).text(langs[selectedLang].country[key]);
    });
    $('#langDropdown').text(langs[selectedLang].lang);
    $('#search').attr('placeholder', langs[selectedLang].search);
    $('#submit').text(langs[selectedLang].submit);
    ['polititian', 'scientist', 'doctor', 'other', 'republican', 'democrat'].forEach(f => $('label[for=' + f + ']').text(langs[selectedLang].filter[f]));
    $('label[for=overlap]').text(langs[selectedLang].overlap);
  };

});
