exports._createStarExport = function _createStarExport(obj) {
  Object.keys(obj)
    .filter(key => key !== 'default' && key !== '__esModule')
    .forEach(key => {
      if (exports.hasOwnProperty(key)) {
        return;
      }
      exports[key] = obj[key];
    });
};
