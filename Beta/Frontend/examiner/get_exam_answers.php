<?php
  session_start();

  // Link to Bill's login handler
  $url = 'https://web.njit.edu/~bn62/cs490/crud/answers.php';

  $ch = curl_init();

  $post_string = "action=" . $_POST['action'];

  curl_setopt($ch,CURLOPT_URL, $url);
  curl_setopt($ch,CURLOPT_POST, 1);
  curl_setopt($ch,CURLOPT_POSTFIELDS, $post_string);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

  // The result I get here is a response from Bill's authenticator
  $json = curl_exec($ch);

  curl_close($ch);

  echo $json;
?>
