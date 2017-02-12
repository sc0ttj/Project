<?php
session_start();
$_SESSION = '';
session_unset(); 
session_destroy();
echo "Logged out";
header("Location: login.php");
die();
?>
