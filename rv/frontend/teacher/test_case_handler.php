<?php
  session_start();
  $action = $_POST['action'];
  $actions = array('CREATE', 'READ', 'UPDATEINPUT', 'UPDATEOUTPUT', 'DELETE');
  if(in_array($action, $actions)) {
    if ($action == 'CREATE') {
      $postData = array( 'action' => $action, 'questionId' => $_POST['questionId'], 'input' => rawurlencode($_POST['input']), 'output' => rawurlencode($_POST['output']) );
      foreach ($postData as $key => $value) {
        $post_items[] = $key . '=' . $value;
      }
      $post_string = implode('&', $post_items);
      echo $post_string;
    }
    if ($action == 'READ') {
      $post_string = 'action=' . $action;
    }
    if ($action == 'UPDATEINPUT') {
      $postData = array( 'action' => 'UPDATE', 'testcaseId' => $_POST['testcaseId'], 'column' => 'input', 'value' => rawurlencode($_POST['input']));
      foreach ($postData as $key => $value) {
        $post_items[] = $key . '=' . $value;
      }
      $post_string = implode('&', $post_items);
    }
    if ($action == 'UPDATEOUTPUT') {
      $postData = array( 'action' => 'UPDATE', 'testcaseId' => $_POST['testcaseId'], 'column' => 'output', 'value' => rawurlencode($_POST['output']));
      foreach ($postData as $key => $value) {
        $post_items[] = $key . '=' . $value;
      }
      $post_string = implode('&', $post_items);
    }
    if ($action == 'DELETE') {
      $postData = array( 'action' => $action, 'testcaseId' => $_POST['testcaseId']);
      foreach ($postData as $key => $value) {
        $post_items[] = $key . '=' . $value;
      }
      $post_string = implode('&', $post_items);
    }
    $url = 'https://web.njit.edu/~bn62/cs490/crud/testcases.php';
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
