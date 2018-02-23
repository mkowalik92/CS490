<?php
  session_start();
  $url = 'https://web.njit.edu/~mni22/CS490/Beta/api/submitQuestions.php';

  $questionData = array();
  $questionData['question'] = $_POST['question'];
  $questionData['topic'] = $_POST['topic'];
  $questionData['points'] = $_POST['points'];
  $questionData['difficultyLevel'] = $_POST['difficultyLevel'];
  $postData = array();
  $postData['questionBankId'] = $_SESSION['userId'];
  $postData['questions'] = $questionData;

  $JSONData = json_encode($postData);
  /*

  $ch = curl_init();

  curl_setopt($ch,CURLOPT_URL, $url);
  curl_setopt($ch,CURLOPT_POST, 1);
  curl_setopt($ch,CURLOPT_POSTFIELDS, $JSONData);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

  // The result I get here is a response from Bill's authenticator
  $JSONResult = curl_exec($ch);

  curl_close($ch);

  echo $JSONResult;
  */
  echo $JSONData;
?>
