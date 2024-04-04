<?php

$result = file_get_contents("../json/countryBorders.geo.json");

$border = json_decode($result,true);
$countryInfo = json_decode($result,true);

$output["status"]["code"] = "200";
$output["status"]["name"] = "ok";
$output["status"]["description"] = "success";

$output["data"]["border"] = $border;
$output["data"]["countryInfo"] = $countryInfo;


echo json_encode($output);

?>