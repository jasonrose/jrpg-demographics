var sentry = require('sentry');

sentry.watchRegExp('src', /(data\.js)|(.*\.json)|(.*\.pug)/, 'npm run pug-dev');
