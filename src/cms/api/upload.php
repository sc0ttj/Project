<?php

ini_set('display_errors',1);
error_reporting(E_ALL);

# get config for this page
# returns $page_dir, $url_path ... 
require_once('config.inc.php');

// if a file was uploaded
if ( is_array($_FILES) ){

  // images
  
  if ( isset($_FILES['image']) ){

    if ( is_uploaded_file($_FILES['image']['tmp_name']) ){
      // get the filename and paths
      $sourcePath = $_FILES['image']['tmp_name'];
      $targetPath = $_SERVER['DOCUMENT_ROOT'] . $url_path . 'images/'.$_FILES['image']['name'];

      // build image optimization cmd
      $inputFile = $targetPath;
      $outputDir = $_SERVER['DOCUMENT_ROOT'] . $url_path . 'images/';
      $optimizeImgCmd = "mogrify -path $outputDir -quality 80 -define png:compression-level=9 $inputFile";

      // move file and optimize
      if ( move_uploaded_file($sourcePath,$targetPath) ){
        echo "Image uploaded... ";
        if ( exec($optimizeImgCmd) ){
          echo "Image compressed.";
        }
      } else {
        echo "Image NOT uploaded... ";
      }
    }

  }


  // videos

  if ( isset($_FILES['video']) ){
    if ( is_uploaded_file($_FILES['video']['tmp_name']) ){
      // get the filename and paths
      $sourcePath = $_FILES['video']['tmp_name'];
      $targetPath = $_SERVER['DOCUMENT_ROOT'] . $url_path . 'videos/'.$_FILES['video']['name'];

      // move file and optimize
      if ( move_uploaded_file($sourcePath,$targetPath) ){
        echo "Video uploaded... ";
      } else {
        echo "Video NOT uploaded... ";
      }
    }
  }


  // vocabs

  if ( isset($_FILES['vocab']) ){
    if ( is_uploaded_file($_FILES['vocab']['tmp_name']) ){
      // get the filename and paths
      $sourcePath = $_FILES['vocab']['tmp_name'];
      $targetPath = $_SERVER['DOCUMENT_ROOT'] . $url_path . 'vocabs/'.$_FILES['vocab']['name'];

      // move file and optimize
      if ( move_uploaded_file($sourcePath,$targetPath) ){
        echo "Vocab uploaded... ";
      } else {
        echo "Vocab NOT uploaded!... ";

        echo '<pre>';
        // print_r($_SERVER);
        // echo $targetPath;
        echo '</pre>';
      }
    }
  }

}
?>