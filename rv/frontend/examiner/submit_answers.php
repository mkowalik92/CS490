<?php
  session_start();

  $url = 'https://web.njit.edu/~bn62/cs490/student/gradeExam2.php';

  $ch = curl_init();

  $postData = array();
  $postData['examId'] = $_POST['examId'];
  $postData['studentId'] = $_POST['studentId'];
  $postData['questions'] = urlencode($_POST['questions']);

  foreach ($postData as $key => $value) {
    $post_items[] = $key . '=' . $value;
  }
  $post_string = implode('&', $post_items);

  curl_setopt($ch,CURLOPT_URL, $url);
  curl_setopt($ch,CURLOPT_POST, 1);
  curl_setopt($ch,CURLOPT_POSTFIELDS, $post_string);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

  // The result I get here is a response from Bill's authenticator
  $json = curl_exec($ch);

  curl_close($ch);

  echo $json;
?>
