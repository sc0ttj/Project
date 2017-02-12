<?php

ini_set('display_errors',1);
error_reporting(E_ALL);

require_once('passwd.php'); 
$loginSuccess = false;
$msg = '';

session_start();

if (isset($_SESSION['login'])){
  print_r($_SESSION);
  $loginSuccess = true;
  header("Location: ../../index.html");
}

function validateLogin ($pass){
  global $valid_password;
  if ($pass == $valid_password){
    return true;
  }
  return false;
}

/* ------------------------ */

// if not set, exit
if (isset($_POST['password'])) {

  // get login details
  $pass = $_POST['password'];

  // validate the login
  $loginSuccess = validateLogin($pass);

  if ($loginSuccess) {
    // if login was ok, start session
    $_SESSION['login'] = true;
    header("Location: ../../index.html");
  } else {
    session_unset();
    if (isset($_SESSION)) session_destroy();
    $msg = 'Password not valid. Try again.';
  }

}

?>

<!DOCTYPE html>
<html lang="en">

<head prefix="og: http://ogp.me/ns#">
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!-- Device -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="HandheldFriendly" content="True"/>
  <meta name="format-detection" content="telephone=no">
  <title>Login</title>
</head>

<style>

body {
  background-color: #eee;
  color: #222;
  font-family:  sans-serif;
  font-size: 1.6rem;
  padding: 24px;
}

form {
  padding: 12px;
  max-width: 600px;
  margin: 10px;
  min-width: 200px;
}

label, input {
  display: block;
  margin-bottom: 24px;
  padding-top: 6px;
  padding-bottom: 6px;
  width:  64%;
}

input[type="password"]{
  padding:  10px;
}

input[type="submit"] {
  background-color: #333;
  border: 0;
  color: #eee;
  cursor:  pointer;
  font-size:  2rem;
  font-weight: bold;
  padding-top: 6px;
  padding-bottom: 6px;
  width:  120px;
}

input[type="submit"]:hover, input[type="submit"]:focus, {
  background-color: #444;
}

</style>

<body>

<?php
if ($msg != ''){
  echo "<h2>".$msg."</h2>";
}

if (!$loginSuccess){
?>

<center>

<form action="login.php" method="post">
  <label>Enter the password for this page:</label>
  <input name="password" type="password" />
  <input type="submit" name="submit" value="LOGIN" />
</form>

</center>

<?php
}
?>
  
</body>
</html>
