exports._interopRequireWildcard = function _interopRequireWildcard(moduleExports) {
  if (moduleExports && moduleExports.__esModule) {
    return moduleExports;
  } else {
    var newModuleExports = {};
    if (moduleExports != null) {
      for (var key in moduleExports) {
        if (moduleExports.hasOwnProperty(key)) {
          newModuleExports[key] = moduleExports[key];
        }
      }
    }
    newModuleExports.default = moduleExports;
    return newModuleExports;
  }
};
