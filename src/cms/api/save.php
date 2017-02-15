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




if ($_POST['savetozip'] == 'true'){

  # get config for this page
  # returns $page_dir ... 
  require_once('config.inc.php');

  // save to zip
  $root = $_SERVER['DOCUMENT_ROOT'];            //   /var/www/html
  $name = basename($url_path);   //   /demo/ => demo

  // create a zip of the page/app that run this script
  // do not include the cms dir or the editable index file
  // rename the preview.html file to index.html
  exec("cd $root; tar -zcvf downloads/$name.tar.gz --exclude='.htaccess' --exclude='$name/vocabs' --exclude='*.php' --exclude='$name/cms' --exclude='$name/*.map' --exclude='$name/index.html' --exclude='$name/templates' --transform='flags=r;s|preview.html|index.html|' $name");
  // we now have a bundled version of the page, excluding the CMS, in "page-name.tar.gz"
  echo "/downloads/$name.tar.gz";

}

?>