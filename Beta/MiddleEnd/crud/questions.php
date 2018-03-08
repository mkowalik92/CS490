<?php
$ch = curl_init();

$url = "https://web.njit.edu/~mni22/CS490/Beta/crud/questions.php";

foreach ($_POST as $key => $value) {
  $post_items[] = $key . '=' . $value;
}
$post_string = implode ('&', $post_items);

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_string);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$output = curl_exec($ch);
curl_close($ch);

echo $output;

?>