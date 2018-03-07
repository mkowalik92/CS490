<?php
  session_start();

  $url = 'https://web.njit.edu/~bn62/cs490/crud/studentExams.php';

  $postData = array();
  $postData['action'] = $_POST['action'];
  $postData['studentExamId'] = $_POST['studentExamId'];

  foreach ($postData as $key => $value) {
    $post_items[] = $key . '=' . $value;
  }
  $post_string = implode('&', $post_items);

  $ch = curl_init();

  curl_setopt($ch,CURLOPT_URL, $url);
  curl_setopt($ch,CURLOPT_POST, 1);
  curl_setopt($ch,CURLOPT_POSTFIELDS, $post_string);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

  // The result I get here is a response from Bill's authenticator
  $json = curl_exec($ch);

  curl_close($ch);

  echo $json;
?>
