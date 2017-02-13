<?php

// example/test/demo page for creating new editable pages

// ini_set('display_errors',1);
// error_reporting(E_ALL);

$header = "Create a new page";

// user has submitted
if ($_POST['url'] != ''){

  // validation here
  // ...
  //

  // no errors, so build page here

  $oldfile = $_SERVER['DOCUMENT_ROOT'] . '/demo/index.html';
  $newfile = $_SERVER['DOCUMENT_ROOT'] . '/' . basename($_SERVER['HTTP_REFERER']) . '/' . $_POST['url'].'.html';

  if (file_exists($newfile)){
    header('Location: '.$newfile);
  }

  $src  = $_SERVER['DOCUMENT_ROOT']."/demo";
  $dest = $_SERVER['DOCUMENT_ROOT'] . '/' . $_POST['url'];


  //set a default password for the page
  $password = 'demo';
  // replace with the passwd given by user
  if (isset($_POST['password'])) {
    $password = $_POST['password'];
  }

  // create the script which will hold the passwd
  $passwd_script = '<?php 

if ( isset($_POST["get_passwd"]) ){

  # CMS admin is asking for passwd over AJAX, echo it
  echo "'.$password.'";

} else {

  # login.php is requiring the passwd, so give it the $var
  $valid_password = "'.$password.'";

}

?>';

  // where to put the script
  $passwd_script_path = $dest."/cms/api/passwds/admin.php";

  //
  // here we copy www/demo/ to the new folder name
  //
  if ( !exec("cp -Rv ". $src . "/ " . $dest . "/") ) {
    echo "copy failed";
    exit ();
  } else {

    // copy was a success, now add the custom password for this page
    $myfile = fopen($passwd_script_path, "w");
    fwrite($myfile, $passwd_script);
    fclose($myfile);
  }


  // page was built, so output the details
  $header = "Page created";

  $fullUrl  = 'http://' . $_SERVER['SERVER_NAME'] . '/' . $_POST['url'] . '/';

  $html = '
  <div class="box">
    <div class="box-block">
      <span class="span">Article URL:</span>
      <div class="field">'.$fullUrl.'</div>
    </div>
    <div class="btn-block">
      <button name="create" type="submit" id="submit-btn" value="create"><a href="./'.$_POST['url'].'">Edit page</a></button>
    </div>
  </div>';
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <meta name="title" content="Create a new page">
  <meta name="description" content="Add page details and create it.">
  <title>Create a page</title>
  <style>
    
    body, form, label, span, input, button {
      box-sizing: border-box;
      color:  #ddd;
      font-weight:  bold;
      font-family:  Sans-serif, serif;
      font-size: 1.2rem;
      line-height: 1.4rem;
    }

    body {
      background-color: #222;
      color:  #eee;
      margin: 0;
      letter-spacing: 1px;
    }

    form, .box {
      background-color: #333;
      margin: 0 auto;
      padding: 20px;
      position: relative;
      max-width: 450px;
    }

    .form-block, .box-block {
      box-sizing: border-box;
      padding: 0;
      margin: 0;
      width: 100%;
    }

    .form-block p, .box-block p {
      display:  block;
      text-align: left;
      color: #777;
      font-size: 1rem;
    }

    .span {
      display: inline-block;
      padding: 16px;
      width: 100%;
      min-width: 280px;
      text-align: left;
    }

    .box .input, input[type="text"], input[type="password"], input[type="date"], input[type="datetime"], input[type="datetime-local"] {
      background-color: #444;
      border: 0;
      color: #eee;
      min-width: 260px;
      padding: 8px 12px;
      width: 100%;
    }

    .btn-block {
      margin-top: 40px;
      text-align: center;
    }

    button {
      background-color: #222;
      border: 0;
      color:  #fff;
      padding: 16px;
    }

    button:hover {
      background-color: #0074D9;
      cursor: pointer;
    }

    .field {
      background-color:  #444;
      padding: 16px;
    }

    button a {
      color:  #fff;
      text-decoration: none;
    }

  </style>
</head>

<body>

<center>
  <h1><?php echo $header; ?></h1>
</center>

  <?php 
  if ($_POST['url'] != ''){
    // show form results as confirmation
    echo $html;
  } else {
  // show the form
  ?>

  <form action="" method="post">

    <div class="form-block">
    <div class="form-block">
      <label>
        <span class="span">Article URL:</span>
        <input type="text" tabindex="1" name="url" pattern="^[a-zA-Z0-9\-]+$" value="<?php echo $_POST['url']; ?>" placeholder="my-article-name" required="required">
      </label>
      <p>The page URL. Accepts only letters A-Z, numbers and dashes.</p>
      <label>
        <span class="span">Password:</span>
        <input type="password" tabindex="1" name="password" value="" required="required">
      </label>
      <p>The login password for this page.</p>
    </div>

    <div class="btn-block">
      <?php
      if ($_POST['continue'] != ''){ // user has clicked first btn, now show "create page" confirmation
      ?>
      <button name="create" type="submit" id="submit-btn" value="create">Create page</button>
      <?php
      } else { // user not yet sbmitted the form, show the "continue" button first
      ?>
        <button name="continue" type="submit" id="submit-btn" value="continue">Continue</button>
      <?php
      }
      ?>
    </div>
  </form>

  <?php
  }
  ?>
</body>
</html>