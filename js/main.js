/*********************************************
  Thermometr Source Code
  -Josh Max
**********************************************/
var $elie = $('.den'),
    degree = 0,
    timer;
var api_key = 'b849ad91010388ed464b4ef7bde5b448';
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
            $('.' + leftright).css({
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

// Fetch & update degrees for zip location
function fetchDegreesLatLon(zip, rightleft) {
    $.ajax({
        url: 'https://api.openweathermap.org/data/2.5/weather?zip=' + zip + ',us&APPID=' + api_key,
        dataType: "jsonp",
        success: function (parsed_json) {
            //Kelvin to Fahrenheit
            function temp() {
              k = Math.floor(parsed_json.main.temp);
              f = (k * 9 / 5) - 459.67;
              return Math.round(f, 2);;
            }
            c_temp = temp();
            putDegrees(rightleft, c_temp);
            changeBackground(rightleft, c_temp);
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
    fetchDegreesLatLon(addrstr, rightleft);
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
