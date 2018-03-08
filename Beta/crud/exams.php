<?php
	
	//ini_set('display_errors', 1);
	//ini_set('display_startup_errors', 1);
	//error_reporting(E_ALL);

	
	require_once "../../../mysqli_connection.php";

	if($_SERVER['REQUEST_METHOD'] == 'POST'){
		
		$dbc = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die ('Could not connect to
		                                MySQL: ' .mysqli_connect_error() );

		if($_POST['action'] == 'CREATE'){
			
			$q = "INSERT INTO exam (instructorId, title, description, gradeVisible) VALUES ('".$_POST['instructorId']."',
			'".mysqli_real_escape_string($dbc, $_POST['title'])."', '".mysqli_real_escape_string($dbc,
			$_POST['description'])."', '".$_POST['gradeVisible']."')";
			
			$r = @mysqli_query($dbc, $q);

			if($r){
				echo true;
			} else {
				echo false;
			}


		} else if($_POST['action'] == 'READ'){

			$q = "SELECT * FROM exam";
			
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
			
			$q = "UPDATE exam SET ".$_POST['column']."='".mysqli_real_escape_string($dbc, $_POST['value'])."' WHERE examId='".$_POST['examId']."'";
			$r = @mysqli_query($dbc, $q);

			if($r){
				echo true;
			} else {
				echo false;
			}


		} else if($_POST['action'] == 'DELETE'){
			
			$q = "DELETE FROM exam WHERE examId='".$_POST['examId']."'";
			$r = @mysqli_query($dbc, $q);

			if($r){
			        echo true;
			} else {
				echo false;
			}
							

		}

	}

?>
