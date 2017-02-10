<?php

ini_set('display_errors',1);
error_reporting(E_ALL);

$lang = 'en';

if (isset($_POST["lang"])) {
  $lang = $_POST["lang"];
}

// get root dir of the page being edited (/my-page-name/)
$url_path = pathinfo(parse_url($_SERVER['HTTP_REFERER'])['path'], PATHINFO_DIRNAME) . '/';
if ($url_path == '//'){
  $url_path = parse_url($_SERVER['HTTP_REFERER'])['path'];
}

// get html from $_POST, save to preview
$html     = $_POST['html'];
$filename = $_SERVER['DOCUMENT_ROOT'] . $url_path . $lang . '.html';

$handle = fopen($filename,"w");
if ( fwrite($handle,$html) ){
  chmod($filename, 0777); //fix with better vagrant permission in mounting of shared folder
  echo "Translation $lang.html saved.";
} else {
  echo "Translation $lang NOT saved.";
}
fclose($handle);
?>