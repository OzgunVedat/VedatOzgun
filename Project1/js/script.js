var streets = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
  }
);

var satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
  }
);
var basemaps = {
  "Streets": streets,
  "Satellite": satellite
};

var map = L.map("map", {
  layers: [streets]
}).setView([54.5, -4], 6);

var layerControl = L.control.layers(basemaps).addTo(map);



$.ajax({
	url: "./php/getCountryNames.php",
	type: 'POST',
	dataType: "json",
	
	success: function(result) {
		console.log('populate options' , result);
        if (result.status.name == "ok") {
            for (var i=0; i<result.data.border.features.length; i++) {
                        $('#selCountry').append($('<option>', {
                            value: result.data.border.features[i].properties.iso_a3,
                            text: result.data.border.features[i].properties.name,
                        }));
                    }
                }
            //sort options alphabetically
            $("#selCountry").html($("#selCountry option").sort(function (a, b) {
                return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
            }))
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
      });

      let border;



      $("#selCountry").on("change", function() {
        let countryOptionText = $("#selCountry").find("option:selected").text();
        
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
        
        let markers = [];

        function getCountryCities(codeA2) {
            $.ajax({
                url: "./php/getCountryCities.php",
                type: "POST",
                dataType: "json",
                data: {
                    country: codeA2
                },
                success: function(result) {

                  resetDetails(markers);
              
                    addMarkers(result.citiesNames, result.citiesCoords, result.citiesPopulation);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                }
            });
        }

function addMarkers(citiesNames, citiesCoords, citiesPopulation) {
  let i = 0;
  let j = 0;
  let marker = undefined;
  let cityMarker = L.icon({
    iconUrl: 'leaflet/images/marker-icon.png',
    iconSize: [35, 50]
  });

  let capitalMarker = L.icon({
    iconUrl: 'leaflet/images/capitalIcon.png',
    iconSize: [70,70]
  });

  while (i < citiesNames.length && i < 5){

    marker =
    i == 0 ?
    L.marker(citiesCoords[i], {
      icon: capitalMarker
    }) :
    L.marker(citiesCoords[i],{
      icon: cityMarker
    });
    marker.addTo(map);

    markers.push(marker);
    i++;
  }

  markers.forEach((marker) => {
    addPopup(marker, j, citiesNames[j], citiesCoords[j], citiesPopulation[j]);
    j++
  });



};

function  resetDetails(markers) {
  markers.forEach((element) => {
    if (element != undefined) element.remove();
  });

  markers.length = 0;
};


function addPopup(marker, i, cityName, cityCoord, cityPopulation) { 

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

        popUpOption = i == 0 ? popUpOptionsCapital : popUpOptionsCity;

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

        marker.bindPopup(popUpMsg, popUpOption).on("popupopen", function () {
            $(".popupCitiesPlaces").on("click", function () {
              let lng = $(this).attr("data-lng");
              let lat = $(this).attr("data-lat");
              $("#carousel-inner").html("");

              getPlacesId(lng, lat);
					});
			});
				  if (i == 0) {
            marker.openPopup();
    }
  }
},
error: function(jqXHR, textStatus, errorThrown) {
  console.log(textStatus, errorThrown);
}
  });
};


        