<html>
  <head>
  </head>

  <body>
    <?php
      $username = "mk343";
      $password = "whatmypasswordishaha";

      $url = 'https://web.njit.edu/~bn62/verifyUCID.php';

      $postData = array();
      $postData['username'] = $username;
      $postData['password'] = $password;

      foreach ($postData as $key => $value) {
        $post_items[] = $key . '=' . $value;
      }
      $post_string = implode('&', $post_items);

      $ch = curl_init();

      curl_setopt($ch,CURLOPT_URL, $url);
      curl_setopt($ch,CURLOPT_POST, 2);
      curl_setopt($ch,CURLOPT_POSTFIELDS, $post_string);

      $result = curl_exec($ch);

      curl_close($ch);
    ?>
  </body>

</html>
