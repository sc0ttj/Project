Project
==================

1. Installation: you only need to do that once!

  - open a terminal in this folder and run this command:

      ./setup-host-ubuntu-env.sh


2. Project setup: do this every time you login or boot up your PC

  a. in a terminal, run the following commands:

      npm install
      bower update
      vagrant up

  b. run the following command to build the app

      brunch build


3. Do your dev work:

  a. in a terminal, run this command to auto build the app after each save:

      brunch watch

  b. make a new git branch for your new feature/bugfix/changes:

      git checkout -b my_new_feature

  c. open the following address in your preferred browser:

      http://localhost:8080/

  d. edit the code in /app/ and save, view in your browser

  e. also run the tests, if they pass and you're happy, 

      brunch build --env=test

  f. save to github:

      git add . && git commit -m 'my message' && git push origin master


