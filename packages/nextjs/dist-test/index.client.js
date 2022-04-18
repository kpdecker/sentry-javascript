Object.defineProperty(exports, '__esModule', { value: true });

var react = require('@sentry/react');
var tracing = require('@sentry/tracing');
var client = require('./performance/client.js');
var metadata = require('./utils/metadata.js');
var userIntegrations = require('./utils/userIntegrations.js');

var Integrations = { ...react.Integrations, BrowserTracing: tracing.BrowserTracing };

/** Inits the Sentry NextJS SDK on the browser with the React SDK. */
function init(options) {
  metadata.buildMetadata(options, ['nextjs', 'react']);
  options.environment = options.environment || process.env.NODE_ENV;

  // Only add BrowserTracing if a tracesSampleRate or tracesSampler is set
  var integrations =
    options.tracesSampleRate === undefined && options.tracesSampler === undefined
      ? options.integrations
      : createClientIntegrations(options.integrations);

  react.init({
    ...options,
    integrations,
  });

  react.configureScope(scope => {
    scope.setTag('runtime', 'browser');
    var filterTransactions = event => (event.type === 'transaction' && event.transaction === '/404' ? null : event);
    filterTransactions.id = 'NextClient404Filter';
    scope.addEventProcessor(filterTransactions);
  });
}

var defaultBrowserTracingIntegration = new tracing.BrowserTracing({
  tracingOrigins: [...tracing.defaultRequestInstrumentationOptions.tracingOrigins, /^(api\/)/],
  routingInstrumentation: client.nextRouterInstrumentation,
});

function createClientIntegrations(integrations) {
  if (integrations) {
    return userIntegrations.addIntegration(defaultBrowserTracingIntegration, integrations, {
      BrowserTracing: { keyPath: 'options.routingInstrumentation', value: client.nextRouterInstrumentation },
    });
  } else {
    return [defaultBrowserTracingIntegration];
  }
}

exports.BrowserTracing = tracing.BrowserTracing;
exports.nextRouterInstrumentation = client.nextRouterInstrumentation;
exports.Integrations = Integrations;
exports.init = init;
for (var k in react) {
  if (k !== 'default' && !exports.hasOwnProperty(k)) exports[k] = react[k];
}
//# sourceMappingURL=index.client.js.map
