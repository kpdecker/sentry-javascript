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

function makeExtractPolyfillsPlugin(options) {
  const { outputFormat, outputDir } = options;

  const recastPlugin = {
    name: 'recast',
    renderChunk(code, chunk) {
      const isCJS = code.startsWith("Object.defineProperty(exports, '__esModule', { value: true });");
      const { fileName } = chunk;
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
        quote: 'single',
      });
      const polyfillNodes = findPolyfillNodes(ast);
      if (polyfillNodes.length === 0) {
        // console.log(`No polyfill nodes found in ${fileName}`);
        return null;
      }
      const fnDeclarationNames = polyfillNodes.map(node => getNodeName(node));
      // const fnDeclarationNames = ast.program.body
      //   .filter(node => node.type === 'FunctionDeclaration' && POLYFILL_NAMES.has(node.id.name))
      //   .map(node => node.id.name);
      console.log(`Found polyfill nodes in ${fileName}: ${fnDeclarationNames}`);
      console.log(
        `Nodes to delete: ${ast.program.body.filter(node => node.shouldDelete).map(node => getNodeName(node))}`,
      );
      // const fnName = fnDeclarationNames[0];
      // const { callExpression, identifier, literal, objectPattern, property, variableDeclaration, variableDeclarator } =
      //   recast.types.builders;
      // const newNode = variableDeclaration('var', [
      //   variableDeclarator(
      //     objectPattern([
      //       // property(
      //       //   'init',
      //       //   identifier('dog'), // key
      //       //   identifier('dog'), // value
      //       // ),
      //       property.from({ kind: 'init', key: identifier(fnName), value: identifier(fnName), shorthand: true }),
      //     ]),
      //     callExpression(identifier('require'), [literal(`${fnName}.js`)]),
      //   ),
      // ]);
      const polyfillRequireNodes = createRequireNodes(polyfillNodes);
      if (fileName === 'config/webpack.js') {
        const bodyNodes = ast.program.body.map((node, index) => [index, node.type, getNodeName(node)]);
        debugger;
        // console.log(code);
        console.log(bodyNodes);
      }
      // Insert our new `require` nodes at the top of the file, and then delete the function definitions they're meant to
      // replace
      ast.program.body = [...polyfillRequireNodes, ...ast.program.body.filter(node => !node.shouldDelete)];

      if (fileName === 'config/webpack.js') {
        const bodyNodes = ast.program.body.map((node, index) => [index, node.type, getNodeName(node)]);
        debugger;
        // console.log(code);
        console.log(bodyNodes);
      }

      const output = recast.print(ast).code;

      // return { code: string, map: SourceMap }
      return output;
    },
  };

  return recastPlugin;
}

function getNodeName(node) {
  if (node.type === 'VariableDeclaration') {
    // in practice sucrase and rollup only ever declare one polyfill at a time, so it's safe to just grab the first
    // entry here
    const declarationId = node.declarations[0].id;

    // sucrase and rollup seem to only use the first type of variable declaration for their polyfills, but good to cover
    // our bases

    // `const dogs = function() { return "are great"; };`
    // or
    // `const dogs = () => "are great";
    if (declarationId.type === 'Identifier') {
      return declarationId.name;
    }
    // `const { dogs } = { dogs: function() { return "are great"; } }`
    // or
    // `const { dogs } = { dogs: () => "are great" }`
    else if (declarationId.type === 'ObjectPattern') {
      return declarationId.properties[0].key.name;
    }
    // any other format
    else {
      return 'unknown variable';
    }
  }

  // `function dogs() { return "are great"; }`
  else if (node.type === 'FunctionDeclaration') {
    return node.id.name;
  }

  // this isn't a node we're interested in, so just return a string we know will never match one of the polyfill names
  else {
    return 'n/a';
  }
}

function findPolyfillNodes(ast) {
  const polyfillNodes = ast.program.body.filter(node => {
    if (POLYFILL_NAMES.has(getNodeName(node))) {
      node.shouldDelete = true;
      return true;
    }

    return false;
  });

  return polyfillNodes;
}

function createRequireNodes(polyfillNodes) {
  const { callExpression, identifier, literal, objectPattern, property, variableDeclaration, variableDeclarator } =
    recast.types.builders;
  const newNodes = polyfillNodes.map(polyfillNode => {
    const fnName = getNodeName(polyfillNode);
    // This creates code equivalent to the template literal
    //    `var { ${fnName} } = require('${fnName}.js')`
    const newNode = variableDeclaration('var', [
      variableDeclarator(
        objectPattern([
          property.from({ kind: 'init', key: identifier(fnName), value: identifier(fnName), shorthand: true }),
        ]),
        callExpression(identifier('require'), [literal(`${fnName}.js`)]),
      ),
    ]);

    return newNode;
  });

  return newNodes;
}

export default makeNPMConfigVariants(
  deepMerge(baseConfig, {
    // We already exclude anything listed as a dependency in `package.json`, but somewhere we import from a subpackage
    // of nextjs and rollup doesn't automatically make the connection, so we have to exclude it manually. (Note that
    // `deepMerge` will concatenate this array with the existing `external` array, rather than overwrite it.)
    external: ['next/router'],
    plugins: [makeExtractPolyfillsPlugin({ outputFormat: 'TODO need to copy files' })],
  }),
);

// ast.program.body <- array, including function declarations

// ast.program.body[1].type <- "FunctionDeclaration"

// ast.program.body[1].id.name <- "_optionalChain"
