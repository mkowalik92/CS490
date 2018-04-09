<?php
  session_start();
?>
<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!--link rel="stylesheet" type="text/css" href="login_stylesheet.css"-->
    <script src="login_script.js"></script>
  </head>

  <body>

    <div id="login_form_container">
      <div><input id="username_input" placeholder="username"></div>
      <div><input id="password_input" placeholder="password" type="password"></div>
      <div><button id="login_button">Login</button></div>
      <div id="wrong_password_message_container"></div>
    </div>

  </body>

</html>
