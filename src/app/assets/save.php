<?php

$html = $_POST['html'];
$filename = $_POST['filename'];
  
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