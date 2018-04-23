<?php

	session_start();

	require_once "../../../mysqli_connection.php";

	$q = "SELECT * FROM exam";

	
	if($_GET['isInstructor']){
		if($_SESSION['user']['user']['isInstructor']){
			$q .= " WHERE instructorId=".$_SESSION['user']['user']['userId'];
		}
	} else if($_GET['examId'] != NULL){
		$q .= " WHERE examId=".$_GET['examId'];	
	}


	$dbc = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die ('Could not connect to MySQL: ' .mysqli_connect_error() );	
	$r = @mysqli_query($dbc, $q);

	if(mysqli_num_rows($r) >= 1){
		$resp = array();
		while($row = mysqli_fetch_assoc($r)) {
			
			$row['questions'] = array();

			$qq = "SELECT * FROM questions INNER JOIN questionBank ON questions.questionId=questionBank.questionId WHERE
			examId='".$row['examId']."'";

			$rr = @mysqli_query($dbc, $qq);
			
			while($question = mysqli_fetch_assoc($rr)){
				
				$question['testcases'] = array();

				$qqq = "SELECT * FROM testcases WHERE questionId='".$question['questionId']."'";
	                	$rrr = @mysqli_query($dbc, $qqq);

				while($testcase = mysqli_fetch_assoc($rrr)){
													                                			      		$testcase['input'] = explode(";;", $testcase['input']);
																	                                	array_push($question['testcases'], $testcase);										    }

				array_push($row['questions'], $question);
			}

			array_push($resp, $row);
		}

		echo json_encode($resp);
		
	} else {
		echo json_encode(array());
	}
	
?>
