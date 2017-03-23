# brunch_config.js
See [brunch.io](http://brunch.io/docs/config) for more info

```js
/*

This config can use the following ways to match files/dirs etc..

Examples:

- regular expressions:           /\.js$/,
- strings with glob wildcards:   'path/to/*.css',
- anymatch patterns:             /^startDir\/(one|other)\/lastDir[\\/]/  (etc),
- function:                      function(path) {  var files; ...; return files; },
- array of any of the above:     [
    'path/to/specific/file.js',  // include specific file
    'any/**.js',                 // all files with .js extension
    /\.test\.js$/,               // all files with .test.js extension
    path => path.includes('tmp') // contains `tmp` substring
  ]

Defaults for Brunch config found in source: 
https://github.com/brunch/brunch/blob/master/lib/utils/config-validate.js

*/

```
Get json data about the default page to be built, used later to compile html from templates
```js
var pageConfig = require('./src/app/js/page_config.js');

```
#### processEnv()  
You can pass env vars to brunch at build time..
So lets get the vars now and setup anything we need to
```js
(function processEnv(){
  /* 
   * if `BUILD=with-tests brunch b`
   * or `npm test` was used at command line */
  if (process.env.BUILD == 'with-tests') {
    /*
     * include a test-runner `<script>` in index.html (in assets)
     * to do this, we update default pageData..
     * mustache will then include the test-runner 
     * partial if we set var 'test' below */
    pageConfig.test = true;
  }
})();



```
## config starts below
```js
exports.config = {

  /* paths defines the src and output dirs */
  paths: {
    /* the dir to build our src code to */
    'public': 'www/demo',
    /* the files to combine and minify */
    'watched': ['src'],
    /* ignored: () => false, // override defaults for no ignored files */
  },

  /* define dir locations of assets and vendor files */
  conventions: {
    /* assets are always copied (unmodified) to output dir (www/demo) */
    assets: [
      /^src\/(app|cms)\/assets[\\/]/
    ],
    /* set the vendor dirs for the 3rd party js, css, etc  */
    vendor: [
      /^src\/(app|cms)\/vendor[\\/]/,
      /^(bower_components|node_modules)[\\/]/
    ],
    /* by default, files starting with _ are ignored */
  },

  /* JS module setup, see http://brunch.io/docs/config#-modules- */
  modules: {
    /* use brunchs built in commonjs module bundler, better supports npm */
    definition: 'commonjs',
    wrapper: 'commonjs',
    /* 
     * nicer module paths for require(): 
     * Make js modules available at 'module.js', 
     * instead of '/src/app/cms//modules/' .. etc) */
    nameCleaner: path => path.replace(/^src\/(app|cms|test)\/js\//, '')  
  },

  /* enable full npm support in brunch */
  npm: { 
    enabled: true,
  },

  /* the hmtl, css, js files to combine, minify, etc  */
  files: {
    javascripts: {
      joinTo: {
        /* combine js files to 'js/app.js' */
        'js/app.js': /^src\/app\/js/,
        /* combine js files to 'js/vendor.js' */
        'js/vendor.js': [ 
          /^src\/app\/vendor/,
          /^(bower_components)/,
        ],
        /* combine js files to 'cms/js/cms.js' */
        'cms/js/cms.js': /^src\/cms\/js/,
        /* combine js files to 'cms/js/vendor.js' */
        'cms/js/vendor.js': [ 
          /^src\/cms\/vendor/,
          /^(node_modules)/,
        ],
        /* combine js files to 'test/test.js' */
        'test/test_runner.js': /^src\/test\/js/,
        /* combine js files to 'test/vendor.js' */
        'test/vendor.js': /^src\/test\/vendor\/js/
      },
      order: {
        /* files to combine first */
        before: [],
        /* files to combine last */
        after: [],
      }
    },

    stylesheets: {
      joinTo: {
        /* combine scss to css/app.css */
        'css/app.css': /^src\/app\/css/,
        /* combine scss to css/vendor.css */
        'css/vendor.css': [ 
          /^src\/app\/vendor/,
          /^bower_components/,
        ],
        /* combine scss to cms/css/cms.css */
        'cms/css/cms.css': /^src\/cms\/css/,
        /* combine scss to cms/css/vendor.css */
        'cms/css/vendor.css': /^src\/cms\/vendor/,
      },
      order: {
        /* files to combine first */
        before: ['normalize.css', 'skeleton.css'],
        /* files to combine last */
        after: []
      }
    }
  },

  plugins: {
    /* check js valid on build */
    eslint: {
      "env": {
        "browser": true
      },
      pattern: /^src\/cms\/.*\.js?$/,
      warnOnly: true,
      config: {rules: {'array-callback-return': 'warn'}}
    },
    /* minify html as well as the js and css */
    htmlPages: {
      compileAssets: true,
    },
    /* compile /src/app/templates/*.tmpl to /src/app/assets/*.html */
    staticHandlebars: {
      outputDirectory: 'src/app/assets',
      templatesDirectory: 'src/app/templates',
      /* settings for "partials" = the tmpls included in main templates file */
      partials: {
        directory: 'src/app/templates',
        prefix: '_'
      },
      data: pageConfig,
    },
    /* manually copy files after build */
    assetsmanager: {
        copyTo: {
          '/templates/' : [ 'src/app/templates/*.tmpl' ],
          '/cms/api/' : [ 'src/cms/api/*.php' ],
          '/cms/api/passwds/' : [ 'src/cms/api/passwds/*.php' ],
          '/cms/images/previews/' : [ 'src/app/templates/previews/*.png' ],
        }
    },
    /* after compile, run any shell commands (or `node my_node_cmd`) */
    afterBrunch: [
      'mkdir -p www/downloads',
      'chmod 777 www/downloads',
      'chmod 777 www/demo',
      'chmod 777 www/demo/images',
      'chmod 777 www/demo/videos',
      'chmod 777 www/demo/vocabs',
      /* move an example home page out of assets, to the web root */
      'cp src/_extra-stuff/home.php www/index.php'
    ],
  },

};
```
------------------------
Generated _Thu Mar 23 2017 01:06:40 GMT+0000 (GMT)_ from [&#x24C8; brunch-config.js](brunch-config.js "View in source")

