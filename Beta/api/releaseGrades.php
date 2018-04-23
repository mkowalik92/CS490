<?php
	

	session_start();

	require_once "../../../mysqli_connection.php";

	header('Content-type:application/json;charset=utf-8');
	
	if($_SERVER['REQUEST_METHOD'] == 'POST'){
		

		if($_SESSION['user'] != NULL && $_SESSION['user']['user']['isInstructor']){


			$data = json_decode(file_get_contents("php://input"), true);
			
			$q = "SELECT * from exam WHERE examId='".$data['examId']."'";
			$r = @mysqli_query($dbc, $q);

			if(mysqli_num_rows($r) == 1){
				$row = mysqli_fetch_array($r, MYSQLI_ASSOC);
				
				if($row['instructorId'] == $_SESSION['user']['user']['userId']){
					$qq = "UPDATE exam SET gradeVisible='1' WHERE examId='".$data['examId']."'";
					$rr = @mysqli_query($dbc, $qq);

					if($rr){
						echo json_encode(array(
							"status" => true,
							"message" => "grades released successfully"
						));
					} else {
						echo json_encode(array(
							"status" => false,
							"message" => "failed to release grades"
						));
					}
				} else {
					echo json_encode(array(
						"status" => false,
						"message" => "instructor does not have "
					));
				}
			} else {
				echo json_encode(array(
					"status" => false,
					"message" => "no record of exam with ID ".$data['examId']." found"
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
