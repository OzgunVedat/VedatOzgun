<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);
$url = 'http://api.weatherapi.com/v1/forecast.json?key=cabe82cf8ab843c4a62204534242704&q&q=' . $_REQUEST['capitalCity'] . '&days=3&aqi=no&alerts=no';
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
