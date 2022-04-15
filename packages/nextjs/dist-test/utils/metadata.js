Object.defineProperty(exports, '__esModule', { value: true });
const core_1 = require('@sentry/core');
const PACKAGE_NAME_PREFIX = 'npm:@sentry/';
/**
 * A builder for the SDK metadata in the options for the SDK initialization.
 * @param options sdk options object that gets mutated
 * @param names list of package names
 */
function buildMetadata(options, names) {
  options._metadata = options._metadata || {};
  options._metadata.sdk = options._metadata.sdk || {
    name: 'sentry.javascript.nextjs',
    packages: names.map(name => ({
      name: `${PACKAGE_NAME_PREFIX}${name}`,
      version: core_1.SDK_VERSION,
    })),
    version: core_1.SDK_VERSION,
  };
}
exports.buildMetadata = buildMetadata;
//# sourceMappingURL=metadata.js.map
