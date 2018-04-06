<?php
  session_start();

  // Link to Bill's login handler
  $url = 'https://web.njit.edu/~bn62/cs490/crud/answers.php';

  $ch = curl_init();

  $postData = array();
  $postData['action'] = $_POST['action'];
  $postData['answerId'] = $_POST['answerId'];
  $postData['column'] = "pointsAwarded";
  $postData['value'] = $_POST['newPointValue'];

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
