<?php

ini_set('display_errors',1);
error_reporting(E_ALL);

$html = $_POST['html'];

$filename = $_SERVER['DOCUMENT_ROOT'] . '/' . basename($_SERVER['HTTP_REFERER']) . '/preview.html';
  
$handle = fopen($filename,"w");

if ( fwrite($handle,$html) ){
  // Set the user
  $file = getcwd() . $filename;

  chmod($filename, 0777); //fix with better vagrant permission in mounting of shared folder
  //
  echo "success";

} else {
  echo "fail";
}

fclose($handle);

?>