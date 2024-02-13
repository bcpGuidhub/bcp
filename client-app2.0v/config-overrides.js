const path = require('path');

module.exports = {
  paths: function (paths, env) {
    paths.SearchIndex = path.join(__dirname, 'src/util/search_index.json');
    return paths;
  }
};
