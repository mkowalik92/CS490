<?php
  //$url = 'https://web.njit.edu/~bn62/cs490/crud/exams.php';
  session_start();
  $action = $_POST['action'];
  $actions = array('CREATE', 'READ', 'UPDATEQUESTION', 'UPDATETOPIC', 'UPDATEDIFFICULTY', 'DELETE');
  if(in_array($action, $actions)) {
    if ($action == 'CREATE') {
      $postData = array( 'action' => $action, 'instructorId' => $_SESSION['userId'], 'title' => $_POST['title'], 'description' => $_POST['description'], 'gradeVisible' => 0);
      foreach ($postData as $key => $value) {
        $post_items[] = $key . '=' . $value;
      }
      $post_string = implode('&', $post_items);
    }
    if ($action == 'READ') {
      $post_string = 'action=' . $action;
    }
    if ($action == 'DELETE') {
      $postData = array( 'action' => $action, 'examId' => $_POST['examId']);
      foreach ($postData as $key => $value) {
        $post_items[] = $key . '=' . $value;
      }
      $post_string = implode('&', $post_items);
    }
    $url = 'https://web.njit.edu/~bn62/cs490/crud/exams.php';
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
