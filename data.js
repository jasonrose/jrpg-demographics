var requireDirectory = require('require-directory');
var data = requireDirectory(module, './src/data');
exports.data = data;
///////////////////////////////////////////////////////////////////////////////
var platforms = {};
exports.data = platforms;

function updatePlatform (platform, game) {
  platform.games.push(game);

  if (game.year > platform.endYear) {
    platform.endYear = game.year;
  }
  if (game.year < platform.startYear) {
    platform.startYear = game.year;
  }
}

function sexesMetricVisitor (metrics) {
  var sexes = metrics.sexes || {
    femalePercent: '0%',
    malePercent: '0%',
    unknownPercent: '0%'
  };
  metrics.sexes = sexes;
  var demographics = metrics.demographics;

  sexes.malePercent = Math.floor(demographics.male / demographics.total * 100) + '%';
  sexes.femalePercent = Math.floor(demographics.female / demographics.total * 100) + '%';
  sexes.unknownPercent = Math.floor(demographics.unknownSex / demographics.total * 100) + '%';
}

function agesMetricVisitor (metrics) {
  var demographics = metrics.demographics;

  metrics.ages = {
    'child': {
      keys: 'cm cf'.split(' '),
      percent: Math.floor(demographics.child / demographics.total * 100) + '%'
    },
    'young': {
      keys: 'ym yf'.split(' '),
      percent: Math.floor(demographics.young / demographics.total * 100) + '%'
    },
    'adult': {
      keys: 'am af'.split(' '),
      percent: Math.floor(demographics.adult / demographics.total * 100) + '%'
    },
    'old': {
      keys: 'om of'.split(' '),
      percent: Math.floor(demographics.old / demographics.total * 100) + '%'
    },
    'unknown': {
      keys: 'um uf'.split(' '),
      percent: Math.floor(demographics.unknownAge / demographics.total * 100) + '%'
    }
  };
}

function rolesMetricVisitor (metrics) {
  var demographics = metrics.demographics;
  var roles = metrics.roles || {};
  roles.keys = 'balanced bruiser mage skirmisher striker'.split(' ');
  roles.keys.forEach(function (role) {
    roles[role] = Math.floor(demographics[role] / demographics.total * 100) + '%';
  });
  metrics.roles = roles;
}

function demographicMetrics (metrics, character) {
  var demographics = metrics.demographics || {
    adult: 0,
    balanced: 0,
    bruiser: 0,
    child: 0,
    female: 0,
    mage: 0,
    male: 0,
    old: 0,
    skirmisher: 0,
    striker: 0,
    total: 0,
    unknownAge: 0,
    unknownSex: 0,
    young: 0
  };
  metrics.demographics = demographics;

  demographics.total++;

  if (character.age === 'a') {
    demographics.adult++;
  } else if (character.age === 'c') {
    demographics.child++;
  } else if (character.age === 'o') {
    demographics.old++;
  } else if (character.age === 'y') {
    demographics.young++;
  } else {
    demographics.unknownAge++;
  }

  if (character.sex === 'f') {
    demographics.female++;
  }
  else if (character.sex === 'm') {
    demographics.male++;
  } else {
    demographics.unknownSex++;
  }

  demographics[character.role]++;
}

var platformVisitors = [sexesMetricVisitor, rolesMetricVisitor, agesMetricVisitor];
var gameVisitors = [sexesMetricVisitor];

Object.keys(data).forEach(function (gameName) {
  var game = data[gameName];

  var platform = platforms[game.platform] || {
    endYear: Number.MIN_VALUE,
    games: [],
    metrics: {},
    startYear: Number.MAX_VALUE,
    title: game.platform
  };
  platforms[game.platform] = platform;

  updatePlatform(platform, game);

  game.metrics = {};

  Object.keys(game.characters).forEach(function (characterName) {
    var character = game.characters[characterName];
    demographicMetrics(platform.metrics, character);
    demographicMetrics(game.metrics, character);
  });

  platformVisitors.forEach(function (visitor) {
    visitor(platform.metrics);
  });

  gameVisitors.forEach(function (visitor) {
    visitor(game.metrics);
  });
});

var platformTuples = [];
Object.keys(platforms).forEach(function (platformName) {
  var platform = platforms[platformName];
  platformTuples[platform.startYear] = platform;
});


var sortedPlatforms = {};
platformTuples.filter(function (it) { return it; }).forEach(function (platform) {
  sortedPlatforms[platform.title] = platform;
});

exports.data = sortedPlatforms;
