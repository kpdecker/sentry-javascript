/* eslint-disable @typescript-eslint/unbound-method */
import { Hub, Scope } from '@sentry/hub';

import { GraphQL } from '../../src/integrations/graphql';
import { Span } from '../../src/span';

const GQLExecute = {
  execute() {
    return Promise.resolve();
  },
};

// mock for 'graphql/execution/execution.js' package
jest.mock('@sentry/utils', () => {
  const actual = jest.requireActual('@sentry/utils');
  return {
    ...actual,
    loadModule() {
      return GQLExecute;
    },
  };
});

describe('setupOnce', () => {
  let scope = new Scope();
  let parentSpan: Span;
  let childSpan: Span;

  beforeAll(() => {
    new GraphQL().setupOnce(
      () => undefined,
      () => new Hub(undefined, scope),
    );
  });

  beforeEach(() => {
    scope = new Scope();
    parentSpan = new Span();
    childSpan = parentSpan.startChild();
    jest.spyOn(scope, 'getSpan').mockReturnValueOnce(parentSpan);
    jest.spyOn(scope, 'setSpan');
    jest.spyOn(parentSpan, 'startChild').mockReturnValueOnce(childSpan);
    jest.spyOn(childSpan, 'finish');
  });

  it(`should wrap execute method`, async () => {
    await GQLExecute.execute();
    expect(scope.getSpan).toBeCalled();
    expect(parentSpan.startChild).toBeCalledWith({
      description: 'execute',
      op: 'graphql',
    });
    expect(childSpan.finish).toBeCalled();
    expect(scope.setSpan).toHaveBeenCalledTimes(2);
  });
});
