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
  </head>

  <body>
    <h1>Student Home Page</h1>
    <input type="button" value="[GET]TestBank -> console">
    <input type="button" value="Logout" onclick="logout()">
  </body>

</html>
