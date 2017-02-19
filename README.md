# Project

A scaffolding tool for building static news articles and webpages from templates.

* The pages built by this tool include a CMS which lets you:
  * add, move, delete sections, built from templates
  * edit the page contents inline
  * save the edited page and its assets (without cms) as a bundled zip

--------------------------------------------------------

### Project Structure

* This is two apps - a static page and a CMS addon for editing the page
* The static page is in `src/app/`, and the CMS is in `src/cms/`
* The static page and its assets are built to `www/demo/`
* The CMS is built to `www/demo/cms/`

--------------------------------------------------------

### Installation: you only need to do this once!

  - open a terminal in this folder and run this command:

        ./setup-host-ubuntu-env.sh

  - the above command will install Vagrant, Node, NPM, Bower, Sublime, etc
  - if you already have them, you can skip this step

--------------------------------------------------------

### Project setup and config:

  - In a terminal, run the following commands:

        npm install
        bower update
        vagrant up --provision

  - Run the following command to build the source to `www/`

        brunch build

--------------------------------------------------------

### Do your dev work:

  - in a terminal, run this command to auto build the app after each save:

        brunch watch

  - Open the following address in your preferred browser:

        http://localhost:8080/

  - Make a new git branch for your new feature/bugfix:

        git checkout -b my_new_branch

  - Edit the code in `src/` and save, then view in your browser

  - *If any `.tmpl` files were changed, restart `brunch watch` to recompile them!*

--------------------------------------------------------

### Adding new dependencies:

  - Install static page deps with:   `bower install --save`
    - these end up in `www/demo/js/vendor.js`

  - Install CMS deps with:   `npm install --save`
    - these end up in `www/demo/cms/js/vendor.js`

  - Install build tool deps with:   `npm install --save-dev`
    - use this for things like brunch plugins and addons, etc

--------------------------------------------------------

### Testing and saving:
  
##### Running Tests:

  - Write tests in `src/test/js/tests.js`
  - Build source and run tests in the browser:

        npm test

  You can see the tests in the console window of your browser.
  Tests are re-run automatically each time you update any files in `/src` and save, or manually refresh the page.

  NOTE: The CMS will not not use localStorage if `npm test` is running. 
  This gives the tests a fresh page to work on.

  
##### Test Driven Development (TDD)

  Simply write tests while `npm test` is running:
  
  - Add a test then save - it'll fail. Then add some code to fix the test, save again, and see test passes in the browsers console window.
  
  As long as `npm test` is running, the browser will auto-refresh at each step and re-run your tests in the console.


##### Device Testing:

  To view on other devices, you can run the following command:

        vagrant share --name myapp

  You (and anyone else!) can then visit the following URL on any device:

        http://myapp.vagrantshare.com


##### Saving your changes to the source:

  If the tests pass and you're happy, save to github:

        git add .
        git commit -m 'my message'
        git push origin my_new_branch

--------------------------------------------------------

### Example Use Cases

  * Used as an online tool:
      - build source to `www/` using `brunch build --production`
      - upload contents of `www/` to `dev.example.com`
      - visit `dev.example.com`
      - enter desired article name and click 'continue' to create it
      - then edit article as required using the inline CMS
      - download zip of finished page using the CMS main menu
      - upload the zip contents to `live.example.com/my-page-name/`

  * As an in-house scaffolding tool:
      - create a local branch of this repo, called 'my-page-name'
      - customise source files as required (`src/app/templates/index.tmpl`, etc )
      - build app to www/ using `brunch build`
      - view page locally, test it, etc
      - repeat above steps until page is ready
      - download zip of finished page using the CMS main menu
      - upload contents of zip to http://example.com/my-page-name/
