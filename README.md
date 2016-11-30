Project
-------------

* This is two apps - a static page and a CMS addon for editing the page.
* The static page is in `src/app/`, and the CMS is in `src/cms`
* The static page and its assets are built to `www/`
* The CMS is built to `www/cms/`
* The static page is blank by default, and you use the CMS to update the page.

-------------

Fork this repo, download, and then:

1. Installation: you only need to do this once!

  - open a terminal in this folder and run this command:

        ./setup-host-ubuntu-env.sh


2. Project setup: do this every time you login or boot up your PC

  a. in a terminal, run the following commands:

        npm install
        bower update
        vagrant up

  b. run the following command to build the app and cms

        brunch build


3. Do your dev work:

  a. in a terminal, run this command to auto build the app after each save:

        brunch watch

  b. open the following address in your preferred browser:

        http://localhost:8080/

  c. make a new git branch for your new feature/bugfix/changes:

        git checkout -b my_new_feature

  d. edit the code in `src/` and save, view in your browser

  e. also run the tests:

       brunch build --env=test

  f. if they pass and you're happy, save to github:

       git add .
       git commit -m 'my message'
       git push origin master


