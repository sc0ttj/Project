<?php

ini_set('display_errors',1);
error_reporting(E_ALL);

// if a file was uploaded
if ( is_array($_FILES) ){

  // images
  
  if ( isset($_FILES['image']) ){

    if ( is_uploaded_file($_FILES['image']['tmp_name']) ){
      // get the filename and paths
      $sourcePath = $_FILES['image']['tmp_name'];
      $targetPath = $_SERVER['DOCUMENT_ROOT'] . '/' . basename($_SERVER['HTTP_REFERER']) . '/images/'.$_FILES['image']['name'];

      // build image optimization cmd
      $inputFile = $targetPath;
      $outputDir = $_SERVER['DOCUMENT_ROOT'] . '/' . basename($_SERVER['HTTP_REFERER']) . '/images/';
      $optimizeImgCmd = "mogrify -path $outputDir -quality 80 -define png:compression-level=9 $inputFile";

      // move file and optimize
      if ( move_uploaded_file($sourcePath,$targetPath) ){
        echo "Image uploaded... ";
        if ( exec($optimizeImgCmd) ){
          echo "Image compressed.";
        }
      }
    }

  }


  // videos

  if ( isset($_FILES['video']) ){
    if ( is_uploaded_file($_FILES['video']['tmp_name']) ){
      // get the filename and paths
      $sourcePath = $_FILES['video']['tmp_name'];
      $targetPath = $_SERVER['DOCUMENT_ROOT'] . '/' . basename($_SERVER['HTTP_REFERER']) . '/videos/'.$_FILES['video']['name'];

      // move file and optimize
      if ( move_uploaded_file($sourcePath,$targetPath) ){
        echo "Video uploaded... ";
      }
    }
  }

}
?>