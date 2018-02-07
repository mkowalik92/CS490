<html>
  <head>
  </head>

  <body>
    <?php
      $username = $_POST["username"];
      $password = $_POST["password"];

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
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

      $result = curl_exec($ch);

      curl_close($ch);

      $parse = str_replace("<br>","",$result);
      $json_array = json_decode($parse,true);

      if ($json_array["NJITverified"] == 1) {
        echo "NJIT Login verified!<br>";
      } else {
        echo "NJIT Login NOT verified!<br>";
      }
      if ($json_array["SQLverified"] == 1) {
        echo "SQL Login verified!";
      } else {
        echo "SQL Login NOT verified!";
      }
    ?>
  </body>

</html>
