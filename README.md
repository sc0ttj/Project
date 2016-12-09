Project
-------------

* This is two apps - a static page and a CMS addon for editing the page.
* The static page is in `src/app/`, and the CMS is in `src/cms`
* The static page and its assets are built to `www/`
* The CMS is built to `www/cms/`

Fork this repo, download, and then:
-------------

1. Installation: you only need to do this once!

  - open a terminal in this folder and run this command:

        ./setup-host-ubuntu-env.sh

-------------

2. Project setup and config:

  a. In a terminal, run the following commands:

        npm install
        bower update
        vagrant up --provision

  b. Run the following command to build the app and cms

        brunch build

-------------

3. Do your dev work:

  a. in a terminal, run this command to auto build the app after each save:

        brunch watch

  b. Open the following address in your preferred browser:

        http://localhost:8080/

  c. Make a new git branch for your new feature/bugfix:

        git checkout -b my_new_branch

  d. Edit the code in `src/` and save, then view in your browser

  e. If any .tmpl files are changed, restart `brunch watch` to recompile them

-------------

4. Testing and saving:
  
  a. To view on other devices, you can run the following command:

      vagrant share --name myapp

  b. You (and anyone else!) can then visit the following URL on any device:

        http://myapp.vagrantshare.com

  c. Also run the unit tests:

       brunch test

  d. If they pass and you're happy, save to github:

       git add .
       git commit -m 'my message'
       git push origin my_new_branch


