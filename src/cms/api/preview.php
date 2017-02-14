<?php

ini_set('display_errors',1);
error_reporting(E_ALL);

# get config for this page
# returns $page_dir, $url_path ... 
require_once('config.inc.php');

// get html from $_POST, save to preview
$html     = $_POST['html'];
$filename = $_SERVER['DOCUMENT_ROOT'] . $url_path . 'preview.html';

$handle = fopen($filename,"w");
if ( fwrite($handle,$html) ){
  chmod($filename, 0777); //fix with better vagrant permission in mounting of shared folder
  echo "success";
} else {
  echo "fail";
}
fclose($handle);
?>