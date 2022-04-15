Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const react_1 = require('@sentry/react');
const tracing_1 = require('@sentry/tracing');
exports.BrowserTracing = tracing_1.BrowserTracing;
const client_1 = require('./performance/client');
const metadata_1 = require('./utils/metadata');
const userIntegrations_1 = require('./utils/userIntegrations');
tslib_1.__exportStar(require('@sentry/react'), exports);
var client_2 = require('./performance/client');
exports.nextRouterInstrumentation = client_2.nextRouterInstrumentation;
exports.Integrations = Object.assign(Object.assign({}, react_1.Integrations), {
  BrowserTracing: tracing_1.BrowserTracing,
});
/** Inits the Sentry NextJS SDK on the browser with the React SDK. */
function init(options) {
  metadata_1.buildMetadata(options, ['nextjs', 'react']);
  options.environment = options.environment || process.env.NODE_ENV;
  // Only add BrowserTracing if a tracesSampleRate or tracesSampler is set
  const integrations =
    options.tracesSampleRate === undefined && options.tracesSampler === undefined
      ? options.integrations
      : createClientIntegrations(options.integrations);
  react_1.init(Object.assign(Object.assign({}, options), { integrations }));
  react_1.configureScope(scope => {
    scope.setTag('runtime', 'browser');
    const filterTransactions = event => (event.type === 'transaction' && event.transaction === '/404' ? null : event);
    filterTransactions.id = 'NextClient404Filter';
    scope.addEventProcessor(filterTransactions);
  });
}
exports.init = init;
const defaultBrowserTracingIntegration = new tracing_1.BrowserTracing({
  tracingOrigins: [...tracing_1.defaultRequestInstrumentationOptions.tracingOrigins, /^(api\/)/],
  routingInstrumentation: client_1.nextRouterInstrumentation,
});
function createClientIntegrations(integrations) {
  if (integrations) {
    return userIntegrations_1.addIntegration(defaultBrowserTracingIntegration, integrations, {
      BrowserTracing: { keyPath: 'options.routingInstrumentation', value: client_1.nextRouterInstrumentation },
    });
  } else {
    return [defaultBrowserTracingIntegration];
  }
}
//# sourceMappingURL=index.client.js.map
