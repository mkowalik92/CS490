<?php
  session_start();
?>
<!DOCTYPE html>
<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="login_stylesheet.css">
    <script src="login_page_script.js"></script>
  </head>

  <body>
    <div>

      <!-- Login Form -->
      <div id="login_form_container">
        <!--form class="login_form"-->
        <img src="logo.png" alt="Logo Placeholder">
        <!-- Username Input -->
        <input class="login_input" placeholder="username" id="username">
        <!-- Password Input -->
        <input class="login_input" type="password" placeholder="password" id="password">
        <!-- Login Button -->
        <input type="button" value="Login" onclick="login()">
        <!-- Wrong Password/Username -->
        <div id="wrongpassword"></div>
        <!--/form-->
      </div>

    </div>
  </body>

</html>
