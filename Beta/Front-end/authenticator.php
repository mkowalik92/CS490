<?php
  $username = $_POST["username"];
  $password = $_POST["password"];

  // Link to Bill's login handler
  $url = '';

  $postData = array();
  $postData['username'] = $username;
  $postData['password'] = $password;

  foreach ($postData as $key => $value) {
    $post_items[] = $key . '=' . $value;
  }
  $post_string = implode('&', $post_items);

  $ch = curl_init();

  curl_setopt($ch,CURLOPT_URL, $url);
  curl_setopt($ch,CURLOPT_POST, 2);
  curl_setopt($ch,CURLOPT_POSTFIELDS, $post_string);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

  // The result I get here is a response from Bill's authenticator
  $result = curl_exec($ch);

  curl_close($ch);

  /*
  ECHO THE RESULT TO JAVASCRIPT AND USE JSON ARRAY THERE TO USE IN FORMATTING
  */
?>
