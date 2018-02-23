<?php
  session_start();
  echo $_SESSION['username'] . ' ' .
  $_SESSION['userId'];
?>
<!DOCTYPE html>
<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://web.njit.edu/~mk343/cs490/logout.js"></script>
    <script src="https://web.njit.edu/~mk343/cs490/teacher/teacher_page_script.js"></script>
    <link rel="stylesheet" type="text/css" href="teacher_stylesheet.css">
  </head>

  <body>
    <h1>Instructor Home Page</h1>
    <div class="test">
      <input class="testbutton" type="button" value="[GET]QuestBank -> console" onclick="getQuestionBank()">
      <input placeholder="question" id="question">
      <input placeholder="topic" id="topic">
      <input placeholder="points" id="points">
      <input placeholder="difficultyLevel" id="difficultyLevel">
      <input class="testbutton" type="button" value="[POST]QuestToBank -> console" onclick="postToQuestBank()">
      <input class="testbutton" id="logout" type="button" value="Logout" onclick="logout()">
    </div>
  </body>

</html>
