<?php
	
	//ini_set('display_errors', 1);
	//ini_set('display_startup_errors', 1);
	//error_reporting(E_ALL);

	
	require_once "../../../mysqli_connection.php";

	if($_SERVER['REQUEST_METHOD'] == 'POST'){
		
		$dbc = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die ('Could not connect to
		                                MySQL: ' .mysqli_connect_error() );

		if($_POST['action'] == 'CREATE'){
			
			$q = "INSERT INTO testcases (questionId, input, output) VALUES ('".$_POST['questionId']."',
			'".mysqli_real_escape_string($dbc, $_POST['input'])."', '".mysqli_real_escape_string($dbc,
			$_POST['output'])."')";
			
			$r = @mysqli_query($dbc, $q);

			if($r){
				echo true;
			} else {
				echo false;
			}


		} else if($_POST['action'] == 'READ'){

			$q = "SELECT * FROM testcases";
			
			if(isset($_POST['q'])){
			                                $q = $q." WHERE ".$_POST['q'];
							                        }
			
			$r = @mysqli_query($dbc, $q);
			
			$resp = array();

			if(mysqli_num_rows($r) >= 1){
				while($row = mysqli_fetch_assoc($r)) {
					array_push($resp, $row);
				}
			}

			echo json_encode($resp);


		} else if($_POST['action'] == 'UPDATE'){
			
			$q = "UPDATE testcases SET ".$_POST['column']."='".mysqli_real_escape_string($dbc, $_POST['value'])."' WHERE testcaseId='".$_POST['testcaseId']."'";
			$r = @mysqli_query($dbc, $q);

			if($r){
				echo true;
			} else {
				echo false;
			}


		} else if($_POST['action'] == 'DELETE'){
			
			$q = "DELETE FROM testcases WHERE testcaseId='".$_POST['testcaseId']."'";
			$r = @mysqli_query($dbc, $q);

			if($r){
			        echo true;
			} else {
				echo false;
			}
							

		}

	}

?>
