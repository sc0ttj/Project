<?php
session_start();
//
session_unset(); 
session_destroy();
header("Location: ../../"); // redirect to root dir of this page
die();
?>
