<?php

ini_set('display_errors',1);
error_reporting(E_ALL);

# get config for this page
# returns $page_dir, $url_path ... 
require_once('config.inc.php');

# an example validate login func
function validateLogin ($pass){
  global $valid_password;
  
  # if translator is trying to login
  if (isset($_SESSION['translate'])){
    # get the passwd generated for their given LANG
    require_once('passwds/'.$_SESSION['translate'].'.php');
  }
  
  // should decrypt password here

  # if given pass matches, return true
  if ($pass == $valid_password){
    return true;
  }
  
  return false;
}

#
# require the admin pass created when this editable page was created
#
require_once('passwds/admin.php');


# reset current login attempt
$loginSuccess = false;
$msg = '';

# start session, get access to session vars
session_start();

# if ?translate=LANG in URL then keep the LANG var in session...
#
# this will allow translators to re-attempt login without 
# passing the query string around all the time
$qs = '';
if (isset($_SESSION['translate'])){
  $qs = '?translate=' . $_SESSION['translate'];
}


#
#
# user not yet logged in ....

# if user has sent a passwd to check
if (isset($_POST['password'])) {

  // get login details
  $pass = $_POST['password'];
  // validate the login
  $loginSuccess = validateLogin($pass);

  if ($loginSuccess) {

    // if login was ok, start session
    $_SESSION['login'] = true;
    # keep the dir in session, dso login is only valid for this page
    $_SESSION['page_dir'] = $page_dir;
    # all done, login was OK
    # so redirect to page root, it will load the CMS
    header("Location: ../../".$qs);
  

  } else { # login failed

    // session_unset();
    // if (isset($_SESSION)) session_destroy();
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
  margin: 0;
  padding: 0;
}

form {
  max-width: 500px;
  min-width: 200px;
  width: 100%;
}

label, input {
  display: block;
  line-height: 2rem;
  margin-bottom: 24px;
  padding-top: 6px;
  padding-bottom: 6px;
}

input[type="password"]{
  font-size: 1.6rem;
  line-height: 1.6rem;
  padding: 6px;
  max-width: 355px;
  width: 100vw;
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

<center>

<?php
if (isset($_SESSION['translate'])){
  echo "<h2>Translator login:</b>  ".$_SESSION['translate']."</h2>";
} else {
  echo "<h2>Admin login:</h2>";
}

if ($msg != ''){
  echo "<h4>".$msg."</h4>";
}

if (!$loginSuccess){
?>

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
