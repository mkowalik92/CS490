<?php
  session_start();

  $url = 'https://web.njit.edu/~bn62/cs490/crud/testcases.php';

  $inputData = array();
  $inputData['action'] = $_POST['action'];
  $inputData['testcaseId'] = $_POST['testcaseId'];
  $inputData['column'] = 'input';
  $inputData['value'] = $_POST['newInput'];

  foreach ($inputData as $key => $value) {
    $post_items[] = $key . '=' . $value;
  }
  $input_string = implode('&', $post_items);

  $outputData = array();
  $outputData['action'] = $_POST['action'];
  $outputData['testcaseId'] = $_POST['testcaseId'];
  $outputData['column'] = 'output';
  $outputData['value'] = $_POST['newOutput'];

  foreach ($outputData as $key => $value) {
    $post_items[] = $key . '=' . $value;
  }
  $output_string = implode('&', $post_items);

  $ch = curl_init();

  curl_setopt($ch,CURLOPT_URL, $url);
  curl_setopt($ch,CURLOPT_POST, 1);
  curl_setopt($ch,CURLOPT_POSTFIELDS, $input_string);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

  // The result I get here is a response from Bill's authenticator
  $json = curl_exec($ch);

  curl_setopt($ch,CURLOPT_POSTFIELDS, $output_string);
  $json = curl_exec($ch);

  curl_close($ch);

  echo $json;
?>
