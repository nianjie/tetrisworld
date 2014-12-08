exports.config = {
  allScriptsTimeout: 11000,
  
  seleniumAddress: 'http://127.0.0.1:4444/wd/hub',

  specs: [
    '*.js'
  ],

  capabilities: {
    'browserName': 'phantomjs',
    'phantomjs.binary.path': require('phantomjs').path,
    'phantomjs.cli.args': ['--webdriver=8910', '--webdriver-loglevel=DEBUG', '--webdriver-logfile=phantomjs.log']
  },

  chromeOnly: false,

  baseUrl: 'http://localhost:8000/app/',

  framework: 'jasmine',

  jasmineNodeOpts: {
      isVerbose: true,
      showColors: true,
      includeStackTrace: true,
      defaultTimeoutInterval: 30000
  }
};
