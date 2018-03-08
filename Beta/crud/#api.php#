<?php

        //ini_set('display_errors', 1);
        //ini_set('display_startup_errors', 1);
        //error_reporting(E_ALL);


        require_once "../../../mysqli_connection.php";

        if($_SERVER['REQUEST_METHOD'] == 'POST'){

                $dbc = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die ('Could not connect to
                                                MySQL: ' .mysqli_connect_error() );


                $isResponseData = false;

                $tableId = '';
                switch ($_POST['table']) {
                        case 'answers':
                                $tableId = 'answerId';
                                break;
                        case "exam":
                                $tableId = 'examId';
                                break;
                        case "questionBank":
                                $tableId = 'questionBankId';
                                break;
                        case "questions":
                                $tableId = 'questionId';
                                break;
                        case "testcases":
                                $tableId = 'testcaseId';
                                break;
                        case "users":
                                $tableId = 'userId';
                                break;
                }



                if($_POST['action'] == 'CREATE'){

                        $q = "INSERT INTO '".$_POST['table']."'";

                        switch($_POST['table']){
                                case 'answers':
                                        $q = $q." (questionId, studentId, answer, notes, pointsAwarded, isCorrect) VALUES 
                                        ('".$_POST['questionId']."',
                                        '".$_POST['studentId']."',
                                        '".mysqli_real_escape_string($dbc, $_POST['answer'])."',
                                        '".mysqli_real_escape_string($dbc, $_POST['notes'])."',
                                        '".$_POST['pointsAwarded']."',
                                        '".$_POST['isCorrect']."')";
                                        break;
                                case "exam":
                                        $q = $q." (instructorId, title, description, gradeVisible) VALUES 
                                        ('".$_POST['instructorId']."',
                                        '".mysqli_real_escape_string($dbc, $_POST['title'])."',
                                        '".mysqli_real_escape_string($dbc,$_POST['description'])."',
                                        '".$_POST['gradeVisible']."')";
                                        break;
                                case "questionBank":
                                        $q = $q." (questionId, examId, points) VALUES 
                                        ('".$_POST['questionId']."', 
                                        '".$_POST['examId']."', 
                                        '".$_POST['points']."')";
                                        break;
                                case "questions":
                                        $q = $q." (questionId, examId, points) VALUES 
                                        ('".$_POST['questionId']."', 
                                        '".$_POST['examId']."', 
                                        '".$_POST['points']."')";
                                        break;
                                case "testcases":
                                        $q = $q." (questionId, input, output) VALUES 
                                        ('".$_POST['questionId']."', 
                                        '".mysqli_real_escape_string($dbc, $_POST['input'])."', 
                                        '".mysqli_real_escape_string($dbc, $_POST['output'])."')";
                                        break;
                                case "users":
                                        $q = $q." (fname, lname, username, email, password, isInstructor) VALUES 
                                        ('".$_POST['fname']."', 
                                        '".$_POST['lname']."', 
                                        '".$_POST['username']."', 
                                        '".$_POST['email']."', 
                                        '".md5($_POST['password'])."', 
                                        '".$_POST['isInstructor']."')";
                                        break;

                        }


                } else if($_POST['action'] == 'READ'){

                        $q = "SELECT * FROM ".$_POST['table'];

                        if(isset($_POST['q'])){
                                $q = $q." WHERE ".$_POST['q'];
                        }

                        $isResponseData = true;

                } else if($_POST['action'] == 'UPDATE'){
                        $q = "UPDATE ".$_POST['table']." SET ".$_POST['column']."='".mysqli_real_escape_string($dbc, $_POST['value'])."' WHERE $tableId='".$_POST['tableId']."'";
                } else if($_POST['action'] == 'DELETE'){
                        $q = "DELETE FROM ".$_POST['table']." WHERE $tableId='".$_POST['tableId']."'";
                }


                $r = @mysqli_query($dbc, $q);

                if($isResponseData){
                        $resp = array();

                        if(mysqli_num_rows($r) >= 1){
                                while($row = mysqli_fetch_assoc($r)) {
                                        array_push($resp, $row);
                                }
                        }

                        echo json_encode($resp);
                } else {
                        if($r){
                                echo true;
                        } else {
                                echo false;
                        }
                }




        }

?>
