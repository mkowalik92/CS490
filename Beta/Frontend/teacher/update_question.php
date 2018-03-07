<?php
  session_start();

  $url = 'https://web.njit.edu/~bn62/cs490/crud/questions.php';

  $postQuestion = array();
  $postQuestion['action'] = $_POST['action'];
  $postQuestion['questionId'] = $_POST['questionId'];
  $postQuestion['column'] = 'question';
  $postQuestion['value'] = $_POST['question'];

  $postTopic = array();
  $postTopic['action'] = $_POST['action'];
  $postTopic['questionId'] = $_POST['questionId'];
  $postTopic['column'] = 'topic';
  $postTopic['value'] = $_POST['topic'];

  $postDifficulty = array();
  $postDifficulty['action'] = $_POST['action'];
  $postDifficulty['questionId'] = $_POST['questionId'];
  $postDifficulty['column'] = 'difficultyLevel';
  $postDifficulty['value'] = $_POST['difficultyLevel'];

  foreach ($postQuestion as $key => $value) {
    $post_items[] = $key . '=' . $value;
  }
  $post_string_question = implode('&', $post_items);
  //echo $post_string_question;

  foreach ($postTopic as $key => $value) {
    $post_items[] = $key . '=' . $value;
  }
  $post_string_topic = implode('&', $post_items);

  foreach ($postDifficulty as $key => $value) {
    $post_items[] = $key . '=' . $value;
  }
  $post_string_difficulty = implode('&', $post_items);

  $ch = curl_init();

  curl_setopt($ch,CURLOPT_URL, $url);
  curl_setopt($ch,CURLOPT_POST, 1);
  curl_setopt($ch,CURLOPT_POSTFIELDS, $post_string_topic);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

  // The result I get here is a response from Bill's authenticator
  $json = curl_exec($ch);

  curl_setopt($ch,CURLOPT_POSTFIELDS, $post_string_question);
  $json = curl_exec($ch);
  curl_setopt($ch,CURLOPT_POSTFIELDS, $post_string_difficulty);
  $json = curl_exec($ch);
  curl_close($ch);

?>
