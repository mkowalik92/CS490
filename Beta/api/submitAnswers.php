<?php

	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);


	session_start();

	require_once "../../../mysqli_connection.php";

	header('Content-type:application/json;charset=utf-8');
	
	if($_SERVER['REQUEST_METHOD'] == 'POST'){
		

		if($_SESSION['user'] != NULL && $_SESSION['user']['user']['isInstructor']){


			$data = json_decode(file_get_contents("php://input"), true);
		

			if(is_array($data)){
				
				$dbc = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die ('Could not connect to
				 MySQL: ' .mysqli_connect_error() );

				foreach($data as &$answer){
					$q = "INSERT INTO answers (examId, questionId, studentId, answer) VALUES
					('".$answer['examId']."', '".$answer['questionId']."', '".$_SESSION['user']['user']['userId']."', '".mysqli_real_escape_string($dbc, $answer['answer'])."')";
					@mysqli_query($dbc, $q);
				}

				echo json_encode(array(
					"status" => true,
					"message" => "added answers successfully"
				));


			} else {
				echo json_encode(array(
					"status" => false,
					"message" => "invalid json"
				));
			}
		} else {
			
			echo json_encode(array(
				"status" => false,
				"message" => "user is either not logged in or do not have the sufficient privileges"
			));

		}

	} else {
		echo json_encode(array(
			"status" => false,
			"message" => "invalid request method"
		));

	}


?>
