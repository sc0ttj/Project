exports.config = {
  paths: {
    'public': 'www',
    /* files to combine and minify */
    'watched': ['src']
  },

  conventions: {
    assets: [
      /^src\/(app|cms)\/assets[\\/]/
    ],
    vendor: [
      /^src\/(app|cms)\/vendor[\\/]/,
      /^(bower_components|node_modules)[\\/]/
    ],
  },

  modules: {
    definition: 'commonjs',
    wrapper: 'commonjs',
    nameCleaner: path => path.replace(/^src\/(app|cms)\/js\//, '')  
  },

  npm: { enabled: true },

  files: {
    javascripts: {
      joinTo: {
        'js/app.js': /^src\/app\/js/,
        'js/vendor.js': [ 
          /^src\/app\/vendor/,
          /^(bower_components|node_modules)/,
        ],
        'cms/js/cms.js': /^src\/cms\/js/,
        'cms/js/vendor.js': /^src\/cms\/vendor/,
        'test/js/test.js': /^test(\/|\\)(?!vendor)/,
        'test/js/test-vendor.js': /^test(\/|\\)(?=vendor)/
      },
      order: {
        before: []
      }
    },

    stylesheets: {
      joinTo: {
        'css/app.css': /^src\/app\/css/,
        'css/vendor.css': [ 
          /^src\/app\/vendor/,
          /^bower_components/,
        ],
        'cms/css/cms.css': /^src\/cms\/css/,
        'cms/css/vendor.css': /^src\/cms\/vendor/,
        'test/css/test.css': /^test/
      },
      order: {
        before: ['normalize.css', 'skeleton.css'],
        after: []
      }
    }
  },

  plugins: {
    eslint: {
      "env": {
        "browser": true
      },
      pattern: /^src\/cms\/.*\.js?$/,
      warnOnly: true,
      config: {rules: {'array-callback-return': 'warn'}}
    },
    // assetsmanager: {
    //     copyTo: {
    //       'cms/templates/' : [ 'src/cms/js/templates/*.tmpl' ],
    //     }
    // },
  },

  overrides: {
    // brunch build --env nocms
    nocms: {
      paths: {
        'public': 'www',
        'watched': ['src/app']
      },
      conventions: {
        assets: [
          /^src\/app\/assets[\\/]/
        ],
      },
    files: {
      javascripts: {
        joinTo: {
          'js/app.js': /^src\/app\/js/,
          'js/vendor.js': [ 
            /^bower_components/,
            /^src\/app\/vendor/,
          ],
          'test/js/test.js': /^test(\/|\\)(?!vendor)/,
          'test/js/test-vendor.js': /^test(\/|\\)(?=vendor)/
        },
        order: {
          before: []
        }
      },
    }
  },
  },

};