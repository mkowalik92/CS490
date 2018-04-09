<?php
  session_start();

  $url = "https://web.njit.edu/~bn62/cs490/login/auth.php";

  $postData = array( "username" => $_POST["username"], "password" => $_POST["password"]);
  foreach ($postData as $key => $value) {
    $post_items[] = $key . '=' . $value;
  }
  $post_string = implode('&', $post_items);

  $ch = curl_init();

  curl_setopt($ch,CURLOPT_URL, $url);
  curl_setopt($ch,CURLOPT_POST, 1);
  curl_setopt($ch,CURLOPT_POSTFIELDS, $post_string);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

  $json = curl_exec($ch);

  curl_close($ch);

  $json_decoded = json_decode($json, true);
  if ($json_decoded['message'] == 'user is authenticated') {
    if ($json_decoded['user']['isInstructor'] == 1) {
      $_SESSION['username'] = $username;
      $_SESSION['loggedin'] = true;
      $_SESSION['isInstructor'] = $json_decoded['user']['isInstructor'];
      $_SESSION['userId'] = $json_decoded['user']['userId'];
      echo "TEACHER";
      exit();
    }
    if ($json_decoded['user']['isInstructor'] == 0) {
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
