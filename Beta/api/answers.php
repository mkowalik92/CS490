<?php

	session_start();

	require_once "../../../mysqli_connection.php";

	$q = "SELECT * FROM answers";

	if($_GET['examId'] != NULL){
		$q .= " WHERE examId=".$_GET['examId'];	
	}


	$dbc = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die ('Could not connect to MySQL: ' .mysqli_connect_error() );	
	$r = @mysqli_query($dbc, $q);

	if(mysqli_num_rows($r) >= 1){
		$resp = array();

		while($row = mysqli_fetch_assoc($r)) {
			array_push($resp, $row);
		}

		echo json_encode($resp);
		
	} else {
		echo json_encode(array());
	}
	
?>
