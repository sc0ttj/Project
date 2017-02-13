<?php

ini_set('display_errors',1);
error_reporting(E_ALL);

$lang = 'en';

if (isset($_POST["lang"])) {
  $lang = $_POST["lang"];

  if (isset($_POST["save_translation"])) {

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


  }


  // 
  // create a passwd for $_POST['lang']
  //
  if (isset($_POST["enable_translation"])) {

    $passwd_filename = 'passwds/' . $lang . '.php';

    // 
    // generate random 8 letter password
    //
    //https://stackoverflow.com/questions/6101956/generating-a-random-password-in-php
    $bytes = openssl_random_pseudo_bytes(4);
    $new_passwd = bin2hex($bytes);

    // should encrypt passwd here

    // build passwd script for this $lang
    $script     = '<?php 

if ( isset($_POST["get_passwd"]) ){

  # CMS admin is asking for passwd over AJAX, echo it
  echo "'.$new_passwd.'";

} else {

  # login.php is requiring the passwd, so give it the $var
  $valid_password = "'.$new_passwd.'";

}

?>';

    $handle = fopen($passwd_filename,"w");

    if ( fwrite($handle,$script) ){

      echo $new_passwd; // return the final passwd
      exit();

    } else {

      echo 'error creating passwd file "'.$passwd_filename.'"';

    }

  }


  //
  // if disabling, remove the file
  //
  if (isset($_POST["remove_translation"])) {

  }
}


?>