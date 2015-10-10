/********************************************* 
  Thermometr Source Code
  -Josh Max
**********************************************/
var $elie = $('.den'),
    degree = 0,
    timer;
var api_key = '0d281734e91174e9';
var funclock = 0;
var opacity_counter = 0;

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

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
    var red = hexToRgb(color).r;
    var green = hexToRgb(color).g;
    var blue = hexToRgb(color).b;
    timer = setInterval(function () { // Functon is non-blocking, *sigh*
        funclock = 1; // Yay ponies, (and function locks)
        // ^Dammit who put this comment here?
        opacity_counter++;
        if (opacity_counter >= 10 && opacity_counter <= 50) { // Slowly fade in
            $('.' + leftright + ' .container').css({
                'background-color': 'rgba(' + red + ',' + green + ',' + blue + ',0.' + opacity_counter + ')'
            });
        } else if (opacity_counter > 50) {
            opacity_counter = 0; // Set counter to finished (0)
            clearInterval(timer); // Stop function
            funclock = 0; // Clear lock
            return;
        }
    }, 10);
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
    if (addrstr == "Rule 34") { // ?????
        putDegrees('left', 34);
        putDegrees('right', 34);
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
    if (funclock === 0) {
        funclock = 1;
        updateDegrees($("#leftform").val(), 'left');
    } else {
        console.log("LOCKED -- Waiting...");
    }
}

// Update right temperature
function updateRightTemp() {
    if (funclock === 0) {
        funclock = 1;
        updateDegrees($("#rightform").val(), 'right');
    } else {
        console.log("LOCKED -- Waiting...");
    }
}
