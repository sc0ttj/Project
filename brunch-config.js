/*

sc0ttj notes:

Brunch config - see http://brunch.io/docs/config

This config can use the following ways to match files/dirs etc.. Examples:

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



// config starts below

// json data about default page to be built, used later to compile html from templates
var pageConfig = require('./src/app/js/page_config.js');

// brunch config
exports.config = {
  paths: {
    /* the dir to build our src code to */
    'public': 'www/demo',
    /* the files to combine and minify */
    'watched': ['src'],
    //ignored: () => false, // override defaults for no ignored files
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
    /* make js modules available at '/modules/' .. (instead of '/src/app/js/modules/') */
    nameCleaner: path => path.replace(/^src\/(app|cms)\/js\//, '')  
  },

  /* enable full npm support in brunch */
  npm: { 
    enabled: true,
    // get the css of installed npm modules
    // styles: {
    //   leaflet: ['dist/leaflet.css']
    // }
  },

  /* the hmtl, css, js files to combine, minify, etc  */
  files: {
    javascripts: {
      joinTo: {
        /* combine js files to 'js/app.js' */
        'js/app.js': /^src\/app\/js\/(?!enhancements)/,
        /* combine js files to 'js/enhancements.js' */
        'js/enhancements.js': /^src\/app\/js\/enhancements/,
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
        /* combine js files to 'test/js/test.js' */
        'test/js/test.js': /^test(\/|\\)(?!vendor)/,
        /* combine js files to 'test/js/test-vendor.js' */
        'test/js/test-vendor.js': /^test(\/|\\)(?=vendor)/
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
        /* combine scss to css/base.css */
        'css/base.css': /^src\/app\/css\/(?!full)/,
        /* combine scss to css/full.css */
        'css/full.css': /^src\/app\/css\/full/,
        /* combine scss to css/vendor.css */
        'css/vendor.css': [ 
          /^src\/app\/vendor/,
          /^bower_components/,
        ],
        /* combine scss to cms/css/cms.css */
        'cms/css/cms.css': /^src\/cms\/css/,
        /* combine scss to cms/css/vendor.css */
        'cms/css/vendor.css': /^src\/cms\/vendor/,
        /* combine scss to cms/css/test.css */
        'test/css/test.css': /^test/
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
          '/cms/images/previews/' : [ 'src/app/templates/previews/*.png' ],
        }
    },
    // after compile, run any shell commands (or `node my_node_cmd`)
    afterBrunch: [
      'mkdir -p www/downloads',
      'chmod 777 www/downloads',
      'chmod 777 www/demo',
      'chmod 777 www/demo/images',
      // move the example index page out of assets, to the web root
      'mv www/demo/index.php www/index.php'
    ],
  },

  /* run extra tasks on pre-compile and post-compile .. see http://brunch.io/docs/config#-hooks-*/
  // hooks: {
  //   preCompile() {
  //     console.log("About to compile...");
  //     return Promise.resolve();
  //   },
  //   onCompile(files, assets) {
  //     console.log("Compiled... Now processing..");
  //     // list files generated from the build
  //     console.log(files.map(f => f.path));
  //   },
  // },

   /* override brunch environment conventions/defaults */
  overrides: {
    /* build page without CMS (usage on command line: `brunch build --env nocms`) */
    // nocms: {
    //   paths: {
    //     'public': 'www',
    //     'watched': ['src/app']
    //   },
    //   conventions: {
    //     assets: [
    //       /^src\/app\/assets[\\/]/
    //     ],
    //   },
    //   files: {
    //     javascripts: {
    //       joinTo: {
    //         'js/app.js': /^src\/app\/js/,
    //         'js/vendor.js': [ 
    //           /^bower_components/,
    //           /^src\/app\/vendor/,
    //         ],
    //         'test/js/test.js': /^test(\/|\\)(?!vendor)/,
    //         'test/js/test-vendor.js': /^test(\/|\\)(?=vendor)/
    //       },
    //       order: {
    //         before: []
    //       }
    //     },
    //   }
    // },
  },

};