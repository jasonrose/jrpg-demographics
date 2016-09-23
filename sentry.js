var sentry = require('sentry');

sentry.watchRegExp('.', /(data\.js)|(src\/.*\.json)|(src\/.*\.pug)/, 'npm run pug-dev');
