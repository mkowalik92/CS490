<?php
  session_start();
  //
  $url = 'https://web.njit.edu/~mni22/CS490/Beta/api/questionBanks.php';

  $postData = array();
  $postData['isInstructor'] = true;
  $postData['questionBankId'] = $_SESSION['userId'];

  foreach ($postData as $key => $value) {
    $post_items[] = $key . '=' . $value;
  }
  $post_string = implode('&', $post_items);

  $ch = curl_init();

  curl_setopt($ch,CURLOPT_URL, $url);
  curl_setopt($ch,CURLOPT_POST, 2);
  curl_setopt($ch,CURLOPT_POSTFIELDS, $post_string);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

  $json = curl_exec($ch);

  curl_close($ch);

  echo $json;
?>
