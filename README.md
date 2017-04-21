# Project CMS

A CMS for building 'long form' news articles using a simple, browser-based UI.  
It's a very simple, open source alternative to services like [Shorthand.com](http://shorthand.com) and [Atavist.com](http://atavist.com).

* View an example article made using this CMS: [Trump-story](https://sc0ttj.github.io/Project/trump-story/)
* View the Arabic translation of the above article, also created using this CMS: [Trump-story-arabic](https://example-trump-story-arabic.netlify.com/)

Watch a quick demo:
  
[![CMS Demo Video](http://i.imgur.com/rlnKk0I.png)](https://youtu.be/RUE1-oomYek "CMS Demo Video")

The CMS features include:  
* add, move, delete article sections, based on pre-defined templates
* edit the page contents inline using a built-in WYSIWYG editor
* translate pages using a built-in translation manager
* save the edited article and its assets as a bundled zip
  
--------------------------------------------------------
  
# User Manual

## i. Requirements

Apache 2, PHP 5.5, .htaccess files allowed

## ii. Installation

Download the latest release and User Guide from the [Releases page](https://github.com/sc0ttj/Project/releases).
  
Upload contents of the `www` folder inside the `.tar.gz` file to the root folder of your PHP-enabled Apache web server.

## iii. Creating editable pages

You should now visit `http://yoursite.com/index.php` to create a new page.
  
For example, enter 'my-cool-page' into the form. Then choose a password and click 'Create'.

Your new article will be created, and then click the button to go to it.

NOTE: You could also visit `http://yoursite.com/demo/` (password is 'demo'), but it's best to create your own pages

## iv. Editing your pages

See the video above for a basic demo of how to use the CMS.

Then download the [User Guide](https://github.com/sc0ttj/Project/releases/download/v1.1.1/CMS.User.Guide.pdf) pdf.

## v. Exporting your pages

Just click 'Save to zip' in the CMS menu to save your edited article as a self-contained folder in a zip file. 

The folder in the exported zip can then be uploaded anywhere you like.

--------------------------------------------------------

# Developer Notes

See the [Wiki](https://github.com/sc0ttj/Project/wiki), or the [Developer Docs](https://github.com/sc0ttj/Project/tree/master/docs).
  
To fork, and develop this project, read the info below.

## Project Structure

* This is two apps - a static page and a CMS addon for editing the page
* The static page is in `src/app/`, and the CMS is in `src/cms/`
* The static page and its assets are built to `www/demo/`
* The CMS is built to `www/demo/cms/`

This project uses a dev environment (a VM) to spin up a pre-configured, PHP-enabled Apache webserver.  
The dev environment requires: `Vagrant and VirtualBox`.

--------------------------------------------------------

## Optional auto-setup of host and dev environment (Ubuntu only!)

Installs Vagrant, Node, NPM, Bower, Sublime, etc

  - open a terminal in this folder and run this command:

        ./setup-host-ubuntu-env.sh

  - if you already have them, you can skip this step
  - if you dont, you need to install Node, NPM, Bower, Vagrant and VirtualBox

--------------------------------------------------------

## Project setup and config:

After downloading this repo, and once you have NPM, Bower and Vagrant setup, you're ready to run the dev environment. 

  - In a terminal, run the following commands:

        npm install
        bower update
        vagrant up --provision

Now you are ready to build the CMS from source.

  - Run the following command to build the CMS source to `www/`

        brunch build

--------------------------------------------------------

## Do your dev work:

  - in a terminal, run this command to auto build the app after each save:

        brunch watch

  - Open the following address in your preferred browser:

        http://localhost:8080/

  - Make a new git branch for your new feature/bugfix:

        git checkout -b my_new_branch

  - Edit the code in `src/` and save, then view in your browser

  - *If any `.tmpl` files were changed, restart `brunch watch` to recompile them!*

--------------------------------------------------------

## Adding new dependencies:

  - Install static page deps with:   `bower install --save`
    - these end up in `www/demo/js/vendor.js`

  - Install CMS deps with:   `npm install --save`
    - these end up in `www/demo/cms/js/vendor.js`

  - Install build tool deps with:   `npm install --save-dev`
    - use this for things like brunch plugins and addons, etc

--------------------------------------------------------

## Testing and saving:
  
Write your tests in `src/test/js/tests.js`

### Running tests in the terminal:

  - Run tests in the terminal:

        npm test

  PhantomJS is required. You can install it globally with `npm install phantomjs -g`.

### Auto running tests in the browser:

  - Build source with tests included (they will run in the browser):

        npm start

You will see the tests run in the console window of your browser.

Tests will re-run automatically each time you update any files in `/src` and save the changes.

NOTE: The CMS will not use localStorage if `npm start` is running. 
This gives the tests a fresh page to work on.
  
### Test Driven Development (TDD)

Simply write tests while `npm start` is running:
  
Add a test then save, it will auto run, then fail. Then add some code to fix the test and save again. Finally, see that the test passes in the browsers console window.
  
As long as `npm start` is running, the browser will auto-refresh at each step and re-run your tests in the console window (dev tools/firebug, etc).

### Device Testing:

To view on other devices, you can run the following command:

        vagrant share --name myapp

You (and anyone else!) can then visit the following URL on any device:

        http://myapp.vagrantshare.com

### Saving your changes to GitHub:

If the tests pass and you're happy, save to github:

        git add .
        git commit -m 'my message'
        git push origin my_new_branch

--------------------------------------------------------

# Example Use Cases

  * Used as an online tool:
      - build the source to `www/`, using `brunch build --production`
      - upload contents of `www/` to `dev.example.com`
      - visit `dev.example.com`
      - enter desired article name and click 'Create' to create it
      - edit article as required using the inline CMS
      - download zip of finished page using the CMS main menu
      - upload the zip contents to `live.example.com/my-page-name/`

  * As an in-house scaffolding tool:
      - create a local branch of this repo, called 'my-page-name'
      - customise source files as required (`src/app/templates/index.tmpl`, etc )
      - build app to `www/` using `brunch build`
      - view page locally, test it, etc
      - repeat above steps until page is ready
      - download zip of finished page using the CMS main menu
      - upload contents of zip to `live.example.com/my-page-name/`
