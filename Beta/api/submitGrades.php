<?php
	

	session_start();

	require_once "../../../mysqli_connection.php";

	header('Content-type:application/json;charset=utf-8');
	
	if($_SERVER['REQUEST_METHOD'] == 'POST'){
		

		if($_SESSION['user'] != NULL && $_SESSION['user']['user']['isInstructor']){


			$data = json_decode(file_get_contents("php://input"), true);
		

			if(!is_array($data)){

				foreach($data as &$answer){
					$q = "UPDATE answers SET isCorrect='".$answer['isCorrect']."',
					pointsAwarded='".$answer['pointsAwarded']."', notes='".$answer['notes']."' WHERE
					answerId='".$answer['answerId']."'";			
					@mysqli_query($dbc, $q);
				}

				echo json_encode(array(
					"status" => true,
					"message" => "updated answers successfully"
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
