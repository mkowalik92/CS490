<?php
	
	//ini_set('display_errors', 1);
	//ini_set('display_startup_errors', 1);
	//error_reporting(E_ALL);

	
	require_once "../../../mysqli_connection.php";

	if($_SERVER['REQUEST_METHOD'] == 'POST'){
		
		$dbc = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die ('Could not connect to
		                                MySQL: ' .mysqli_connect_error() );

		if($_POST['action'] == 'CREATE'){
			
			$q = "INSERT INTO users (fname, lname, username, email, password, isInstructor) VALUES ('".$_POST['fname']."', '".$_POST['lname']."', '".$_POST['username']."', '".$_POST['email']."', '".md5($_POST['password'])."', '".$_POST['isInstructor']."')";
			
			$r = @mysqli_query($dbc, $q);

			if($r){
				echo true;
			} else {
				echo false;
			}


		} else if($_POST['action'] == 'READ'){

			$q = "SELECT * FROM users";
			if(isset($_POST['q'])){
			                                $q = $q." WHERE ".$_POST['q'];
							                        }
			
			$r = @mysqli_query($dbc, $q);
			
			$resp = array();

			if(mysqli_num_rows($r) >= 1){
				while($row = mysqli_fetch_assoc($r)) {
					unset($row['password']);
					array_push($resp, $row);
				}
			}

			echo json_encode($resp);


		} else if($_POST['action'] == 'UPDATE'){
			
			$q = "UPDATE users SET ".$_POST['column']."='".$_POST['value']."' WHERE userId='".$_POST['userId']."'";
			$r = @mysqli_query($dbc, $q);

			if($r){
				echo true;
			} else {
				echo false;
			}


		} else if($_POST['action'] == 'DELETE'){
			
			$q = "DELETE FROM users WHERE userId='".$_POST['userId']."'";
			$r = @mysqli_query($dbc, $q);

			if($r){
			        echo true;
			} else {
				echo false;
			}
							

		}

	}

?>
