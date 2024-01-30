	$('#btnWeather').click(function() {

		$.ajax({
			url: "libs/php/getWeather.php",
			type: 'POST',
			dataType: 'json',
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") 
				{
					var html="<h1 class='text-center text-info'>WEATHER</h1><table class='table borderless'><tr><th>observation</th><th>stationName</th><th>temperature</th></tr>";
					for(let r=0; r<result['data'].length; r++)
					{			
						
						html+="<tr><td>" + result['data'][r]['observation'] + "</td>";
						html+="<td>" + result['data'][r]['stationName'] + "</td>";
						html+="<td>" + result['data'][r]['temperature'] + "</td></tr>";
					}
					html+="</table>";
					document.getElementById("divResults").innerHTML=html;

				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});