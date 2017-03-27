<?php

#
# Example login management - header file .. included by the main "index.html" file 
#
# 1. This page redirects to login until admin passwd is given, then will load as normal
#
# 2. If a translator is trying to login (not admin), keep this info in a php session
#
# 3. Admin and translators each have their own passwords, that is why
#
# 4. All users have unique pwords so only admin can edit english, and translators
#    cant edit each others work

session_start();

## uncomment the 3 lines below to disable user logins
## also see validate_user.inc.php
/*
require_once('config.inc.php');
$_SESSION['login'] = true;
$_SESSION['page_dir'] = $page_dir;
*/


# if not logged in
if (!isset($_SESSION['login'])){
  # if translation URL
  if(isset($_GET['translate'])){
    
    # update to latest translate value
    $_SESSION['translate'] = $_GET['translate'];

  } else { 

    # no ?translate=foo in URL
    # so remove translator login attempt session
    # this will force login.php back to default behaviour (to ask for admin passwd)

    unset($_SESSION['translate']);
  }

  # user not logged in, redirect to login page
  header('Location: cms/api/login.php');
  die;

#
# user is logged in
#
} else {

  $page_dir = basename(dirname($_SERVER['SCRIPT_FILENAME']));  # will equal "demo" .. or "my-page-name"

  # user is logged in but login is for another page
  if ($_SESSION['page_dir'] != $page_dir){

    # log them out
    header('Location: cms/api/logout.php?error=wrong_page');
    die;
  }

  # we deal with logged in translators here
  if (isset($_SESSION['translate'])){

    
    if (!isset($_GET['translate'])){

      # ?translate=foo is not present in their URL

      # so their translation editor will not load up... 
      # so we will show preview.html page, instead of the editable index.html
      header('Location: preview.html');
      die;

    } else if ($_SESSION['translate'] != $_GET['translate']){

      # if translator logged in but trying to get the wrong LANG
  
      # logout the translator out
      header('Location: cms/api/logout.php?error=wrong_translation');
      die;

    }

    

  }

}

?>