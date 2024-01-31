	$('#btnSiblings').click(function() {
		$.ajax({
			url: "libs/php/getSiblings.php",
			type: 'POST',
			dataType: 'json',
			data: {
				geonameId: $('#geonameId').val()
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {
					setTable(result, "SIBLINGS", "countryCode", "toponymName", "population");
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
			}
		}); 
	
	});
	
	$('#btnEarthquakes').click(function() {
		$.ajax({
			url: "libs/php/getEarthquakes.php",
			type: 'POST',
			dataType: 'json',
			data: {
				north: $('#earthNorth').val(),
				south: $('#earthSouth').val(),
				east: $('#earthEast').val(),
				west: $('#earthWest').val()
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {
					setTable(result, "EARTHQUAKES", "datetime", "depth", "magnitude");
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
			}
		}); 
	
	});
	
	$('#btnWeather').click(function() {
		$.ajax({
			url: "libs/php/getWeather.php",
			type: 'POST',
			dataType: 'json',
			data: {
				north: $('#weatherNorth').val(),
				south: $('#weatherSouth').val(),
				east: $('#weatherEast').val(),
				west: $('#weatherWest').val()
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") 
				{
					setTable(result, "WEATHER", "observation", "stationName", "temperature");
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
			}
		}); 
	
	});
	
	function setTable(result, title, header1, header2, header3) {
		var html="<h1 class='text-center text-info'>"+title+"</h1><table class='table borderless'><tr><th>"+header1+"</th><th>"+header2+"</th><th>"+header3+"</th></tr>";
		for(let r=0; r<result['data'].length; r++)
		{			
			
			html+="<tr><td>" + result['data'][r][header1] + "</td>";
			html+="<td>" + result['data'][r][header2] + "</td>";
			html+="<td>" + result['data'][r][header3] + "</td></tr>";
		}
		html+="</table>";
		document.getElementById("divResults").innerHTML=html;
	}