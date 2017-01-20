<?php

ini_set('display_errors',1);
error_reporting(E_ALL);

// echo "<h1>" . getcwd() . "</h1>";

// echo "<br><pre>";
// print_r($_SERVER);
// print_r($_POST);
// print_r($_FILES);
// echo "</pre>";

if(is_array($_FILES)) {
  if(is_uploaded_file($_FILES['image']['tmp_name'])) {

    $sourcePath = $_FILES['image']['tmp_name'];
    $targetPath = $_SERVER['DOCUMENT_ROOT'] . '/' . basename($_SERVER['HTTP_REFERER']) . '/images/'.$_FILES['image']['name'];

    echo $sourcePath . " ... " . $targetPath;

    // chmod($_SERVER['HTTP_REFERER'] . 'images/', 0777);

    if(move_uploaded_file($sourcePath,$targetPath)) {
    }
  }
}
?>