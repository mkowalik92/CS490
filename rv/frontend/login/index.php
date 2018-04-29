<?php
  session_start();
?>
<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="login_stylesheet.css">
    <link href="https://fonts.googleapis.com/css?family=Roboto:300" rel="stylesheet">
    <script src="login_script.js"></script>
  </head>

  <body>
    <div id="body_container">
      <div id="login_form_container">
        <img id="logo" src="logo.png" alt="Logo Placeholder">
        <div><input id="username_input" class="login_input" placeholder="username"></div>
        <div><input id="password_input" class="login_input" placeholder="password" type="password"></div>
        <div id="wrong_password_message_container"></div>
        <div><button id="login_button">Login</button></div>
      </div>
    </div>

  </body>

</html>
