<?php

ini_set('display_errors',1);
error_reporting(E_ALL);

session_start();

# get config for this page
# returns $page_dir, $url_path ... 
require_once('config.inc.php');

# if not logged in
if (!isset($_SESSION['login'])){
  # something fishy, logout for sure
  header('Location: cms/api/logout.php');
  die;
}

# user is logged in but login is for another page
if ($_SESSION['page_dir'] != $page_dir){
  # log them out
  header('Location: cms/api/logout.php?error=wrong_page');
  die;
}




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