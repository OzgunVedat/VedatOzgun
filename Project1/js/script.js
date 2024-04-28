$('body').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');
$(window).on('load', function(){
  setTimeout(removeLoader, 200); //wait for page load PLUS two seconds.
});
function removeLoader(){
    $( "#loadingDiv" ).fadeOut(500, function() {
      // fadeOut complete. Remove the loading div
      $( "#loadingDiv" ).remove(); //makes page more lightweight 
  });  
}
var streets = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
    }
);

var satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    }
);
var basemaps = {
    "Streets": streets,
    "Satellite": satellite
};

var map = L.map("map", {
    layers: [streets]
}).setView([54.5, -4], 6);

var country_iso_a3 = "";
var countryOptionText = "";
var exchangerateResult = "";
var capitalCity = "";

L.easyButton("fa-info", function(btn, map) {
    $("#infoModal").modal("show");
    getRestcountries(country_iso_a3);
}).addTo(map);

L.easyButton( '<B><i class="material-icons" style="font-size:15px;">W</i></B>', function(){
    $("#wikiModal").modal("show");
    getwiki(countryOptionText.split(' ', 2).join("_"));
  }).addTo(map);

  L.easyButton( 'fa-money-bill', function(){
    $("#currencyModal").modal("show");
    getRestcountries(country_iso_a3);
  }).addTo(map);
  

  L.easyButton( 'fa-cloud', function(){
    $("#capitalWeatherModal").modal("show");
    getWeather(capitalCity);
  }).addTo(map);
  
  L.easyButton( 'fa-flag', function(){
    $("#flagModal").modal("show");
    getRestcountries(country_iso_a3);
  }).addTo(map);




const options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0,
  };
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

$.ajax({
    url: "./php/getCountryNames.php",
    type: 'POST',
    dataType: "json",

    success: function(result) {
        if (result.status.name == "ok") {
            for (var i = 0; i < result.data.border.features.length; i++) {
                $('#selCountry').append($('<option>', {
                    value: result.data.border.features[i].properties.iso_a2,
                    text: result.data.border.features[i].properties.name,
                }));
            }
            //sort options alphabetically
            $("#selCountry").html($("#selCountry option").sort(function(a, b) {
                return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
            }))
            navigator.geolocation.getCurrentPosition(showPosition, error, options);
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    }
});

let border;



$("#selCountry").on("change", function() {
    countryOptionText = $("#selCountry").find("option:selected").text();
    $.ajax({
        url: "./php/getCountryNames.php",
        type: "POST",
        dataType: 'json',
        success: function(result) {
            if (map.hasLayer(border)) {
                map.removeLayer(border);
            }

            let countryOptionTextArray = [];

            for (let i = 0; i < result.data.border.features.length; i++) {
                if (result.data.border.features[i].properties.name === countryOptionText) {
					country_iso_a3 = result.data.border.features[i].properties.iso_a3;
                    countryOptionTextArray.push(result.data.border.features[i]);
                    resetDetails();
                    getCities(result.data.border.features[i].properties.iso_a2);
                    getAirports(result.data.border.features[i].properties.iso_a2)
                }
            };

            border = L.geoJSON(countryOptionTextArray[0], {
                color: "lime",
                weight: 3,
                opacity: 0.75
            }).addTo(map);
            let bounds = border.getBounds();
            map.flyToBounds(bounds, {
                padding: [35, 35],
                duration: 2,
            });

        },
        error: function(jqXHR, textStatus, errorThrown) {
            consologe.log(textStatus, errorThrown);
        }
    });
});

function showPosition(position) {

    $.ajax({

        url: './php/getCountryCode.php',

        dataType: 'JSON',

        data: {
            'lat': position.coords.latitude,

            'lng': position.coords.longitude

        },

        method: 'GET',

        success: function(result) {

            $('#selCountry').val(result.data.countryCode).change();

        },
        error: function(jqXHR, textStatus, errorThrown) {
            consologe.log(textStatus, errorThrown);
        }

    })

}


var cityList = [];
var airportList = [];
var airports = L.markerClusterGroup({
    polygonOptions: {
      fillColor: "#fff",
      color: "#000",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5
    }
  });

  var cities = L.markerClusterGroup({
    polygonOptions: {
      fillColor: "#fff",
      color: "#000",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5
    }
  });
  var overlays = {
    Airports: airports,
    Cities: cities
  };
  
airports.addTo(map);
cities.addTo(map);

L.control.layers(basemaps, overlays).addTo(map);
  var airportIcon = L.ExtraMarkers.icon({
    prefix: "fa",
    icon: "fa-plane",
    iconColor: "black",
    markerColor: "white",
    shape: "square"
  });

  var cityIcon = L.ExtraMarkers.icon({
    prefix: "fa",
    icon: "fa-city",
    markerColor: "green",
    shape: "square"
  });

  function getAirports(countryCode) {
    let j = 0;
    let airport = undefined;
    $.ajax({

        url: './php/getAirports.php',

        dataType: 'JSON',

        data: {
            'countryCode': countryCode
        },

        method: 'GET',

        success: function(result) {
            if(result && result.data && result.data.length > 0){
            while (j < result.data.length) {
                airport =L.marker([result.data[j].latitude, result.data[j].longitude], {
                        icon: airportIcon
                    }).bindTooltip(result.data[j].name, { direction: "top", sticky: true });
                airports.addLayer(airport);
                airportList.push(airport);
                j++;
            }
        }
            map.addLayer(airports);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }

    })
  } 

  function getCities(codeA2) {
    $.ajax({
      url: "./php/getCities.php",
      dataType: "json",
      data: {
        country: codeA2
      },
      method: 'GET',
      success: function (result) {
        if (result.status.code == 200) {
            result.data.forEach(function (item) {
                if(item.fcode == "PPLC")
                    capitalCity = item.name; 
                var city = L.marker([item.lat, item.lng], { icon: cityIcon })
                  .bindTooltip(
                    "<div class='col text-center'><strong>" +
                      item.name +
                      "</strong><br><i>(" +
                      new Intl.NumberFormat().format(item.population) +
                      ")</i></div>",
                    { direction: "top", sticky: true }
                  )
                  cities.addLayer(city);
                  cityList.push(city);
              });
          map.addLayer(cities);
        } else {
            console.log(textStatus, errorThrown);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });
  }

function resetDetails() {
    cities.removeLayers(cityList);
    cityList.forEach((element) => {
        if (element != undefined) element.remove();
    });

    cityList.length = 0;

    airports.removeLayers(airportList);
    airportList.forEach((element) => {
        if (element != undefined) element.remove();
    });

    airportList.length = 0;
};


function getRestcountries(countryCode) {

    $.ajax({

        url: './php/getRestcountries.php',

        dataType: 'JSON',

        data: {
            'countryCode': countryCode
        },

        method: 'GET',

        success: function(result) {
			document.getElementById('countryCodeIdEasyButton').innerHTML = countryCode;
			document.getElementById('countryIdEasyButton').innerHTML = result.data.nativeName;
            document.getElementById('countryLanguageIdEasyButton').innerHTML = result.data.languages[0].name;
            var number = result.data.population;
            var n = new Intl.NumberFormat().format(number);
            var res = n.slice(0, 9).concat(n.slice(10, 12));
            document.getElementById('countryPopulationIdEasyButton').innerHTML = res;
            document.getElementById('countryRegionIdEasyButton').innerHTML = result.data.region;
            document.getElementById('countryFlagIdEasyButton').innerHTML = '<img src="'+result.data.flags.png+'" ></img>';
            getExchangerate(result.data.currencies[0].code);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }

    })
}

function getwiki(country) {

    $.ajax({

        url: './php/getWiki.php',

        dataType: 'JSON',

        data: {
            'country': country
        },

        method: 'GET',

        success: function(result) {
            if(result && result.data){
                document.getElementById('countryWikiSummaryIdEasyButton').innerHTML = result.data.extract + " " + '<a target="_blank" rel="noopener noreferrer" href="'+result.data.content_urls.desktop.page+'">Read More</a>';
            }
            else{
                document.getElementById('countryWikiIdEasyButton').innerHTML = country;
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }

    })
}

function getExchangerate(currencyCode) {

    $.ajax({

        url: './php/getExchangerate.php',

        dataType: 'JSON',

        data: {
            'currencyCode': currencyCode
        },

        method: 'GET',

        success: function(result) {
            if(result && result.data)
            { 
                $('#fromAmount').val(1);
                $('#toAmount').val(null);
                exchangerateResult = result.data;
                document.getElementById('countryCurrencyCode').innerHTML = "From " + currencyCode;
                for (var i = 0; i < Object.keys(result.data.conversion_rates).length; i++) {
                    var key = Object.keys(result.data.conversion_rates)[i];
                    $('#exchangeRate').append($('<option>', {
                        value: result.data.conversion_rates[key],
                        text: key,
                    }));
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }

    })
}

$("#exchangeRate").on("change", function() {
    convert();
});

$("#fromAmount").on("change", function() {
    convert();
});

function convert() {
    var rateKey = $("#exchangeRate").find("option:selected").text();
    var result = exchangerateResult.conversion_rates[rateKey] * $('#fromAmount').val();
    $('#toAmount').val(parseFloat(result.toFixed(3)) + rateKey);
    }

function getWeather(capitalCity) {

    $.ajax({
    url: './php/getWeather.php',
    type: 'POST',
    dataType: 'json',
    data: {
        capitalCity: capitalCity
    },
    success: function (result) {
            
            
        var resultCode = result.status.code

        if (resultCode == 200) {
          
          var d = result.data;
          
          $('#weatherModalLabel').html(capitalCity + ", " + countryOptionText);
          
          $('#todayConditions').html(d.forecast.forecastday[0].day.condition.text);
          $('#todayIcon').attr("src", d.forecast.forecastday[0].day.condition.icon);
          $('#todayMaxTemp').html(d.forecast.forecastday[0].day.maxtemp_c);
          $('#todayMinTemp').html(d.forecast.forecastday[0].day.mintemp_c);
          
          $('#day1Date').text(moment(d.forecast.forecastday[1].date).format('dddd'));
          $('#day1Icon').attr("src", d.forecast.forecastday[1].day.condition.icon);
          $('#day1MinTemp').text(d.forecast.forecastday[1].day.mintemp_c);
          $('#day1MaxTemp').text(d.forecast.forecastday[1].day.maxtemp_c);
          
          $('#day2Date').text(moment(d.forecast.forecastday[2].date).format('dddd'));
          $('#day2Icon').attr("src", d.forecast.forecastday[2].day.condition.icon);
          $('#day2MinTemp').text(d.forecast.forecastday[2].day.mintemp_c);
          $('#day2MaxTemp').text(d.forecast.forecastday[2].day.maxtemp_c);
          
          $('#lastUpdated').text(d.current.last_updated);
          
          $('#pre-load').addClass("fadeOut");
          
        } else {
  
          $('#weatherModal .modal-title').replaceWith("Error retrieving data");
  
        } 

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#weatherModal .modal-title').replaceWith("Error retrieving data");
    }
  });
}