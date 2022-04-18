import { Integrations as Integrations$1, init as init$1, configureScope } from '@sentry/react';
export * from '@sentry/react';
import { BrowserTracing, defaultRequestInstrumentationOptions } from '@sentry/tracing';
export { BrowserTracing } from '@sentry/tracing';
import { nextRouterInstrumentation } from './performance/client.js';
export { nextRouterInstrumentation } from './performance/client.js';
import { buildMetadata } from './utils/metadata.js';
import { addIntegration } from './utils/userIntegrations.js';

var Integrations = { ...Integrations$1, BrowserTracing };

/** Inits the Sentry NextJS SDK on the browser with the React SDK. */
function init(options) {
  buildMetadata(options, ['nextjs', 'react']);
  options.environment = options.environment || process.env.NODE_ENV;

  // Only add BrowserTracing if a tracesSampleRate or tracesSampler is set
  var integrations =
    options.tracesSampleRate === undefined && options.tracesSampler === undefined
      ? options.integrations
      : createClientIntegrations(options.integrations);

  init$1({
    ...options,
    integrations,
  });

  configureScope(scope => {
    scope.setTag('runtime', 'browser');
    var filterTransactions = event => (event.type === 'transaction' && event.transaction === '/404' ? null : event);
    filterTransactions.id = 'NextClient404Filter';
    scope.addEventProcessor(filterTransactions);
  });
}

var defaultBrowserTracingIntegration = new BrowserTracing({
  tracingOrigins: [...defaultRequestInstrumentationOptions.tracingOrigins, /^(api\/)/],
  routingInstrumentation: nextRouterInstrumentation,
});

function createClientIntegrations(integrations) {
  if (integrations) {
    return addIntegration(defaultBrowserTracingIntegration, integrations, {
      BrowserTracing: { keyPath: 'options.routingInstrumentation', value: nextRouterInstrumentation },
    });
  } else {
    return [defaultBrowserTracingIntegration];
  }
}

export { Integrations, init };
//# sourceMappingURL=index.client.js.map
