/********************************************* 
  Thermometr Source Code
  -Josh Max
**********************************************/
var $elie = $('.den'),
    degree = 0,
    timer;
var api_key = '0d281734e91174e9';

  $.backstretch([
      "http://db.tt/Ls70GJc8",
      "http://db.tt/Bjow1L0I",
      "http://db.tt/RUwG7CH8"
  ], {duration: 3000, fade: 1500});
  $(".backstretch").fadeToggle(600);

function changeBackground(leftright, temp_f) {
  var color = '#777777';
  if (temp_f <= 32) {
    color = '#6291BD';    
  } else if (temp_f <= 48) {
    color = '#AAC2A0';
  } else if (temp_f <= 64) {
    color = '#93D160';
  } else if (temp_f <= 80) {
    color = '#FF9500';
  } else {
    color = '#D61E1E';
  }
  $('.' + leftright + ' .container').css({'background-color':color});
  //$('.' + leftright + ' .bg-container').animate({
    //opacity: 1
  //}, 1000);
}

// Put degree elements on DOM
function putDegrees(rightleft, tempfaren) {
    $('.' + rightleft + ' .deneme').html(tempfaren + '&deg;');
}

// Fetch & update degrees for lat/lon location
function fetchDegreesLatLon(lat, lon, rightleft) {
    $.ajax({
        url: 'http://api.wunderground.com/api/' + api_key + '/conditions/q/' + lat + ',' + lon + '.json',
        dataType: "jsonp",
        success: function (parsed_json) {
            putDegrees(rightleft, Math.floor(parsed_json.current_observation.temp_f));
            changeBackground(rightleft, Math.floor(parsed_json.current_observation.temp_f));
        }
    });
}

function updateDegrees(addrstr, rightleft) {
    if (addrstr == "Your Mom") { // ?????
        putDegrees('left', 69.69);
        putDegrees('right', 69.69);
        return;
    }
    $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + addrstr,
        function (data) { // Get latitude and longitude from query
            var lat = data.results[0].geometry.location.lat;
            var lon = data.results[0].geometry.location.lng;
            fetchDegreesLatLon(lat, lon, rightleft);
    });
}

// Update left temperature
function updateLeftTemp() {
    updateDegrees($("#leftform").val(), 'left');
}

// Update right temperature
function updateRightTemp() {
    updateDegrees($("#rightform").val(), 'right');
}