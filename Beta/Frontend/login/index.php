<?php
  session_start();
?>
<!DOCTYPE html>
<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!--link rel="stylesheet" type="text/css" href=""-->
    <script src="login_page_script.js"></script>
  </head>

  <body>
    <div>

      <!-- Login Form -->
      <div>
        <form class="login_form">
          <!-- Username Input -->
          <div><input placeholder="username" id="username"></div>
          <!-- Password Input -->
          <div><input type="password" placeholder="password" id="password"></div>
          <!-- Login Button -->
          <div><input type="button" value="Login" onclick="login()"></div>
          <!-- Wrong Password/Username -->
          <div id="wrongpassword"></div>
        </form>
      </div>

    </div>
  </body>

</html>
