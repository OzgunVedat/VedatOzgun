<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$url = 'https://api.openweathermap.org/data/2.5/onecall?lat=' . $_REQUEST['lat'] . '&lon=' . $_REQUEST['lng'] . '&units=metric&exclude=minutely,hourly,daily&appid=90295d050411622d60d1bd575d1d2d9b';
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['data'] = $decode;


echo json_encode($output);

?>
