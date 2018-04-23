<?php

	//ini_set('display_errors', 1);
	//ini_set('display_startup_errors', 1);
	//error_reporting(E_ALL);

	
	session_start();

	require_once "../../../mysqli_connection.php";

	$q = "SELECT * FROM questions";

	if($_GET['isInstructor'] == "true"){
		$q .= " WHERE instructorId=".$_SESSION['user']['user']['userId'];	
	}


	$dbc = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die ('Could not connect to MySQL: ' .mysqli_connect_error() );	
	$r = @mysqli_query($dbc, $q);

	if(mysqli_num_rows($r) >= 1){
		$resp = array();

		while($row = mysqli_fetch_assoc($r)) {
			
			$row['testcases'] = array();

			$qq = "SELECT * FROM testcases WHERE questionId='".$row['questionId']."'";
			$rr = @mysqli_query($dbc, $qq);

			while($testcase = mysqli_fetch_assoc($rr)){
				$testcase['input'] = explode(";; ", $testcase['input']);
				array_push($row['testcases'], $testcase);
			}

			array_push($resp, $row);
		}

		echo json_encode($resp);
		
	} else {
		echo json_encode(array());
	}
	
?>
