exports.config = {
  conventions: {
    assets: [
      /^src\/(app)\/assets[\\/]/,
      /^src\/(cms)\/assets[\\/]/
    ]
  },

  paths: {
    'public': 'www',
    'watched': ['src/app', 'src/cms/', 'vendor']
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
    }
  }

};