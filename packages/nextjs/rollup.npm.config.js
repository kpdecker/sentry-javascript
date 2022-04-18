import deepMerge from 'deepmerge';
import * as recast from 'recast';

import { makeBaseNPMConfig, makeNPMConfigVariants } from '../../rollup/index.js';

const baseConfig = makeBaseNPMConfig({
  // We need to include `instrumentServer.ts` separately because it's only conditionally required, and so rollup doesn't automatically include it when calculating the module dependency tree
  // entrypoint: ['src/index.server.ts', 'src/index.client.ts', 'src/utils/instrumentServer.ts'],
  // entrypoint: ['src/index.server.ts'],
  entrypoint: ['src/sucraseTest.ts'],
  esModuleInterop: true,
  watchPackages: ['integrations', 'node', 'react', 'tracing'],
});

const recastPlugin = {
  name: 'recast',
  renderChunk(code, chunk) {
    // const {filename} = chunk
    const ast = recast.parse(code);
    const fnDeclarationNames = ast.program.body
      .filter(node => node.type === 'FunctionDeclaration')
      .map(node => node.id.name);
    console.log(fnDeclarationNames);
    const fnName = fnDeclarationNames[0];
    debugger;
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
    console.log(output);
  },
};

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
