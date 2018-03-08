<?php
$username = $_POST["username"];
$password = $_POST["password"];

$ch = curl_init();

$url = "https://web.njit.edu/~mni22/CS490/Beta/api/auth.php";

$postData = array();

$postData['username'] = $username;
$postData['password'] = $password;

foreach ( $postData as $key => $value) {
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