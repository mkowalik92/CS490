<?php
	
	//ini_set('display_errors', 1);
	//ini_set('display_startup_errors', 1);
	//error_reporting(E_ALL);

	require_once "../mysqli_connection.php";
	
	header('Content-type:application/json;charset=utf-8');

	if($_SERVER['REQUEST_METHOD'] == 'POST'){
		$username = filter($_POST['username']);
		$password = filter($_POST['password']);

		$u = authenticate($username, $password);

		if($u != NULL){
			echo json_encode(array(
				"status" => true,
				"message" => "user is authenticated",
				"user" => $u
			));
		} else {
			echo json_encode(array(
				"status" => false,
				"message" => "username or password incorrect"
			));
		}

	} else {
		echo json_encode(array(
			"status" => false,
			"message" => "invalid request method"
		));
	}

	
	function filter($input){
		return htmlspecialchars(stripslashes(trim($input)));
	}

	function authenticate($username, $password){
		$dbc = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die ('Could not connect to MySQL: ' .mysqli_connect_error() );
		$username = mysqli_real_escape_string($dbc, $username);
		$password = mysqli_real_escape_string($dbc, $password);
		$q = "SELECT * FROM users WHERE username='$username' AND password='".md5($password)."'";
		$r = @mysqli_query($dbc, $q);

		if(mysqli_num_rows($r) == 1){
			$row = mysqli_fetch_array($r);
			return array(
				"fname" => $row['fname'],
				"lname" => $row['lname'],
				"username" => $row['username'],
				"email" => $row['email']
			);
		} else {
			return NULL;
		}

	}


?>
