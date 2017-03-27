<?php

ini_set('display_errors',1);
error_reporting(E_ALL);

require_once('validate_user.inc.php');



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
  exec("cd $root; tar -zcvf downloads/$name.tar.gz --exclude='.htaccess' --exclude='$name/vocabs' --exclude='*.php' --exclude='$name/cms' --exclude='$name/test' --exclude='$name/*.map' --exclude='$name/index.html' --exclude='$name/templates' --transform='flags=r;s|preview.html|index.html|' $name");
  // we now have a bundled version of the page, excluding the CMS, in "page-name.tar.gz"
  echo "/downloads/$name.tar.gz";

}

?>