<?php

ini_set('display_errors',1);
error_reporting(E_ALL);

if ($_POST['savetozip'] == 'true'){

  // get root dir of the page being edited (/my-page-name/)
  $url_path = pathinfo(parse_url($_SERVER['HTTP_REFERER'])['path'], PATHINFO_DIRNAME) . '/';
  if ($url_path == '//'){
    $url_path = parse_url($_SERVER['HTTP_REFERER'])['path'];
  }

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