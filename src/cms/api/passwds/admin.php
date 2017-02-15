<?php 
if ( isset($_POST["get_passwd"]) ){
  if ( !isset($_SESSION["login"]) ){ 
    die; 
  }
  # CMS admin is asking for passwd over AJAX, echo it
  echo '$2y$10$xPNBNDPawKBc76YiqB/9FO8KjkWObpugCYtA/NaSSemHNbT1ysyO.';
} else {
  # login.php is requiring the passwd, so give it the $var
  $valid_password = '$2y$10$xPNBNDPawKBc76YiqB/9FO8KjkWObpugCYtA/NaSSemHNbT1ysyO.';
}
?>