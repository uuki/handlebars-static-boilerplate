const handlebarsLayouts = require('handlebars-layouts');
const handlebarsHelpers = require('handlebars-helpers')();
const config = require('./site.config');

const handlebarsContext = {};
function _handlebarsEqualHelper(name, value, options) {
  return handlebarsContext[name] === value ? options.fn(this) : options.inverse(this);
}

function _handlebarsVariablesHelper(name, options) {
  const content = options.fn(this);
  handlebarsContext[name] = content;
}

function registerHandlersHelpers(Handlebars) {
  Handlebars.registerHelper('equal', _handlebarsEqualHelper);
  Handlebars.registerHelper('set', _handlebarsVariablesHelper);
  Object.keys(handlebarsHelpers).forEach((name) => Handlebars.registerHelper(name, handlebarsHelpers[name]));
  handlebarsLayouts.register(Handlebars);
}

function _escapeForRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function makeDataReplacements(originalData) {
  const { ...data } = originalData;

  let dataAsString = JSON.stringify(data);
  Object.keys(config.replacements).map(key => {
    dataAsString = dataAsString.replace(new RegExp(_escapeForRegex(key), 'g'), config.replacements[key]);
  });

  const result = JSON.parse(dataAsString)

  return {
    ...result,
    config: { ...config }
  };
}

module.exports = {
  makeDataReplacements,
  registerHandlersHelpers,
};
