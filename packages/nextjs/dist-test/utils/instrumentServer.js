Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
/* eslint-disable max-lines */
const node_1 = require('@sentry/node');
const tracing_1 = require('@sentry/tracing');
const utils_1 = require('@sentry/utils');
const domain = require('domain');
const next_1 = require('next');
const flags_1 = require('../flags');
const { parseRequest } = node_1.Handlers;
let liveServer;
let sdkSetupComplete = false;
/**
 * Do the monkeypatching and wrapping necessary to catch errors in page routes and record transactions for both page and
 * API routes.
 */
function instrumentServer() {
  // The full implementation here involves a lot of indirection and multiple layers of callbacks and wrapping, and is
  // therefore potentially a little hard to follow. Here's the overall idea:
  // Next.js uses two server classes, `NextServer` and `Server`, with the former proxying calls to the latter, which
  // then does the all real work. The only access we have to either is through Next's default export,
  // `createNextServer()`, which returns a `NextServer` instance.
  // At server startup:
  //    `next.config.js` imports SDK ->
  //    SDK's `index.ts` runs ->
  //    `instrumentServer()` (the function we're in right now) ->
  //    `createNextServer()` ->
  //    `NextServer` instance ->
  //    `NextServer` prototype ->
  //    Wrap `NextServer.getServerRequestHandler()`, purely to get us to the next step
  // At time of first request:
  //    Wrapped `getServerRequestHandler` runs for the first time ->
  //    Live `NextServer` instance(via`this`) ->
  //    Live `Server` instance (via `NextServer.server`) ->
  //    `Server` prototype ->
  //    Wrap `Server.logError`, `Server.handleRequest`, `Server.ensureApiPage`, and `Server.findPageComponents` methods,
  //    then fulfill original purpose of function by passing wrapped version of `handleRequest` to caller
  // Whenever caller of `NextServer.getServerRequestHandler` calls the wrapped `Server.handleRequest`:
  //    Trace request
  // Whenever something calls the wrapped `Server.logError`:
  //    Capture error
  // Whenever an API request is handled and the wrapped `Server.ensureApiPage` is called, or whenever a page request is
  // handled and the wrapped `Server.findPageComponents` is called:
  //    Replace URL in transaction name with parameterized version
  const nextServerPrototype = Object.getPrototypeOf(next_1.default({}));
  utils_1.fill(nextServerPrototype, 'getServerRequestHandler', makeWrappedHandlerGetter);
}
exports.instrumentServer = instrumentServer;
/**
 * Create a wrapped version of Nextjs's `NextServer.getServerRequestHandler` method, as a way to access the running
 * `Server` instance and monkeypatch its prototype.
 *
 * @param origHandlerGetter Nextjs's `NextServer.getServerRequestHandler` method
 * @returns A wrapped version of the same method, to monkeypatch in at server startup
 */
function makeWrappedHandlerGetter(origHandlerGetter) {
  // We wrap this purely in order to be able to grab data and do further monkeypatching the first time it runs.
  // Otherwise, it's just a pass-through to the original method.
  const wrappedHandlerGetter = function () {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      if (!sdkSetupComplete) {
        // stash this in the closure so that `makeWrappedReqHandler` can use it
        liveServer = this.server;
        const serverPrototype = Object.getPrototypeOf(liveServer);
        // Wrap for error capturing (`logError` gets called by `next` for all server-side errors)
        utils_1.fill(serverPrototype, 'logError', makeWrappedErrorLogger);
        // Wrap for request transaction creation (`handleRequest` is called for all incoming requests, and dispatches them
        // to the appropriate handlers)
        utils_1.fill(serverPrototype, 'handleRequest', makeWrappedReqHandler);
        // Wrap as a way to grab the parameterized request URL to use as the transaction name for API requests and page
        // requests, respectively. These methods are chosen because they're the first spot in the request-handling process
        // where the parameterized path is provided as an argument, so it's easy to grab.
        utils_1.fill(serverPrototype, 'ensureApiPage', makeWrappedMethodForGettingParameterizedPath);
        utils_1.fill(serverPrototype, 'findPageComponents', makeWrappedMethodForGettingParameterizedPath);
        sdkSetupComplete = true;
      }
      return origHandlerGetter.call(this);
    });
  };
  return wrappedHandlerGetter;
}
/**
 * Wrap the error logger used by the server to capture exceptions which arise from functions like `getServerSideProps`.
 *
 * @param origErrorLogger The original logger from the `Server` class
 * @returns A wrapped version of that logger
 */
function makeWrappedErrorLogger(origErrorLogger) {
  return function (err) {
    // TODO add more context data here
    // We can use `configureScope` rather than `withScope` here because we're using domains to ensure that each request
    // gets its own scope. (`configureScope` has the advantage of not creating a clone of the current scope before
    // modifying it, which in this case is unnecessary.)
    node_1.configureScope(scope => {
      scope.addEventProcessor(event => {
        utils_1.addExceptionMechanism(event, {
          type: 'instrument',
          handled: true,
          data: {
            function: 'logError',
          },
        });
        return event;
      });
    });
    node_1.captureException(err);
    return origErrorLogger.call(this, err);
  };
}
// inspired by next's public file routing; see
// https://github.com/vercel/next.js/blob/4443d6f3d36b107e833376c2720c1e206eee720d/packages/next/next-server/server/next-server.ts#L1166
function getPublicDirFiles() {
  try {
    // we need the paths here to match the format of a request url, which means they must:
    // - start with a slash
    // - use forward slashes rather than backslashes
    // - be URL-encoded
    const dirContents = node_1
      .deepReadDirSync(liveServer.publicDir)
      .map(filepath => encodeURI(`/${filepath.replace(/\\/g, '/')}`));
    return new Set(dirContents);
  } catch (_) {
    return new Set();
  }
}
/**
 * Wrap the server's request handler to be able to create request transactions.
 *
 * @param origReqHandler The original request handler from the `Server` class
 * @returns A wrapped version of that handler
 */
function makeWrappedReqHandler(origReqHandler) {
  const publicDirFiles = getPublicDirFiles();
  // add transaction start and stop to the normal request handling
  const wrappedReqHandler = function (nextReq, nextRes, parsedUrl) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      // Starting with version 12.0.9, nextjs wraps the incoming request in a `NodeNextRequest` object and the outgoing
      // response in a `NodeNextResponse` object before passing them to the handler. (This is necessary here but not in
      // `withSentry` because by the time nextjs passes them to an API handler, it's unwrapped them again.)
      const req = '_req' in nextReq ? nextReq._req : nextReq;
      const res = '_res' in nextRes ? nextRes._res : nextRes;
      // wrap everything in a domain in order to prevent scope bleed between requests
      const local = domain.create();
      local.add(req);
      local.add(res);
      // TODO could this replace wrapping the error logger?
      // local.on('error', Sentry.captureException);
      local.run(() => {
        const currentScope = node_1.getCurrentHub().getScope();
        if (currentScope) {
          currentScope.addEventProcessor(event => parseRequest(event, nextReq));
          // We only want to record page and API requests
          if (tracing_1.hasTracingEnabled() && shouldTraceRequest(nextReq.url, publicDirFiles)) {
            // If there is a trace header set, extract the data from it (parentSpanId, traceId, and sampling decision)
            let traceparentData;
            if (nextReq.headers && utils_1.isString(nextReq.headers['sentry-trace'])) {
              traceparentData = tracing_1.extractTraceparentData(nextReq.headers['sentry-trace']);
              flags_1.IS_DEBUG_BUILD &&
                utils_1.logger.log(
                  `[Tracing] Continuing trace ${
                    traceparentData === null || traceparentData === void 0 ? void 0 : traceparentData.traceId
                  }.`,
                );
            }
            // pull off query string, if any
            const reqPath = utils_1.stripUrlQueryAndFragment(nextReq.url);
            // requests for pages will only ever be GET requests, so don't bother to include the method in the transaction
            // name; requests to API routes could be GET, POST, PUT, etc, so do include it there
            const namePrefix = nextReq.url.startsWith('/api') ? `${nextReq.method.toUpperCase()} ` : '';
            const transaction = node_1.startTransaction(
              Object.assign(
                { name: `${namePrefix}${reqPath}`, op: 'http.server', metadata: { requestPath: reqPath } },
                traceparentData,
              ),
              // Extra context passed to the `tracesSampler` (Note: We're combining `nextReq` and `req` this way in order
              // to not break people's `tracesSampler` functions, even though the format of `nextReq` has changed (see
              // note above re: nextjs 12.0.9). If `nextReq === req` (pre 12.0.9), then spreading `req` is a no-op - we're
              // just spreading the same stuff twice. If `nextReq` contains `req` (12.0.9 and later), then spreading `req`
              // mimics the old format by flattening the data.)
              { request: Object.assign(Object.assign({}, nextReq), req) },
            );
            currentScope.setSpan(transaction);
            res.once('finish', () => {
              const transaction = tracing_1.getActiveTransaction();
              if (transaction) {
                transaction.setHttpStatus(res.statusCode);
                // we'll collect this data in a more targeted way in the event processor we added above,
                // `addRequestDataToEvent`
                delete transaction.metadata.requestPath;
                // Push `transaction.finish` to the next event loop so open spans have a chance to finish before the
                // transaction closes
                setImmediate(() => {
                  transaction.finish();
                });
              }
            });
          }
        }
        return origReqHandler.call(this, nextReq, nextRes, parsedUrl);
      });
    });
  };
  return wrappedReqHandler;
}
/**
 * Wrap the given method in order to use the parameterized path passed to it in the transaction name.
 *
 * @param origMethod Either `ensureApiPage` (called for every API request) or `findPageComponents` (called for every
 * page request), both from the `Server` class
 * @returns A wrapped version of the given method
 */
function makeWrappedMethodForGettingParameterizedPath(origMethod) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrappedMethod = function (parameterizedPath, ...args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      const transaction = tracing_1.getActiveTransaction();
      // replace specific URL with parameterized version
      if (transaction && transaction.metadata.requestPath) {
        const origPath = transaction.metadata.requestPath;
        transaction.name = transaction.name.replace(origPath, parameterizedPath);
      }
      return origMethod.call(this, parameterizedPath, ...args);
    });
  };
  return wrappedMethod;
}
/**
 * Determine if the request should be traced, by filtering out requests for internal next files and static resources.
 *
 * @param url The URL of the request
 * @param publicDirFiles A set containing relative paths to all available static resources (note that this does not
 * include static *pages*, but rather images and the like)
 * @returns false if the URL is for an internal or static resource
 */
function shouldTraceRequest(url, publicDirFiles) {
  // `static` is a deprecated but still-functional location for static resources
  return !url.startsWith('/_next/') && !url.startsWith('/static/') && !publicDirFiles.has(url);
}
//# sourceMappingURL=instrumentServer.js.map
