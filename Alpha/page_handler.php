<html>
  <head>
  </head>

  <body>
    <?php
      $url = 'https://web.njit.edu/~bn62/verifyUCID.php';
      $fields = array(
        'username' => urlencode($_POST['username']),
        'password' => urlencode($_POST['password'])
      );
      foreach ($fields as $key => $value) { $fields_string .= $key.'='.$value.'&'; }
      rtrim($fields_string, '&');

      $ch = curl_init();

      curl_setopt($ch,CURLOPT_URL, $url);
      curl_setopt($ch,CURLOPT_POST, count($fields));
      curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

      $result = curl_exec($ch);

      curl_close($ch);
    ?>
  </body>

</html>
