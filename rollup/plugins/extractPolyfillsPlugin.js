import * as path from 'path';

import * as recast from 'recast';
import * as acornParser from 'recast/parsers/acorn';
// import * as acorn from 'acorn';

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

export function makeExtractPolyfillsPlugin(options) {
  const { outputFormat, outputDir } = options;

  return {
    name: 'extractPolyfills',
    renderChunk(code, chunk) {
      const { fileName } = chunk;

      const parserOptions = {
        // We supply a custom parser which wraps the provided `acorn` parser in order to override the `ecmaVersion` value.
        // See https://github.com/benjamn/recast/issues/578.
        parser: {
          parse(source, options) {
            return acornParser.parse(source, {
              ...options,
              // By this point in the build, everything should already have been down-compiled to whatever JS version
              // we're targeting. Setting this parser to `latest` just means that whatever that version is (or changes
              // to in the future), it will be able to handle the generated code.
              ecmaVersion: 'latest',
            });
          },
        },
        quote: 'single',
      };

      const ast = recast.parse(code, parserOptions);

      const polyfillNodes = findPolyfillNodes(ast);

      if (polyfillNodes.length === 0) {
        // console.log(`No polyfill nodes found in ${fileName}`);
        return null;
      }

      // const fnDeclarationNames = polyfillNodes.map(node => getNodeName(node));
      // console.log(`Found polyfill nodes in ${fileName}: ${fnDeclarationNames}`);
      // console.log(
      //   `Nodes to delete: ${ast.program.body.filter(node => node.shouldDelete).map(node => getNodeName(node))}`,
      // );

      const polyfillRequireNodes = createRequireNodes(polyfillNodes);

      if (fileName === 'config/webpack.js') {
        const bodyNodes = ast.program.body.map((node, index) => [index, node.type, getNodeName(node)]);
        debugger;
        // console.log(code);
        console.log(bodyNodes);
      }

      // Insert our new `require` nodes at the top of the file, and then delete the function definitions they're meant
      // to replace (polyfill nodes get marked for deletion in `findPolyfillNodes`)
      ast.program.body = [...polyfillRequireNodes, ...ast.program.body.filter(node => !node.shouldDelete)];

      // if (fileName === 'config/webpack.js') {
      //   const bodyNodes = ast.program.body.map((node, index) => [index, node.type, getNodeName(node)]);
      //   debugger;
      //   // console.log(code);
      //   console.log(bodyNodes);
      // }

      const newCode = recast.print(ast).code;

      // return { code: string, map: SourceMap }
      return { code: newCode };
    },
  };
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
  return ast.program.body.filter(node => {
    const nodeName = getNodeName(node);
    if (POLYFILL_NAMES.has(nodeName)) {
      // mark this node for later deletion, since we're going to replace it with an import statement
      node.shouldDelete = true;
      // store the name in a consistent spot, regardless of node type
      node.name = nodeName;

      return true;
    }

    return false;
  });
}

function createRequireNodes(polyfillNodes) {
  const { callExpression, identifier, literal, objectPattern, property, variableDeclaration, variableDeclarator } =
    recast.types.builders;
  const newNodes = polyfillNodes.map(polyfillNode => {
    const fnName = polyfillNode.name;
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

// function copyPolyfillFiles(polyfillNodes) {}
