Object.defineProperty(exports, '__esModule', { value: true });

var webpack = require('./webpack.js');

/**
 * Add Sentry options to the config to be exported from the user's `next.config.js` file.
 *
 * @param userNextConfig The existing config to be exported prior to adding Sentry
 * @param userSentryWebpackPluginOptions Configuration for SentryWebpackPlugin
 * @returns The modified config to be exported
 */
function withSentryConfig(userNextConfig = {}, userSentryWebpackPluginOptions = {}) {
  // If the user has passed us a function, we need to return a function, so that we have access to `phase` and
  // `defaults` in order to pass them along to the user's function
  if (typeof userNextConfig === 'function') {
    return function (phase, defaults) {
      var materializedUserNextConfig = userNextConfig(phase, defaults);
      return {
        ...materializedUserNextConfig,
        webpack: webpack.constructWebpackConfigFunction(materializedUserNextConfig, userSentryWebpackPluginOptions),
      };
    };
  }

  // Otherwise, we can just merge their config with ours and return an object.
  return {
    ...userNextConfig,
    webpack: webpack.constructWebpackConfigFunction(userNextConfig, userSentryWebpackPluginOptions),
  };
}

exports.withSentryConfig = withSentryConfig;
//# sourceMappingURL=index.js.map
