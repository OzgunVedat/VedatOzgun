<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/searchAll.php?txt=<txt>

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	// first query - SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production

  $query = $conn->prepare('SELECT `p`.`id`, `p`.`firstName`, `p`.`lastName`, `p`.`email`, `d`.`id` as `departmentID`, `d`.`name` AS `department`, `l`.`id` as `locationID`, `l`.`name` AS `location` FROM `personnel` `p` LEFT JOIN `department` `d` ON (`d`.`id` = `p`.`departmentID`) LEFT JOIN `location` `l` ON (`l`.`id` = `d`.`locationID`) WHERE (? = "" or `p`.`firstName` = ?)  AND (? = "" or `p`.`lastName` = ?) AND (? = "" or `p`.`email` = ?) AND (? = "" or `d`.`id` = ?) ORDER BY `p`.`lastName`, `p`.`firstName`, `d`.`name`, `l`.`name`');


  $query->bind_param("ssssssss", $_REQUEST['firstName'], $_REQUEST['firstName'], $_REQUEST['lastName'], $_REQUEST['lastName'], $_REQUEST['email'], $_REQUEST['email'], $_REQUEST['departmentID'], $_REQUEST['departmentID']);


	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
    
	$result = $query->get_result();

  $found = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($found, $row);

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data']['found'] = $found;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>