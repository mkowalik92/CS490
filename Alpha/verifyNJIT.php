<?php
$username = $_POST["username"];
$password = $_POST["password"];

$map -> username = $username;

$ch = curl_init();

$url = "https://cp4.njit.edu/cp/home/login";

$postData = array();

$postData['user'] = $username;
$postData['pass'] = $password;
$postData['uuid'] = '0xACA021';

foreach ( $postData as $key => $value) {
$post_items[] = $key . '=' . $value;
}
$post_string = implode ('&', $post_items);

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_string);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$output = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

if( $info['redirect_url'] ){
  $map -> status = true;
}else{
  $map -> status = false;
}
$json_output = json_encode($map);
echo $json_output;
?>
