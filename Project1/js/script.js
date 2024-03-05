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

var layerControl = L.control.layers(basemaps).addTo(map);

L.easyButton("fa-info", function(btn, map) {
    $("#infoModal").modal("show");
    getRestcountries(country_iso_a3);
}).addTo(map);

L.easyButton( '<B><i class="material-icons" style="font-size:15px;">W</i></B>', function(){
    $("#wikiModal").modal("show");
    getwiki(countryOptionText.split(' ', 2).join("-"));
  }).addTo(map);

  L.easyButton( 'fa-money-bill', function(){
    $("#currencyModal").modal("show");
    getRestcountries(country_iso_a3);
  }).addTo(map);
  
  L.easyButton( '<B><i class="material-icons" style="font-size:15px;">L</i></B>', function(){
    $("#languageModal").modal("show");
    getRestcountries(country_iso_a3);
  }).addTo(map);

  L.easyButton( '<B><i class="material-icons" style="font-size:15px;">P</i></B>', function(){
    $("#regionModal").modal("show");
    getRestcountries(country_iso_a3);
  }).addTo(map);

  L.easyButton( 'fa-flag', function(){
    $("#flagModal").modal("show");
    getRestcountries(country_iso_a3);
  }).addTo(map);
  
  L.easyButton( 'fa-forward', function(){
  map.setView([38, 139], 4);
  }).addTo(map);
  
  L.easyButton( 'fa-backward', function(){
   map.setView([37.8, -96], 3);
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
                    getCountryCities(result.data.border.features[i].properties.iso_a2);
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
var markers = L.markerClusterGroup({ showCoverageOnHover: false });
var markerList = [];

function getCountryCities(codeA2) {
    $.ajax({
        url: "./php/getCountryCities.php",
        type: "POST",
        dataType: "json",
        data: {
            country: codeA2
        },
        success: function(result) {

            resetDetails();

            addMarkers(result.citiesNames, result.citiesCoords, result.citiesPopulation);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

function addMarkers(citiesNames, citiesCoords, citiesPopulation) {
    let i = 0;
    let marker = undefined;
    let cityMarker = L.ExtraMarkers.icon({
        icon: "fa-landmark",
        iconColor: "white",
        markerColor: "#333",
        prefix: "fa",
        svg: true,
    });

    let capitalMarker = L.ExtraMarkers.icon({
        icon: "fa-landmark",
        iconColor: "#333",
        markerColor: "white",
        shape: "square",
        prefix: "fa",
        svg: true,
    });
    while (i < citiesNames.length) {

        marker =
            i == 0 ?
            L.marker(citiesCoords[i], {
                icon: capitalMarker
            }) :
            L.marker(citiesCoords[i], {
                icon: cityMarker
            });
        markers.addLayer(marker);
        markerList.push(marker);
        i++;
    }
    map.addLayer(markers);
    for (let j = 0; j < markerList.length; j++) {
        addPopup(markerList[j], j, citiesNames[j], citiesCoords[j], citiesPopulation[j]);
      }


};

function resetDetails() {
      markers.removeLayers(markerList);
};


function addPopup(marker, index, cityName, cityCoord, cityPopulation) {

    let popUpOptionsCity = {
        className: "popupCity"
    };

    let popUpOptionsCapital = {
        className: 'popupCapital'
    };

    $.ajax({
        url: "php/getWeather.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: cityCoord[0],
            lng: cityCoord[1]
        },
        success: function(result) {
            if (result.status.code == "200") {
                let temp = result.data.current.temp;
                let humidity = result.data.current.humidity;
                let wind = result.data.current.wind_speed;

                popUpOption = index == 0 ? popUpOptionsCapital : popUpOptionsCity;

                let popUpMsg = `
				  <h5 class="text-center">${cityName}</h5>
				  <hr class="my-1">
				  <div class="media">
					<div class="media-body text-nowrap">
					  Temperature: ${temp} °C <br>
					  Humidity: ${humidity}% <br>
					  Wind: ${wind} m/s<br>
					  Population: ${cityPopulation} m/s<br>
					</div>
				  </div>`;

                marker.bindPopup(popUpMsg, popUpOption).on("popupopen", function() {
                    $(".popupCitiesPlaces").on("click", function() {
                        let lng = $(this).attr("data-lng");
                        let lat = $(this).attr("data-lat");
                        $("#carousel-inner").html("");

                        getPlacesId(lng, lat);
                    });
                });
                if (index == 0) {
                    marker.openPopup();
					document.getElementById('capitalIdEasyButton').innerHTML = cityName;
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

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
            document.getElementById('countryCurrencyIdEasyButton').innerHTML = result.data.currencies[0].name;
            document.getElementById('countryLanguageIdEasyButton').innerHTML = result.data.languages[0].name;
            document.getElementById('countryPopulationIdEasyButton').innerHTML = result.data.population;
            document.getElementById('countryRegionIdEasyButton').innerHTML = result.data.region;
            document.getElementById('countryFlagIdEasyButton').innerHTML = '<img src="'+result.data.flags.png+'" width="70" height="50"></img>';
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
            if(result && result.data && result.data.length > 2)
                document.getElementById('countryWikiIdEasyButton').innerHTML = '<a target="_blank" rel="noopener noreferrer" href="'+result.data[3][0]+'">'+country+'</a>';
            else
                document.getElementById('countryWikiIdEasyButton').innerHTML = country;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }

    })
}