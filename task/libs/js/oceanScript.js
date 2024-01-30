	$('#btnOcean').click(function() {

		$.ajax({
			url: "libs/php/getOcean.php",
			type: 'POST',
			dataType: 'json',
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {
					var html="<h1 class='text-center text-info'>OCEAN</h1><table class='table borderless'><tr><th>distance</th><th>geonameId</th><th>name</th></tr>";
						
					html+="<tr><td>" + result['data']['distance'] + "</td>";
					html+="<td>" + result['data']['geonameId'] + "</td>";
					html+="<td>" + result['data']['name'] + "</td></tr>";
					
					html+="</table>";
					document.getElementById("divResults").innerHTML=html;
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});