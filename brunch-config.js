exports.config = {
  paths: {
    'public': 'www',
    /* files to combine and minify */
    'watched': ['src/app', 'src/cms/', 'vendor']
  },

  conventions: {
    /* custom asset folders - src/app and src/cms */
    assets: [
      /* src/app/assets and src/cms/assets */
      /^src\/(app|cms)\/assets[\\/]/
    ]
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
        'js/app.js': /^src\/app/,
        'cms/js/cms.js': /^src\/cms/,
        'js/vendor.js': /^(vendor|bower_components)/,
        'cms/js/vendor.js': /^src\/cms\/js\/vendor/,
        'test/js/test.js': /^test(\/|\\)(?!vendor)/,
        'test/js/test-vendor.js': /^test(\/|\\)(?=vendor)/
      },
      order: {
        before: []
      }
    },

    stylesheets: {
      joinTo: {
        'css/app.css': /^src\/app/,
        'cms/css/cms.css': /^src\/cms/,
        'css/vendor.css': /^(vendor|bower_components)/,
        'cms/css/vendor.css': /^src\/cms\/css\/vendor/,
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
    // plugin to move /src/cms/templates/* to /www/cms/templates/*
    assetsmanager: {
        copyTo: {
            'cms/templates/' : [ 'src/cms/templates/*' ],
        }
    },
  }

};