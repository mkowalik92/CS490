<?php
  session_start();
  $action = $_POST['action'];
  $actions = array('READ', 'DELETE');
  if(in_array($action, $actions)) {
    if ($action == 'READ') {
      $post_string = 'action=' . $action;
    }
    if ($action == 'DELETE') {
      $post_string = 'action=' . $action . '&answerId=' . $_POST['answerId'];
    }
    $url = 'https://web.njit.edu/~bn62/cs490/crud/answers.php';
    $ch = curl_init();
    curl_setopt($ch,CURLOPT_URL, $url);
    curl_setopt($ch,CURLOPT_POST, 1);
    curl_setopt($ch,CURLOPT_POSTFIELDS, $post_string);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $json = curl_exec($ch);
    curl_close($ch);
    echo $json;
  }
?>
