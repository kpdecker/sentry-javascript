Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const hub_1 = require('@sentry/hub');
const integrations_1 = require('@sentry/integrations');
const node_1 = require('@sentry/node');
const tracing_1 = require('@sentry/tracing');
const utils_1 = require('@sentry/utils');
const domainModule = require('domain');
const path = require('path');
const flags_1 = require('./flags');
const metadata_1 = require('./utils/metadata');
const userIntegrations_1 = require('./utils/userIntegrations');
tslib_1.__exportStar(require('@sentry/node'), exports);
// Here we want to make sure to only include what doesn't have browser specifics
// because or SSR of next.js we can only use this.
var react_1 = require('@sentry/react');
exports.ErrorBoundary = react_1.ErrorBoundary;
exports.withErrorBoundary = react_1.withErrorBoundary;
const domain = domainModule;
// During build, the main process is invoked by
//   `node next build`
// and child processes are invoked as
//   `node <path>/node_modules/.../jest-worker/processChild.js`.
// The former is (obviously) easy to recognize, but the latter could happen at runtime as well. Fortunately, the main
// process hits this file before any of the child processes do, so we're able to set an env variable which the child
// processes can then check. During runtime, the main process is invoked as
//   `node next start`
// or
//   `node /var/runtime/index.js`,
// so we never drop into the `if` in the first place.
let isBuild = false;
if (process.argv.includes('build') || process.env.SENTRY_BUILD_PHASE) {
  process.env.SENTRY_BUILD_PHASE = 'true';
  isBuild = true;
}
const isVercel = !!process.env.VERCEL;
/** Inits the Sentry NextJS SDK on node. */
function init(options) {
  var _a, _b;
  if (options.debug) {
    utils_1.logger.enable();
  }
  flags_1.IS_DEBUG_BUILD && utils_1.logger.log('Initializing SDK...');
  if (sdkAlreadyInitialized()) {
    flags_1.IS_DEBUG_BUILD && utils_1.logger.log('SDK already initialized');
    return;
  }
  metadata_1.buildMetadata(options, ['nextjs', 'node']);
  options.environment = options.environment || process.env.NODE_ENV;
  addServerIntegrations(options);
  // Right now we only capture frontend sessions for Next.js
  options.autoSessionTracking = false;
  // In an ideal world, this init function would be called before any requests are handled. That way, every domain we
  // use to wrap a request would inherit its scope and client from the global hub. In practice, however, handling the
  // first request is what causes us to initialize the SDK, as the init code is injected into `_app` and all API route
  // handlers, and those are only accessed in the course of handling a request. As a result, we're already in a domain
  // when `init` is called. In order to compensate for this and mimic the ideal world scenario, we stash the active
  // domain, run `init` as normal, and then restore the domain afterwards, copying over data from the main hub as if we
  // really were inheriting.
  const activeDomain = domain.active;
  domain.active = null;
  node_1.init(options);
  const filterTransactions = event => {
    return event.type === 'transaction' && event.transaction === '/404' ? null : event;
  };
  filterTransactions.id = 'NextServer404Filter';
  node_1.configureScope(scope => {
    scope.setTag('runtime', 'node');
    if (isVercel) {
      scope.setTag('vercel', true);
    }
    scope.addEventProcessor(filterTransactions);
  });
  if (activeDomain) {
    const globalHub = hub_1.getHubFromCarrier(hub_1.getMainCarrier());
    const domainHub = hub_1.getHubFromCarrier(activeDomain);
    // apply the changes made by `nodeInit` to the domain's hub also
    domainHub.bindClient(globalHub.getClient());
    (_a = domainHub.getScope()) === null || _a === void 0 ? void 0 : _a.update(globalHub.getScope());
    // `scope.update()` doesn’t copy over event processors, so we have to add it manually
    (_b = domainHub.getScope()) === null || _b === void 0 ? void 0 : _b.addEventProcessor(filterTransactions);
    // restore the domain hub as the current one
    domain.active = activeDomain;
  }
  flags_1.IS_DEBUG_BUILD && utils_1.logger.log('SDK successfully initialized');
}
exports.init = init;
function sdkAlreadyInitialized() {
  const hub = node_1.getCurrentHub();
  return !!hub.getClient();
}
function addServerIntegrations(options) {
  // This value is injected at build time, based on the output directory specified in the build config
  const distDirName = global.__rewriteFramesDistDir__ || '.next';
  // nextjs always puts the build directory at the project root level, which is also where you run `next start` from, so
  // we can read in the project directory from the currently running process
  const distDirAbsPath = path.resolve(process.cwd(), distDirName);
  const SOURCEMAP_FILENAME_REGEX = new RegExp(utils_1.escapeStringForRegex(distDirAbsPath));
  const defaultRewriteFramesIntegration = new integrations_1.RewriteFrames({
    iteratee: frame => {
      var _a;
      frame.filename =
        (_a = frame.filename) === null || _a === void 0 ? void 0 : _a.replace(SOURCEMAP_FILENAME_REGEX, 'app:///_next');
      return frame;
    },
  });
  if (options.integrations) {
    options.integrations = userIntegrations_1.addIntegration(defaultRewriteFramesIntegration, options.integrations);
  } else {
    options.integrations = [defaultRewriteFramesIntegration];
  }
  if (tracing_1.hasTracingEnabled(options)) {
    const defaultHttpTracingIntegration = new node_1.Integrations.Http({ tracing: true });
    options.integrations = userIntegrations_1.addIntegration(defaultHttpTracingIntegration, options.integrations, {
      Http: { keyPath: '_tracing', value: true },
    });
  }
}
var config_1 = require('./config');
exports.withSentryConfig = config_1.withSentryConfig;
var withSentry_1 = require('./utils/withSentry');
exports.withSentry = withSentry_1.withSentry;
// Wrap various server methods to enable error monitoring and tracing. (Note: This only happens for non-Vercel
// deployments, because the current method of doing the wrapping a) crashes Next 12 apps deployed to Vercel and
// b) doesn't work on those apps anyway. We also don't do it during build, because there's no server running in that
// phase.)
if (!isVercel && !isBuild) {
  // Dynamically require the file because even importing from it causes Next 12 to crash on Vercel.
  // In environments where the JS file doesn't exist, such as testing, import the TS file.
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { instrumentServer } = require('./utils/instrumentServer.js');
    instrumentServer();
  } catch (err) {
    flags_1.IS_DEBUG_BUILD && utils_1.logger.warn(`Error: Unable to instrument server for tracing. Got ${err}.`);
  }
}
//# sourceMappingURL=index.server.js.map
