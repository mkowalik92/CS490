<?php
function curl($url, $action, $json){
  $ch = curl_init();  
  $postData = array();
  $postData['action'] = $action;
  foreach ( $postData as $key => $value) {
    $post_items[] = $key . '=' . $value;
  }
  foreach ($json as $key => $value) {
    $post_items[] = $key . '=' . $value;
  }
  $post_string = implode ('&', $post_items);
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $post_string);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  $output = curl_exec($ch);
  curl_close($ch);
  return $output;
}
function submitAnswer($questionId, $studentId, $answer, $isCorrect, $pointsAwarded, $notes){
  $url = "https://web.njit.edu/~mni22/CS490/Beta/crud/answers.php";
  $json['questionId'] = $questionId;
  $json['studentId'] = $studentId;
  $json['answer'] = $answer;
  $json['isCorrect'] = $isCorrect;
  $json['pointsAwarded'] = $pointsAwarded;
  $json['notes'] = $notes;
  
  return curl($url, 'CREATE', $json);
}
function getTestcases($questionId = -1){
  $json = curl("https://web.njit.edu/~mni22/CS490/Beta/crud/testcases.php",'READ');
  if($questionId != -1){
    $arr = array();
    foreach(json_decode($json) as $val){  
      if(trim(json_encode($val->questionId),'"') == $questionId){
        array_push($arr,($val));
      }
    }
    $json = $arr;
  }
  return $json;
}

function getExamQuestionPoints($examId, $questionId){
  $json = curl("https://web.njit.edu/~mni22/CS490/Beta/crud/questionBanks.php",'READ');
  foreach(json_decode($json) as $val){
    if(trim(json_encode($val->examId),'"') == $examId && trim(json_encode($val->questionId),'"') == $questionId){
      return trim(json_encode($val->points),'"');
    }
  }  
  return 0;
}
function getFunctionName($answer){
  $arr = preg_split("/[\n\t' ']+/",$answer);
  foreach($arr as $word){
    if($word == "def"){
      return explode("(", current($arr))[0];
    }
  }
  return "No function found!";
}

function generateCode($answer){
  $myfile = fopen("studentCode.py", "w") or die("Unable to open the file!");
  fwrite($myfile,$answer);
  fclose($myfile);
}
function executeCode($functionName, $inputs, $output, &$notes){
  $params = "";
  foreach(explode("\n",$inputs) as $input){
    //echo " input: " . $input ."\n decoded: " . json_decode($input) . "\n";
    $isNumber = is_numeric(json_decode($input));
    $isString = is_string(json_decode($input));
    $isArray= is_array(json_decode($input));
    $isObject = is_object(json_decode($input));
    //echo " input type detected as: " . ($isNumber ? "Number " : "") . ($isString ? "String " : "") . ($isArray ? "Array " : "") . ($isObject ? "Object " : "") . "\n";
    $params .= ($params == "" ? "" : ", ") . ($isString ? $input : json_decode($input)); 
  }
  //echo " params: " . $params . "\n"; 
  $output = substr($output,0,1) == '"' ? substr($output, 1, strlen($output)-2) : $output;
  //echo " implode: ".implode(',',$params)."\n";
  $params = is_array($params) ? implode(',',$params) : $params;
  
  $command = ("python -c 'import studentCode; print studentCode." . $functionName . "(" . $params . ")'");
  $exec_output = array();
  exec($command, $exec_output, $codeFail);
  //echo " code status: " . $codeFail."\n";
  if($codeFail != 0){
    //echo (" Code could not compile!\n");
    $notes .= " Code could not compile!\n";
    return 0;
  }
  if(count($exec_output) == 1){
    $returnVal = $exec_output[0];
  }else{
    $chunk = array_chunk($exec_output, count($exec_output)-1);
    $printout = implode("\n",$chunk[0]);
    $returnVal = $chunk[1][0];
  }
  
  //echo " Code printed:\n".$printout."\n---\n";
  //echo " Students return value: ".$returnVal."\n";
  //echo " Expected return value: " . $output . "\n";
  //echo " So therefore: " . ($returnVal == $output ? "CORRECT" : "INCORRECT")."\n";
  
  $notes .= ($returnVal == $output ? " PASSED" : " FAILED")."\n";
  $notes .= " Parameters: " . $params . "\n";
  $notes .= " Students return value: ".$returnVal."\n";
  $notes .= " Expected return value: " . $output . "\n";
  $notes .= " Code printed:\n".$printout."\n------------\n";
  return $returnVal == $output;
}


//GETTING TESTCASES
$studentId = $_POST['studentId'];
$examId = $_POST['examId'];
foreach ( json_decode($_POST['questions']) as $value) {
  $points = 0;
  $notes = "";
  $answer = urldecode($value->answer);
  $questionId = $value->questionId;
  //echo "Question ID: " . $questionId . "\nANS: " . $answer . "\n";
  //$questionId = $value->questionId;
  //echo "Question Id: ".$questionId."\n==========\n";
  
  $testcases = getTestCases($questionId); //WHERE questionId match
  $functionName = getFunctionName($answer);
  generateCode($answer);
  $i = 0;
  foreach($testcases as $testcase){
    $input = $testcase->input;
    //echo "\nTestcase #".++$i."\n input(s):\n".$input."\n";
    $output = $testcase->output;
    //add to note
    $notes .= "Testcase #".++$i." -";
    $correct = executeCode($functionName, $input, $output, $notes);
    $notes .= "\n";
    //grade
    $points = $points + $correct;
  }
  $percent = $points / count($testcases);
  //echo "Correctness: ".($percent*100)."%\n";
  //submit answer
  
  $totalPoints = getExamQuestionPoints($examId, $questionId);
  $pointsAwarded = $totalPoints*$percent;
  $isCorrect = $percent < 0.5 ? 0 : 1;
  
  echo "submit: " . submitAnswer($questionId, $studentId, $answer, $isCorrect, $pointsAwarded, $notes) . "\n";
  //echo "Exam ID : " . $examId . "\nQuestion ID: " . $questionId . "\nPercent: " . $percent . "\nTotal Points: " . $totalPoints . "\n";
  //echo "Points awarded: " . $pointsAwarded . "\n";
  //echo "\n";
}
echo $notes;
?>
