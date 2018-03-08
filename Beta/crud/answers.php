<?php
	
	//ini_set('display_errors', 1);
	//ini_set('display_startup_errors', 1);
	//error_reporting(E_ALL);

	
	require_once "../../../mysqli_connection.php";

	if($_SERVER['REQUEST_METHOD'] == 'POST'){
		
		$dbc = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die ('Could not connect to
		                                MySQL: ' .mysqli_connect_error() );

		if($_POST['action'] == 'CREATE'){
			
			$q = "INSERT INTO answers (questionId, studentId, answer, notes, pointsAwarded, isCorrect) VALUES
			('".$_POST['questionId']."',
			'".$_POST['studentId']."',
			'".mysqli_real_escape_string($dbc, $_POST['answer'])."', 
			'".mysqli_real_escape_string($dbc, $_POST['notes'])."',
			'".$_POST['pointsAwarded']."',
			'".$_POST['isCorrect']."')";
			
			$r = @mysqli_query($dbc, $q);

			if($r){
				echo true;
			} else {
				echo false;
			}


		} else if($_POST['action'] == 'READ'){

			$q = "SELECT * FROM answers";
			
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
			
			$q = "UPDATE answers SET ".$_POST['column']."='".mysqli_real_escape_string($dbc, $_POST['value'])."' WHERE
			answerId='".$_POST['answerId']."'";
			$r = @mysqli_query($dbc, $q);

			if($r){
				echo true;
			} else {
				echo false;
			}


		} else if($_POST['action'] == 'DELETE'){
			
			$q = "DELETE FROM answers WHERE answerId='".$_POST['answerId']."'";
			$r = @mysqli_query($dbc, $q);

			if($r){
			        echo true;
			} else {
				echo false;
			}
							

		}

	}

?>
