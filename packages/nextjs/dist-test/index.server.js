Object.defineProperty(exports, '__esModule', { value: true });

var hub = require('@sentry/hub');
var integrations = require('@sentry/integrations');
var node = require('@sentry/node');
var tracing = require('@sentry/tracing');
var utils = require('@sentry/utils');
var domain$1 = require('domain');
var path = require('path');
var flags = require('./flags.js');
var metadata = require('./utils/metadata.js');
var userIntegrations = require('./utils/userIntegrations.js');
var react = require('@sentry/react');
var index = require('./config/index.js');
var withSentry = require('./utils/withSentry.js');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    for (var k in e) {
      n[k] = e[k];
    }
  }
  n.default = e;
  return Object.freeze(n);
}

var domain__namespace = /*#__PURE__*/ _interopNamespace(domain$1);
var path__namespace = /*#__PURE__*/ _interopNamespace(path);

function _optionalChain(ops) {
  let lastAccessLHS = undefined;
  let value = ops[0];
  let i = 1;
  while (i < ops.length) {
    var op = ops[i];
    var fn = ops[i + 1];
    i += 2;
    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      return undefined;
    }
    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value;
      value = fn(value);
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn((...args) => value.call(lastAccessLHS, ...args));
      lastAccessLHS = undefined;
    }
  }
  return value;
}

var domain = domain__namespace;

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

var isVercel = !!process.env.VERCEL;

/** Inits the Sentry NextJS SDK on node. */
function init(options) {
  if (options.debug) {
    utils.logger.enable();
  }

  flags.IS_DEBUG_BUILD && utils.logger.log('Initializing SDK...');

  if (sdkAlreadyInitialized()) {
    flags.IS_DEBUG_BUILD && utils.logger.log('SDK already initialized');
    return;
  }

  metadata.buildMetadata(options, ['nextjs', 'node']);
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
  var activeDomain = domain.active;
  domain.active = null;

  node.init(options);

  var filterTransactions = event => {
    return event.type === 'transaction' && event.transaction === '/404' ? null : event;
  };

  filterTransactions.id = 'NextServer404Filter';

  node.configureScope(scope => {
    scope.setTag('runtime', 'node');
    if (isVercel) {
      scope.setTag('vercel', true);
    }

    scope.addEventProcessor(filterTransactions);
  });

  if (activeDomain) {
    var globalHub = hub.getHubFromCarrier(hub.getMainCarrier());
    var domainHub = hub.getHubFromCarrier(activeDomain);

    // apply the changes made by `nodeInit` to the domain's hub also
    domainHub.bindClient(globalHub.getClient());
    _optionalChain([
      domainHub,
      'access',
      _ => _.getScope,
      'call',
      _2 => _2(),
      'optionalAccess',
      _3 => _3.update,
      'call',
      _4 => _4(globalHub.getScope()),
    ]);
    // `scope.update()` doesn’t copy over event processors, so we have to add it manually
    _optionalChain([
      domainHub,
      'access',
      _5 => _5.getScope,
      'call',
      _6 => _6(),
      'optionalAccess',
      _7 => _7.addEventProcessor,
      'call',
      _8 => _8(filterTransactions),
    ]);

    // restore the domain hub as the current one
    domain.active = activeDomain;
  }

  flags.IS_DEBUG_BUILD && utils.logger.log('SDK successfully initialized');
}

function sdkAlreadyInitialized() {
  var hub = node.getCurrentHub();
  return !!hub.getClient();
}

function addServerIntegrations(options) {
  // This value is injected at build time, based on the output directory specified in the build config
  var distDirName = global.__rewriteFramesDistDir__ || '.next';
  // nextjs always puts the build directory at the project root level, which is also where you run `next start` from, so
  // we can read in the project directory from the currently running process
  var distDirAbsPath = path__namespace.resolve(process.cwd(), distDirName);
  var SOURCEMAP_FILENAME_REGEX = new RegExp(utils.escapeStringForRegex(distDirAbsPath));

  var defaultRewriteFramesIntegration = new integrations.RewriteFrames({
    iteratee: frame => {
      frame.filename = _optionalChain([
        frame,
        'access',
        _9 => _9.filename,
        'optionalAccess',
        _10 => _10.replace,
        'call',
        _11 => _11(SOURCEMAP_FILENAME_REGEX, 'app:///_next'),
      ]);
      return frame;
    },
  });

  if (options.integrations) {
    options.integrations = userIntegrations.addIntegration(defaultRewriteFramesIntegration, options.integrations);
  } else {
    options.integrations = [defaultRewriteFramesIntegration];
  }

  if (tracing.hasTracingEnabled(options)) {
    var defaultHttpTracingIntegration = new node.Integrations.Http({ tracing: true });
    options.integrations = userIntegrations.addIntegration(defaultHttpTracingIntegration, options.integrations, {
      Http: { keyPath: '_tracing', value: true },
    });
  }
}

// Wrap various server methods to enable error monitoring and tracing. (Note: This only happens for non-Vercel
// deployments, because the current method of doing the wrapping a) crashes Next 12 apps deployed to Vercel and
// b) doesn't work on those apps anyway. We also don't do it during build, because there's no server running in that
// phase.)
if (!isVercel && !isBuild) {
  // Dynamically require the file because even importing from it causes Next 12 to crash on Vercel.
  // In environments where the JS file doesn't exist, such as testing, import the TS file.
  try {
    const { instrumentServer } = require('./utils/instrumentServer.js');
    instrumentServer();
  } catch (err) {
    flags.IS_DEBUG_BUILD && utils.logger.warn(`Error: Unable to instrument server for tracing. Got ${err}.`);
  }
}

exports.ErrorBoundary = react.ErrorBoundary;
exports.withErrorBoundary = react.withErrorBoundary;
exports.withSentryConfig = index.withSentryConfig;
exports.withSentry = withSentry.withSentry;
exports.init = init;
for (var k in node) {
  if (k !== 'default' && !exports.hasOwnProperty(k)) exports[k] = node[k];
}
//# sourceMappingURL=index.server.js.map
