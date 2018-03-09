<?php
  session_start();

  $url = 'https://web.njit.edu/~bn62/cs490/crud/studentExams.php';

  $ch = curl_init();

  $studentExamId = $_POST['studentExamId'];
  //$postData = array();
  //$postData['action'] = $_POST['action'];
  //$postData['studentExamId'] = $_POST['studentExamId'];
  //$postData['column'] = 'examSubmitted';
  //$postData['value'] = '1';
  //echo $postData['action'] . ' ' . $postData['studentExamId'] . ' ' . $postData['column'] . ' ' . $postData['value'];


  //foreach ($postData as $key => $value) {
  //  $post_items[] = $key . '=' . $value;
  //}
  //$post_string = implode('&', $post_items);
  $post_string = 'action=UPDATE' . '&studentExamId=' . $studentExamId . '&column=examSubmitted&value=1';
  //echo $post_string;

  curl_setopt($ch,CURLOPT_URL, $url);
  curl_setopt($ch,CURLOPT_POST, 1);
  curl_setopt($ch,CURLOPT_POSTFIELDS, $post_string);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

  // The result I get here is a response from Bill's authenticator
  $json = curl_exec($ch);

  curl_close($ch);

  echo $json;
?>
