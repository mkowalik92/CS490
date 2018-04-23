<?php

	session_start();
	session_unset();
	session_destroy();

	header('Content-type:application/json;charset=utf-8');

	echo json_encode(array(
		"status" => true,
		"message" => "user logged out"
	));

?>
