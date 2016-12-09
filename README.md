#Project

* This is two apps - a static page and a CMS addon for editing the page.
* The static page is in `src/app/`, and the CMS is in `src/cms/`
* The static page and its assets are built to `www/`
* The CMS is built to `www/cms/`

Fork this repo, download, and then:

### Installation: you only need to do this once!

  - open a terminal in this folder and run this command:

        ./setup-host-ubuntu-env.sh

--------------------------------------------------------

### Project setup and config:

  - In a terminal, run the following commands:

        npm install
        bower update
        vagrant up --provision

  - Run the following command to build the app and cms

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

  - If any `.tmpl` files were changed, restart `brunch watch` to recompile them

--------------------------------------------------------

### Adding new dependencies:

  - Install static page deps with:   `bower install --save`
    - these end up in `www/js/vendor.js`

  - Install CMS deps with:   `npm install --save`
    - these end up in `www/cms/js/vendor.js`

  - Install build tool deps with:   `npm install --save-dev`
    - use this for things like brunch plugins and addons, etc

--------------------------------------------------------

### Testing and saving:
  
  - To view on other devices, you can run the following command:

        vagrant share --name myapp

  - You (and anyone else!) can then visit the following URL on any device:

        http://myapp.vagrantshare.com

  - Also run the unit tests:

       brunch test

  - If they pass and you're happy, save to github:

       git add .
       git commit -m 'my message'
       git push origin my_new_branch


