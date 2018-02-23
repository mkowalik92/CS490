<?php
  session_start();
  $username = $_POST["username"];
  $password = $_POST["password"];

  // Link to Bill's login handler
  $url = 'https://web.njit.edu/~bn62/cs490/login/auth.php';

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
  $json = curl_exec($ch);

  curl_close($ch);

  $json_decoded = json_decode($json, true);
  //echo $json_decoded['user']['isInstructor'];
  if ($json_decoded['message'] == 'user is authenticated') {
    if ($json_decoded['user']['isInstructor'] == "true") {
      $_SESSION['username'] = $username;
      $_SESSION['loggedin'] = true;
      $_SESSION['isInstructor'] = $json_decoded['user']['isInstructor'];
      $_SESSION['userId'] = $json_decoded['user']['userId'];
      echo "TEACHER";
      exit();
    }
    if ($json_decoded['user']['isInstructor'] == "false") {
      $_SESSION['username'] = $username;
      $_SESSION['loggedin'] = true;
      $_SESSION['isInstructor'] = $json_decoded['user']['isInstructor'];
      $_SESSION['userId'] = $json_decoded['user']['userId'];
      echo "STUDENT";
      exit();
    }
  } else {
    echo "FALSE";
    exit();
  }
?>
