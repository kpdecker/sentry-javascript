/* eslint-disable @typescript-eslint/no-explicit-any */
import { fill, getGlobalObject, stripUrlQueryAndFragment } from '@sentry/utils';
import { default as Router } from 'next/router';
const global = getGlobalObject();
const DEFAULT_TAGS = {
  'routing.instrumentation': 'next-router',
};
let activeTransaction = undefined;
let prevTransactionName = undefined;
let startTransaction = undefined;
/**
 * Creates routing instrumention for Next Router. Only supported for
 * client side routing. Works for Next >= 10.
 *
 * Leverages the SingletonRouter from the `next/router` to
 * generate pageload/navigation transactions and parameterize
 * transaction names.
 */
export function nextRouterInstrumentation(
  startTransactionCb,
  startTransactionOnPageLoad = true,
  startTransactionOnLocationChange = true,
) {
  startTransaction = startTransactionCb;
  Router.ready(() => {
    // We can only start the pageload transaction when we have access to the parameterized
    // route name. Setting the transaction name after the transaction is started could lead
    // to possible race conditions with the router, so this approach was taken.
    if (startTransactionOnPageLoad) {
      prevTransactionName = Router.route !== null ? stripUrlQueryAndFragment(Router.route) : global.location.pathname;
      activeTransaction = startTransactionCb({
        name: prevTransactionName,
        op: 'pageload',
        tags: DEFAULT_TAGS,
      });
    }
    // Spans that aren't attached to any transaction are lost; so if transactions aren't
    // created (besides potentially the onpageload transaction), no need to wrap the router.
    if (!startTransactionOnLocationChange) return;
    // `withRouter` uses `useRouter` underneath:
    // https://github.com/vercel/next.js/blob/de42719619ae69fbd88e445100f15701f6e1e100/packages/next/client/with-router.tsx#L21
    // Router events also use the router:
    // https://github.com/vercel/next.js/blob/de42719619ae69fbd88e445100f15701f6e1e100/packages/next/client/router.ts#L92
    // `Router.changeState` handles the router state changes, so it may be enough to only wrap it
    // (instead of wrapping all of the Router's functions).
    const routerPrototype = Object.getPrototypeOf(Router.router);
    fill(routerPrototype, 'changeState', changeStateWrapper);
  });
}
/**
 * Wraps Router.changeState()
 * https://github.com/vercel/next.js/blob/da97a18dafc7799e63aa7985adc95f213c2bf5f3/packages/next/next-server/lib/router/router.ts#L1204
 * Start a navigation transaction every time the router changes state.
 */
function changeStateWrapper(originalChangeStateWrapper) {
  const wrapper = function (
    method,
    // The parameterized url, ex. posts/[id]/[comment]
    url,
    // The actual url, ex. posts/85/my-comment
    as,
    options,
    // At the moment there are no additional arguments (meaning the rest parameter is empty).
    // This is meant to protect from future additions to Next.js API, especially since this is an
    // internal API.
    ...args
  ) {
    const newTransactionName = stripUrlQueryAndFragment(url);
    // do not start a transaction if it's from the same page
    if (startTransaction !== undefined && prevTransactionName !== newTransactionName) {
      if (activeTransaction) {
        activeTransaction.finish();
      }
      const tags = Object.assign(Object.assign(Object.assign({}, DEFAULT_TAGS), { method }), options);
      if (prevTransactionName) {
        tags.from = prevTransactionName;
      }
      prevTransactionName = newTransactionName;
      activeTransaction = startTransaction({
        name: prevTransactionName,
        op: 'navigation',
        tags,
      });
    }
    return originalChangeStateWrapper.call(this, method, url, as, options, ...args);
  };
  return wrapper;
}
//# sourceMappingURL=client.js.map
