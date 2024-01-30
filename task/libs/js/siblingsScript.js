	$('#btnSiblings').click(function() {

		$.ajax({
			url: "libs/php/getSiblings.php",
			type: 'POST',
			dataType: 'json',
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {
					var html="<h1 class='text-center text-info'>SIBLINGS</h1><table class='table borderless'><tr><th>countryCode</th><th>toponymName</th><th>population</th></tr>";
					for(let r=0; r<result['data'].length; r++)
					{			
						
						html+="<tr><td>" + result['data'][r]['countryCode'] + "</td>";
						html+="<td>" + result['data'][r]['toponymName'] + "</td>";
						html+="<td>" + result['data'][r]['population'] + "</td></tr>";
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