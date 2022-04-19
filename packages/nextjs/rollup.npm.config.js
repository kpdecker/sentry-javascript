import deepMerge from 'deepmerge';
import * as recast from 'recast';
import * as acornParser from 'recast/parsers/acorn';
// import * as acorn from 'acorn';

import { makeBaseNPMConfig, makeNPMConfigVariants } from '../../rollup/index.js';

// const acornParser = require('recast/parsers/acorn');

const baseConfig = makeBaseNPMConfig({
  // We need to include `instrumentServer.ts` separately because it's only conditionally required, and so rollup doesn't automatically include it when calculating the module dependency tree
  entrypoint: ['src/index.server.ts', 'src/index.client.ts', 'src/utils/instrumentServer.ts'],
  // entrypoint: ['src/index.server.ts'],
  // entrypoint: ['src/sucraseTest.ts'],
  esModuleInterop: true,
  watchPackages: ['integrations', 'node', 'react', 'tracing'],
});

const POLYFILL_NAMES = new Set([
  '_asyncNullishCoalesce',
  '_asyncOptionalChain',
  '_asyncOptionalChainDelete',
  '_createNamedExportFrom',
  '_createStarExport',
  '_interopDefault', // rollup's version
  '_interopNamespace', // rollup's version
  '_interopRequireDefault', // sucrase's version
  '_interopRequireWildcard', // sucrase's version
  '_nullishCoalesce',
  '_optionalChain',
  '_optionalChainDelete',
]);

const recastPlugin = {
  name: 'recast',
  renderChunk(code, chunk) {
    const { fileName } = chunk;
    // console.log(`Checking ${fileName}...`);
    const ast = recast.parse(code, {
      // We supply a custom parser which wraps the provided `acorn` parser in order to override the `ecmaVersion` value.
      // See https://github.com/benjamn/recast/issues/578.
      parser: {
        parse(source, options) {
          return acornParser.parse(source, {
            ...options,
            ecmaVersion: 'latest',
          });
        },
      },
    });
    const polyfillNodes = findPolyfillNodes(ast);
    if (polyfillNodes.length === 0) {
      console.log(`No polyfill nodes found in ${fileName}`);
      return null;
    }
    const fnDeclarationNames = polyfillNodes.map(node => node.id.name);
    // const fnDeclarationNames = ast.program.body
    //   .filter(node => node.type === 'FunctionDeclaration' && POLYFILL_NAMES.has(node.id.name))
    //   .map(node => node.id.name);
    console.log(`Found polyfill nodes in ${fileName}: ${fnDeclarationNames}`);
    console.log(`Nodes to delete: ${ast.program.body.filter(node => node.shouldDelete).map(node => node.id.name)}`);
    const fnName = fnDeclarationNames[0];
    const { callExpression, identifier, literal, objectPattern, property, variableDeclaration, variableDeclarator } =
      recast.types.builders;
    const newNode = variableDeclaration('var', [
      variableDeclarator(
        objectPattern([
          // property(
          //   'init',
          //   identifier('dog'), // key
          //   identifier('dog'), // value
          // ),
          property.from({ kind: 'init', key: identifier(fnName), value: identifier(fnName), shorthand: true }),
        ]),
        callExpression(identifier('require'), [literal(`${fnName}.js`)]),
      ),
    ]);
    ast.program.body[1] = newNode;
    const output = recast.print(ast).code;

    debugger;

    // return { code: string, map: SourceMap }
    return output;
  },
};

function findPolyfillNodes(ast) {
  const polyfillNodes = ast.program.body.filter((node, index) => {
    if (node.type === 'FunctionDeclaration' && POLYFILL_NAMES.has(node.id.name)) {
      node.shouldDelete = true;
      return true;
    }

    return false;
  });

  return polyfillNodes;
}

function createRequireNodes(polyfillNodes) {
  const newNodes = polyfillNodes.map();
}

export default makeNPMConfigVariants(
  deepMerge(baseConfig, {
    // We already exclude anything listed as a dependency in `package.json`, but somewhere we import from a subpackage
    // of nextjs and rollup doesn't automatically make the connection, so we have to exclude it manually. (Note that
    // `deepMerge` will concatenate this array with the existing `external` array, rather than overwrite it.)
    external: ['next/router'],
    plugins: [recastPlugin],
  }),
);

// ast.program.body <- array, including function declarations

// ast.program.body[1].type <- "FunctionDeclaration"

// ast.program.body[1].id.name <- "_optionalChain"
