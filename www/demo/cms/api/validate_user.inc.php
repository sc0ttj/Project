<?php
session_start();

## uncomment the line below to disable user logins for the CMS
# also see header.inc.php
/*
return true;
*/

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
?>