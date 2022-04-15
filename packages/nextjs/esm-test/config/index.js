import { constructWebpackConfigFunction } from './webpack';
/**
 * Add Sentry options to the config to be exported from the user's `next.config.js` file.
 *
 * @param userNextConfig The existing config to be exported prior to adding Sentry
 * @param userSentryWebpackPluginOptions Configuration for SentryWebpackPlugin
 * @returns The modified config to be exported
 */
export function withSentryConfig(userNextConfig = {}, userSentryWebpackPluginOptions = {}) {
  // If the user has passed us a function, we need to return a function, so that we have access to `phase` and
  // `defaults` in order to pass them along to the user's function
  if (typeof userNextConfig === 'function') {
    return function (phase, defaults) {
      const materializedUserNextConfig = userNextConfig(phase, defaults);
      return Object.assign(Object.assign({}, materializedUserNextConfig), {
        webpack: constructWebpackConfigFunction(materializedUserNextConfig, userSentryWebpackPluginOptions),
      });
    };
  }
  // Otherwise, we can just merge their config with ours and return an object.
  return Object.assign(Object.assign({}, userNextConfig), {
    webpack: constructWebpackConfigFunction(userNextConfig, userSentryWebpackPluginOptions),
  });
}
//# sourceMappingURL=index.js.map
