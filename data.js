var requireDirectory = require('require-directory');
var data = requireDirectory(module, './src/data');
exports.data = data;
///////////////////////////////////////////////////////////////////////////////

Object.keys(data).forEach(function (gameName) {
  var game = data[gameName];
  var metrics = {};
  game.metrics = metrics;

  metrics.sexes = {};
  var men = 0;
  var women = 0;
  var unknown = 0;
  var total = Object.keys(game.characters).length;

  Object.keys(game.characters).forEach(function (characterName) {
    var character = game.characters[characterName];
    if (character.sex === 'm') {
      men++;
    } else if (character.sex === 'f') {
      women++;
    } else {
      unknown++;
    }
  });
  metrics.sexes.malePercent = (Math.floor(men / total * 100)) + '%';
  metrics.sexes.femalePercent = (Math.floor(women / total * 100)) + '%';
  metrics.sexes.unknownPercent = (Math.floor(unknown / total * 100)) + '%';
});
