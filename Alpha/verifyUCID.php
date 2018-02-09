<?php
$username = $_POST["username"];
$password = $_POST["password"];

///////////////////////////////
// veryify with SQL database //
///////////////////////////////
$ch = curl_init();

$url = "https://web.njit.edu/~mni22/cs490/verifySQL.php";

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

$resultSQL = (json_decode($output) -> {'status'});

//////////////////////////////
// verify with NJIT Servers //
//////////////////////////////
$ch = curl_init();

$url = "https://web.njit.edu/~bn62/verifyNJIT.php";

$postData = array();

$postData["username"] = $username;
$postData["password"] = $password;

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

$resultNJIT = (json_decode($output) -> {'status'});
if($resultNJIT == 1){
  $resultMap -> NJITverified = true;
  //echo "<pre style='display:inline;'>[x] </pre>Credentials are valid on NJIT's server.";
}else{
  $resultMap -> NJITverified = false;
  //echo "<pre style='display:inline;'>[ ] </pre>Credentials are invalid on NJIT's server.";
}

//echo "<br>";

if($resultSQL == 1){
  $resultMap -> SQLverified = true;
  //echo "<pre style='display:inline;'>[x] </pre>Credentials are valid in our Database.";
}else{
  $resultMap -> SQLverified = false;
  //echo "<pre style='display:inline;'>[ ] </pre>Credentials are invalid in our Database.";
}

$jsonOutput = json_encode($resultMap);
echo $jsonOutput;

?>
