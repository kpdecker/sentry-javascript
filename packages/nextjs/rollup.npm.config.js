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
    const { callExpression, identifier, literal, objectPattern, property, variableDeclaration, variableDeclarator } =
      recast.types.builders;
    const newNode = variableDeclaration('var', [
      variableDeclarator(
        objectPattern([
          property(
            'init',
            identifier('dog'), // key
            identifier('dog'), // value
          ),
        ]),
        callExpression(identifier('require'), [literal('test.js')]),
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

// const requireLineNode = {
//   type: 'VariableDeclaration',
//   declarations: [
//     {
//       type: 'VariableDeclarator',
//       id: {
//         type: 'ObjectPattern',
//         properties: [
//           {
//             type: 'Property',
//             key: {
//               type: 'Identifier',
//               name: 'resolve',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 519,
//                   token: 158,
//                 },
//                 end: {
//                   line: 3,
//                   column: 526,
//                   token: 159,
//                 },
//                 lines: {
//                   infos: [
//                     {
//                       line: "Object.defineProperty(exports, '__esModule', { value: true });",
//                       indent: 0,
//                       locked: false,
//                       sliceStart: 0,
//                       sliceEnd: 62,
//                     },
//                     {
//                       line: '',
//                       indent: 0,
//                       locked: false,
//                       sliceStart: 0,
//                       sliceEnd: 0,
//                     },
//                     {
//                       line: "function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { var op = ops[i]; var fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }const { resolve } = require('path');",
//                       indent: 0,
//                       locked: false,
//                       sliceStart: 0,
//                       sliceEnd: 547,
//                     },
//                     {
//                       line: '',
//                       indent: 0,
//                       locked: false,
//                       sliceStart: 0,
//                       sliceEnd: 0,
//                     },
//                     {
//                       line: "var x = _optionalChain([thing, 'optionalAccess', _ => _.stuff]);",
//                       indent: 0,
//                       locked: false,
//                       sliceStart: 0,
//                       sliceEnd: 64,
//                     },
//                     {
//                       line: '',
//                       indent: 0,
//                       locked: false,
//                       sliceStart: 0,
//                       sliceEnd: 0,
//                     },
//                     {
//                       line: "console.log('hi');",
//                       indent: 0,
//                       locked: false,
//                       sliceStart: 0,
//                       sliceEnd: 18,
//                     },
//                     {
//                       line: 'resolve(process.cwd());',
//                       indent: 0,
//                       locked: false,
//                       sliceStart: 0,
//                       sliceEnd: 23,
//                     },
//                     {
//                       line: '',
//                       indent: 0,
//                       locked: false,
//                       sliceStart: 0,
//                       sliceEnd: 0,
//                     },
//                     {
//                       line: 'exports.x = x;',
//                       indent: 0,
//                       locked: false,
//                       sliceStart: 0,
//                       sliceEnd: 14,
//                     },
//                   ],
//                   mappings: [],
//                   cachedSourceMap: null,
//                   cachedTabWidth: undefined,
//                   length: 10,
//                   name: null,
//                 },
//                 tokens: [
//                   {
//                     type: 'Identifier',
//                     value: 'Object',
//                     loc: {
//                       start: {
//                         line: 1,
//                         column: 0,
//                       },
//                       end: {
//                         line: 1,
//                         column: 6,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '.',
//                     loc: {
//                       start: {
//                         line: 1,
//                         column: 6,
//                       },
//                       end: {
//                         line: 1,
//                         column: 7,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'defineProperty',
//                     loc: {
//                       start: {
//                         line: 1,
//                         column: 7,
//                       },
//                       end: {
//                         line: 1,
//                         column: 21,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '(',
//                     loc: {
//                       start: {
//                         line: 1,
//                         column: 21,
//                       },
//                       end: {
//                         line: 1,
//                         column: 22,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'exports',
//                     loc: {
//                       start: {
//                         line: 1,
//                         column: 22,
//                       },
//                       end: {
//                         line: 1,
//                         column: 29,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ',',
//                     loc: {
//                       start: {
//                         line: 1,
//                         column: 29,
//                       },
//                       end: {
//                         line: 1,
//                         column: 30,
//                       },
//                     },
//                   },
//                   {
//                     type: 'String',
//                     value: "'__esModule'",
//                     loc: {
//                       start: {
//                         line: 1,
//                         column: 31,
//                       },
//                       end: {
//                         line: 1,
//                         column: 43,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ',',
//                     loc: {
//                       start: {
//                         line: 1,
//                         column: 43,
//                       },
//                       end: {
//                         line: 1,
//                         column: 44,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '{',
//                     loc: {
//                       start: {
//                         line: 1,
//                         column: 45,
//                       },
//                       end: {
//                         line: 1,
//                         column: 46,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'value',
//                     loc: {
//                       start: {
//                         line: 1,
//                         column: 47,
//                       },
//                       end: {
//                         line: 1,
//                         column: 52,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ':',
//                     loc: {
//                       start: {
//                         line: 1,
//                         column: 52,
//                       },
//                       end: {
//                         line: 1,
//                         column: 53,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Boolean',
//                     value: 'true',
//                     loc: {
//                       start: {
//                         line: 1,
//                         column: 54,
//                       },
//                       end: {
//                         line: 1,
//                         column: 58,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '}',
//                     loc: {
//                       start: {
//                         line: 1,
//                         column: 59,
//                       },
//                       end: {
//                         line: 1,
//                         column: 60,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ')',
//                     loc: {
//                       start: {
//                         line: 1,
//                         column: 60,
//                       },
//                       end: {
//                         line: 1,
//                         column: 61,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ';',
//                     loc: {
//                       start: {
//                         line: 1,
//                         column: 61,
//                       },
//                       end: {
//                         line: 1,
//                         column: 62,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Keyword',
//                     value: 'function',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 0,
//                       },
//                       end: {
//                         line: 3,
//                         column: 8,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: '_optionalChain',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 9,
//                       },
//                       end: {
//                         line: 3,
//                         column: 23,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '(',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 23,
//                       },
//                       end: {
//                         line: 3,
//                         column: 24,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'ops',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 24,
//                       },
//                       end: {
//                         line: 3,
//                         column: 27,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ')',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 27,
//                       },
//                       end: {
//                         line: 3,
//                         column: 28,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '{',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 29,
//                       },
//                       end: {
//                         line: 3,
//                         column: 30,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Keyword',
//                     value: 'let',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 31,
//                       },
//                       end: {
//                         line: 3,
//                         column: 34,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'lastAccessLHS',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 35,
//                       },
//                       end: {
//                         line: 3,
//                         column: 48,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '=',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 49,
//                       },
//                       end: {
//                         line: 3,
//                         column: 50,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'undefined',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 51,
//                       },
//                       end: {
//                         line: 3,
//                         column: 60,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ';',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 60,
//                       },
//                       end: {
//                         line: 3,
//                         column: 61,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Keyword',
//                     value: 'let',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 62,
//                       },
//                       end: {
//                         line: 3,
//                         column: 65,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'value',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 66,
//                       },
//                       end: {
//                         line: 3,
//                         column: 71,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '=',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 72,
//                       },
//                       end: {
//                         line: 3,
//                         column: 73,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'ops',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 74,
//                       },
//                       end: {
//                         line: 3,
//                         column: 77,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '[',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 77,
//                       },
//                       end: {
//                         line: 3,
//                         column: 78,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Numeric',
//                     value: '0',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 78,
//                       },
//                       end: {
//                         line: 3,
//                         column: 79,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ']',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 79,
//                       },
//                       end: {
//                         line: 3,
//                         column: 80,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ';',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 80,
//                       },
//                       end: {
//                         line: 3,
//                         column: 81,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Keyword',
//                     value: 'let',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 82,
//                       },
//                       end: {
//                         line: 3,
//                         column: 85,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'i',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 86,
//                       },
//                       end: {
//                         line: 3,
//                         column: 87,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '=',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 88,
//                       },
//                       end: {
//                         line: 3,
//                         column: 89,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Numeric',
//                     value: '1',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 90,
//                       },
//                       end: {
//                         line: 3,
//                         column: 91,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ';',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 91,
//                       },
//                       end: {
//                         line: 3,
//                         column: 92,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Keyword',
//                     value: 'while',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 93,
//                       },
//                       end: {
//                         line: 3,
//                         column: 98,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '(',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 99,
//                       },
//                       end: {
//                         line: 3,
//                         column: 100,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'i',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 100,
//                       },
//                       end: {
//                         line: 3,
//                         column: 101,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '<',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 102,
//                       },
//                       end: {
//                         line: 3,
//                         column: 103,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'ops',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 104,
//                       },
//                       end: {
//                         line: 3,
//                         column: 107,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '.',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 107,
//                       },
//                       end: {
//                         line: 3,
//                         column: 108,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'length',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 108,
//                       },
//                       end: {
//                         line: 3,
//                         column: 114,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ')',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 114,
//                       },
//                       end: {
//                         line: 3,
//                         column: 115,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '{',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 116,
//                       },
//                       end: {
//                         line: 3,
//                         column: 117,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Keyword',
//                     value: 'var',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 118,
//                       },
//                       end: {
//                         line: 3,
//                         column: 121,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'op',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 122,
//                       },
//                       end: {
//                         line: 3,
//                         column: 124,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '=',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 125,
//                       },
//                       end: {
//                         line: 3,
//                         column: 126,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'ops',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 127,
//                       },
//                       end: {
//                         line: 3,
//                         column: 130,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '[',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 130,
//                       },
//                       end: {
//                         line: 3,
//                         column: 131,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'i',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 131,
//                       },
//                       end: {
//                         line: 3,
//                         column: 132,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ']',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 132,
//                       },
//                       end: {
//                         line: 3,
//                         column: 133,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ';',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 133,
//                       },
//                       end: {
//                         line: 3,
//                         column: 134,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Keyword',
//                     value: 'var',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 135,
//                       },
//                       end: {
//                         line: 3,
//                         column: 138,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'fn',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 139,
//                       },
//                       end: {
//                         line: 3,
//                         column: 141,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '=',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 142,
//                       },
//                       end: {
//                         line: 3,
//                         column: 143,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'ops',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 144,
//                       },
//                       end: {
//                         line: 3,
//                         column: 147,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '[',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 147,
//                       },
//                       end: {
//                         line: 3,
//                         column: 148,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'i',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 148,
//                       },
//                       end: {
//                         line: 3,
//                         column: 149,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '+',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 150,
//                       },
//                       end: {
//                         line: 3,
//                         column: 151,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Numeric',
//                     value: '1',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 152,
//                       },
//                       end: {
//                         line: 3,
//                         column: 153,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ']',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 153,
//                       },
//                       end: {
//                         line: 3,
//                         column: 154,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ';',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 154,
//                       },
//                       end: {
//                         line: 3,
//                         column: 155,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'i',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 156,
//                       },
//                       end: {
//                         line: 3,
//                         column: 157,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '+=',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 158,
//                       },
//                       end: {
//                         line: 3,
//                         column: 160,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Numeric',
//                     value: '2',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 161,
//                       },
//                       end: {
//                         line: 3,
//                         column: 162,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ';',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 162,
//                       },
//                       end: {
//                         line: 3,
//                         column: 163,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Keyword',
//                     value: 'if',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 164,
//                       },
//                       end: {
//                         line: 3,
//                         column: 166,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '(',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 167,
//                       },
//                       end: {
//                         line: 3,
//                         column: 168,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '(',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 168,
//                       },
//                       end: {
//                         line: 3,
//                         column: 169,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'op',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 169,
//                       },
//                       end: {
//                         line: 3,
//                         column: 171,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '===',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 172,
//                       },
//                       end: {
//                         line: 3,
//                         column: 175,
//                       },
//                     },
//                   },
//                   {
//                     type: 'String',
//                     value: "'optionalAccess'",
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 176,
//                       },
//                       end: {
//                         line: 3,
//                         column: 192,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '||',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 193,
//                       },
//                       end: {
//                         line: 3,
//                         column: 195,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'op',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 196,
//                       },
//                       end: {
//                         line: 3,
//                         column: 198,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '===',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 199,
//                       },
//                       end: {
//                         line: 3,
//                         column: 202,
//                       },
//                     },
//                   },
//                   {
//                     type: 'String',
//                     value: "'optionalCall'",
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 203,
//                       },
//                       end: {
//                         line: 3,
//                         column: 217,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ')',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 217,
//                       },
//                       end: {
//                         line: 3,
//                         column: 218,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '&&',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 219,
//                       },
//                       end: {
//                         line: 3,
//                         column: 221,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'value',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 222,
//                       },
//                       end: {
//                         line: 3,
//                         column: 227,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '==',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 228,
//                       },
//                       end: {
//                         line: 3,
//                         column: 230,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Null',
//                     value: 'null',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 231,
//                       },
//                       end: {
//                         line: 3,
//                         column: 235,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ')',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 235,
//                       },
//                       end: {
//                         line: 3,
//                         column: 236,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '{',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 237,
//                       },
//                       end: {
//                         line: 3,
//                         column: 238,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Keyword',
//                     value: 'return',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 239,
//                       },
//                       end: {
//                         line: 3,
//                         column: 245,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'undefined',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 246,
//                       },
//                       end: {
//                         line: 3,
//                         column: 255,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ';',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 255,
//                       },
//                       end: {
//                         line: 3,
//                         column: 256,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '}',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 257,
//                       },
//                       end: {
//                         line: 3,
//                         column: 258,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Keyword',
//                     value: 'if',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 259,
//                       },
//                       end: {
//                         line: 3,
//                         column: 261,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '(',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 262,
//                       },
//                       end: {
//                         line: 3,
//                         column: 263,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'op',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 263,
//                       },
//                       end: {
//                         line: 3,
//                         column: 265,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '===',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 266,
//                       },
//                       end: {
//                         line: 3,
//                         column: 269,
//                       },
//                     },
//                   },
//                   {
//                     type: 'String',
//                     value: "'access'",
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 270,
//                       },
//                       end: {
//                         line: 3,
//                         column: 278,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '||',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 279,
//                       },
//                       end: {
//                         line: 3,
//                         column: 281,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'op',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 282,
//                       },
//                       end: {
//                         line: 3,
//                         column: 284,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '===',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 285,
//                       },
//                       end: {
//                         line: 3,
//                         column: 288,
//                       },
//                     },
//                   },
//                   {
//                     type: 'String',
//                     value: "'optionalAccess'",
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 289,
//                       },
//                       end: {
//                         line: 3,
//                         column: 305,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ')',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 305,
//                       },
//                       end: {
//                         line: 3,
//                         column: 306,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '{',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 307,
//                       },
//                       end: {
//                         line: 3,
//                         column: 308,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'lastAccessLHS',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 309,
//                       },
//                       end: {
//                         line: 3,
//                         column: 322,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '=',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 323,
//                       },
//                       end: {
//                         line: 3,
//                         column: 324,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'value',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 325,
//                       },
//                       end: {
//                         line: 3,
//                         column: 330,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ';',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 330,
//                       },
//                       end: {
//                         line: 3,
//                         column: 331,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'value',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 332,
//                       },
//                       end: {
//                         line: 3,
//                         column: 337,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '=',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 338,
//                       },
//                       end: {
//                         line: 3,
//                         column: 339,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'fn',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 340,
//                       },
//                       end: {
//                         line: 3,
//                         column: 342,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '(',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 342,
//                       },
//                       end: {
//                         line: 3,
//                         column: 343,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'value',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 343,
//                       },
//                       end: {
//                         line: 3,
//                         column: 348,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ')',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 348,
//                       },
//                       end: {
//                         line: 3,
//                         column: 349,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ';',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 349,
//                       },
//                       end: {
//                         line: 3,
//                         column: 350,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '}',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 351,
//                       },
//                       end: {
//                         line: 3,
//                         column: 352,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Keyword',
//                     value: 'else',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 353,
//                       },
//                       end: {
//                         line: 3,
//                         column: 357,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Keyword',
//                     value: 'if',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 358,
//                       },
//                       end: {
//                         line: 3,
//                         column: 360,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '(',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 361,
//                       },
//                       end: {
//                         line: 3,
//                         column: 362,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'op',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 362,
//                       },
//                       end: {
//                         line: 3,
//                         column: 364,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '===',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 365,
//                       },
//                       end: {
//                         line: 3,
//                         column: 368,
//                       },
//                     },
//                   },
//                   {
//                     type: 'String',
//                     value: "'call'",
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 369,
//                       },
//                       end: {
//                         line: 3,
//                         column: 375,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '||',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 376,
//                       },
//                       end: {
//                         line: 3,
//                         column: 378,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'op',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 379,
//                       },
//                       end: {
//                         line: 3,
//                         column: 381,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '===',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 382,
//                       },
//                       end: {
//                         line: 3,
//                         column: 385,
//                       },
//                     },
//                   },
//                   {
//                     type: 'String',
//                     value: "'optionalCall'",
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 386,
//                       },
//                       end: {
//                         line: 3,
//                         column: 400,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ')',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 400,
//                       },
//                       end: {
//                         line: 3,
//                         column: 401,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '{',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 402,
//                       },
//                       end: {
//                         line: 3,
//                         column: 403,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'value',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 404,
//                       },
//                       end: {
//                         line: 3,
//                         column: 409,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '=',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 410,
//                       },
//                       end: {
//                         line: 3,
//                         column: 411,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'fn',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 412,
//                       },
//                       end: {
//                         line: 3,
//                         column: 414,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '(',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 414,
//                       },
//                       end: {
//                         line: 3,
//                         column: 415,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '(',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 415,
//                       },
//                       end: {
//                         line: 3,
//                         column: 416,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '...',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 416,
//                       },
//                       end: {
//                         line: 3,
//                         column: 419,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'args',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 419,
//                       },
//                       end: {
//                         line: 3,
//                         column: 423,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ')',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 423,
//                       },
//                       end: {
//                         line: 3,
//                         column: 424,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '=>',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 425,
//                       },
//                       end: {
//                         line: 3,
//                         column: 427,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'value',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 428,
//                       },
//                       end: {
//                         line: 3,
//                         column: 433,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '.',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 433,
//                       },
//                       end: {
//                         line: 3,
//                         column: 434,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'call',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 434,
//                       },
//                       end: {
//                         line: 3,
//                         column: 438,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '(',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 438,
//                       },
//                       end: {
//                         line: 3,
//                         column: 439,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'lastAccessLHS',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 439,
//                       },
//                       end: {
//                         line: 3,
//                         column: 452,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ',',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 452,
//                       },
//                       end: {
//                         line: 3,
//                         column: 453,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '...',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 454,
//                       },
//                       end: {
//                         line: 3,
//                         column: 457,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'args',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 457,
//                       },
//                       end: {
//                         line: 3,
//                         column: 461,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ')',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 461,
//                       },
//                       end: {
//                         line: 3,
//                         column: 462,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ')',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 462,
//                       },
//                       end: {
//                         line: 3,
//                         column: 463,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ';',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 463,
//                       },
//                       end: {
//                         line: 3,
//                         column: 464,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'lastAccessLHS',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 465,
//                       },
//                       end: {
//                         line: 3,
//                         column: 478,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '=',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 479,
//                       },
//                       end: {
//                         line: 3,
//                         column: 480,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'undefined',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 481,
//                       },
//                       end: {
//                         line: 3,
//                         column: 490,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ';',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 490,
//                       },
//                       end: {
//                         line: 3,
//                         column: 491,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '}',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 492,
//                       },
//                       end: {
//                         line: 3,
//                         column: 493,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '}',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 494,
//                       },
//                       end: {
//                         line: 3,
//                         column: 495,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Keyword',
//                     value: 'return',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 496,
//                       },
//                       end: {
//                         line: 3,
//                         column: 502,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'value',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 503,
//                       },
//                       end: {
//                         line: 3,
//                         column: 508,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ';',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 508,
//                       },
//                       end: {
//                         line: 3,
//                         column: 509,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '}',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 510,
//                       },
//                       end: {
//                         line: 3,
//                         column: 511,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Keyword',
//                     value: 'const',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 511,
//                       },
//                       end: {
//                         line: 3,
//                         column: 516,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '{',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 517,
//                       },
//                       end: {
//                         line: 3,
//                         column: 518,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'resolve',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 519,
//                       },
//                       end: {
//                         line: 3,
//                         column: 526,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '}',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 527,
//                       },
//                       end: {
//                         line: 3,
//                         column: 528,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '=',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 529,
//                       },
//                       end: {
//                         line: 3,
//                         column: 530,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'require',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 531,
//                       },
//                       end: {
//                         line: 3,
//                         column: 538,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '(',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 538,
//                       },
//                       end: {
//                         line: 3,
//                         column: 539,
//                       },
//                     },
//                   },
//                   {
//                     type: 'String',
//                     value: "'path'",
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 539,
//                       },
//                       end: {
//                         line: 3,
//                         column: 545,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ')',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 545,
//                       },
//                       end: {
//                         line: 3,
//                         column: 546,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ';',
//                     loc: {
//                       start: {
//                         line: 3,
//                         column: 546,
//                       },
//                       end: {
//                         line: 3,
//                         column: 547,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Keyword',
//                     value: 'var',
//                     loc: {
//                       start: {
//                         line: 5,
//                         column: 0,
//                       },
//                       end: {
//                         line: 5,
//                         column: 3,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'x',
//                     loc: {
//                       start: {
//                         line: 5,
//                         column: 4,
//                       },
//                       end: {
//                         line: 5,
//                         column: 5,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '=',
//                     loc: {
//                       start: {
//                         line: 5,
//                         column: 6,
//                       },
//                       end: {
//                         line: 5,
//                         column: 7,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: '_optionalChain',
//                     loc: {
//                       start: {
//                         line: 5,
//                         column: 8,
//                       },
//                       end: {
//                         line: 5,
//                         column: 22,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '(',
//                     loc: {
//                       start: {
//                         line: 5,
//                         column: 22,
//                       },
//                       end: {
//                         line: 5,
//                         column: 23,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '[',
//                     loc: {
//                       start: {
//                         line: 5,
//                         column: 23,
//                       },
//                       end: {
//                         line: 5,
//                         column: 24,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'thing',
//                     loc: {
//                       start: {
//                         line: 5,
//                         column: 24,
//                       },
//                       end: {
//                         line: 5,
//                         column: 29,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ',',
//                     loc: {
//                       start: {
//                         line: 5,
//                         column: 29,
//                       },
//                       end: {
//                         line: 5,
//                         column: 30,
//                       },
//                     },
//                   },
//                   {
//                     type: 'String',
//                     value: "'optionalAccess'",
//                     loc: {
//                       start: {
//                         line: 5,
//                         column: 31,
//                       },
//                       end: {
//                         line: 5,
//                         column: 47,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ',',
//                     loc: {
//                       start: {
//                         line: 5,
//                         column: 47,
//                       },
//                       end: {
//                         line: 5,
//                         column: 48,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: '_',
//                     loc: {
//                       start: {
//                         line: 5,
//                         column: 49,
//                       },
//                       end: {
//                         line: 5,
//                         column: 50,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '=>',
//                     loc: {
//                       start: {
//                         line: 5,
//                         column: 51,
//                       },
//                       end: {
//                         line: 5,
//                         column: 53,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: '_',
//                     loc: {
//                       start: {
//                         line: 5,
//                         column: 54,
//                       },
//                       end: {
//                         line: 5,
//                         column: 55,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '.',
//                     loc: {
//                       start: {
//                         line: 5,
//                         column: 55,
//                       },
//                       end: {
//                         line: 5,
//                         column: 56,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'stuff',
//                     loc: {
//                       start: {
//                         line: 5,
//                         column: 56,
//                       },
//                       end: {
//                         line: 5,
//                         column: 61,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ']',
//                     loc: {
//                       start: {
//                         line: 5,
//                         column: 61,
//                       },
//                       end: {
//                         line: 5,
//                         column: 62,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ')',
//                     loc: {
//                       start: {
//                         line: 5,
//                         column: 62,
//                       },
//                       end: {
//                         line: 5,
//                         column: 63,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ';',
//                     loc: {
//                       start: {
//                         line: 5,
//                         column: 63,
//                       },
//                       end: {
//                         line: 5,
//                         column: 64,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'console',
//                     loc: {
//                       start: {
//                         line: 7,
//                         column: 0,
//                       },
//                       end: {
//                         line: 7,
//                         column: 7,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '.',
//                     loc: {
//                       start: {
//                         line: 7,
//                         column: 7,
//                       },
//                       end: {
//                         line: 7,
//                         column: 8,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'log',
//                     loc: {
//                       start: {
//                         line: 7,
//                         column: 8,
//                       },
//                       end: {
//                         line: 7,
//                         column: 11,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '(',
//                     loc: {
//                       start: {
//                         line: 7,
//                         column: 11,
//                       },
//                       end: {
//                         line: 7,
//                         column: 12,
//                       },
//                     },
//                   },
//                   {
//                     type: 'String',
//                     value: "'hi'",
//                     loc: {
//                       start: {
//                         line: 7,
//                         column: 12,
//                       },
//                       end: {
//                         line: 7,
//                         column: 16,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ')',
//                     loc: {
//                       start: {
//                         line: 7,
//                         column: 16,
//                       },
//                       end: {
//                         line: 7,
//                         column: 17,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ';',
//                     loc: {
//                       start: {
//                         line: 7,
//                         column: 17,
//                       },
//                       end: {
//                         line: 7,
//                         column: 18,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'resolve',
//                     loc: {
//                       start: {
//                         line: 8,
//                         column: 0,
//                       },
//                       end: {
//                         line: 8,
//                         column: 7,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '(',
//                     loc: {
//                       start: {
//                         line: 8,
//                         column: 7,
//                       },
//                       end: {
//                         line: 8,
//                         column: 8,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'process',
//                     loc: {
//                       start: {
//                         line: 8,
//                         column: 8,
//                       },
//                       end: {
//                         line: 8,
//                         column: 15,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '.',
//                     loc: {
//                       start: {
//                         line: 8,
//                         column: 15,
//                       },
//                       end: {
//                         line: 8,
//                         column: 16,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'cwd',
//                     loc: {
//                       start: {
//                         line: 8,
//                         column: 16,
//                       },
//                       end: {
//                         line: 8,
//                         column: 19,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '(',
//                     loc: {
//                       start: {
//                         line: 8,
//                         column: 19,
//                       },
//                       end: {
//                         line: 8,
//                         column: 20,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ')',
//                     loc: {
//                       start: {
//                         line: 8,
//                         column: 20,
//                       },
//                       end: {
//                         line: 8,
//                         column: 21,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ')',
//                     loc: {
//                       start: {
//                         line: 8,
//                         column: 21,
//                       },
//                       end: {
//                         line: 8,
//                         column: 22,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ';',
//                     loc: {
//                       start: {
//                         line: 8,
//                         column: 22,
//                       },
//                       end: {
//                         line: 8,
//                         column: 23,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'exports',
//                     loc: {
//                       start: {
//                         line: 10,
//                         column: 0,
//                       },
//                       end: {
//                         line: 10,
//                         column: 7,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '.',
//                     loc: {
//                       start: {
//                         line: 10,
//                         column: 7,
//                       },
//                       end: {
//                         line: 10,
//                         column: 8,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'x',
//                     loc: {
//                       start: {
//                         line: 10,
//                         column: 8,
//                       },
//                       end: {
//                         line: 10,
//                         column: 9,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: '=',
//                     loc: {
//                       start: {
//                         line: 10,
//                         column: 10,
//                       },
//                       end: {
//                         line: 10,
//                         column: 11,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Identifier',
//                     value: 'x',
//                     loc: {
//                       start: {
//                         line: 10,
//                         column: 12,
//                       },
//                       end: {
//                         line: 10,
//                         column: 13,
//                       },
//                     },
//                   },
//                   {
//                     type: 'Punctuator',
//                     value: ';',
//                     loc: {
//                       start: {
//                         line: 10,
//                         column: 13,
//                       },
//                       end: {
//                         line: 10,
//                         column: 14,
//                       },
//                     },
//                   },
//                 ],
//                 indent: 0,
//               },
//             },
//             computed: false,
//             value: {
//               type: 'Identifier',
//               name: 'resolve',
//               loc: null,
//             },
//             kind: 'init',
//             method: false,
//             shorthand: true,
//             loc: {
//               start: {
//                 line: 3,
//                 column: 519,
//                 token: 158,
//               },
//               end: {
//                 line: 3,
//                 column: 526,
//                 token: 159,
//               },
//               lines: {
//                 infos: [
//                   {
//                     line: "Object.defineProperty(exports, '__esModule', { value: true });",
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 62,
//                   },
//                   {
//                     line: '',
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 0,
//                   },
//                   {
//                     line: "function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { var op = ops[i]; var fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }const { resolve } = require('path');",
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 547,
//                   },
//                   {
//                     line: '',
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 0,
//                   },
//                   {
//                     line: "var x = _optionalChain([thing, 'optionalAccess', _ => _.stuff]);",
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 64,
//                   },
//                   {
//                     line: '',
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 0,
//                   },
//                   {
//                     line: "console.log('hi');",
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 18,
//                   },
//                   {
//                     line: 'resolve(process.cwd());',
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 23,
//                   },
//                   {
//                     line: '',
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 0,
//                   },
//                   {
//                     line: 'exports.x = x;',
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 14,
//                   },
//                 ],
//                 mappings: [],
//                 cachedSourceMap: null,
//                 cachedTabWidth: undefined,
//                 length: 10,
//                 name: null,
//               },
//               tokens: [
//                 {
//                   type: 'Identifier',
//                   value: 'Object',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 0,
//                     },
//                     end: {
//                       line: 1,
//                       column: 6,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '.',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 6,
//                     },
//                     end: {
//                       line: 1,
//                       column: 7,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'defineProperty',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 7,
//                     },
//                     end: {
//                       line: 1,
//                       column: 21,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 21,
//                     },
//                     end: {
//                       line: 1,
//                       column: 22,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'exports',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 22,
//                     },
//                     end: {
//                       line: 1,
//                       column: 29,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ',',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 29,
//                     },
//                     end: {
//                       line: 1,
//                       column: 30,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'__esModule'",
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 31,
//                     },
//                     end: {
//                       line: 1,
//                       column: 43,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ',',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 43,
//                     },
//                     end: {
//                       line: 1,
//                       column: 44,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '{',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 45,
//                     },
//                     end: {
//                       line: 1,
//                       column: 46,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'value',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 47,
//                     },
//                     end: {
//                       line: 1,
//                       column: 52,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ':',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 52,
//                     },
//                     end: {
//                       line: 1,
//                       column: 53,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Boolean',
//                   value: 'true',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 54,
//                     },
//                     end: {
//                       line: 1,
//                       column: 58,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '}',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 59,
//                     },
//                     end: {
//                       line: 1,
//                       column: 60,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 60,
//                     },
//                     end: {
//                       line: 1,
//                       column: 61,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 61,
//                     },
//                     end: {
//                       line: 1,
//                       column: 62,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'function',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 0,
//                     },
//                     end: {
//                       line: 3,
//                       column: 8,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: '_optionalChain',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 9,
//                     },
//                     end: {
//                       line: 3,
//                       column: 23,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 23,
//                     },
//                     end: {
//                       line: 3,
//                       column: 24,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'ops',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 24,
//                     },
//                     end: {
//                       line: 3,
//                       column: 27,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 27,
//                     },
//                     end: {
//                       line: 3,
//                       column: 28,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '{',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 29,
//                     },
//                     end: {
//                       line: 3,
//                       column: 30,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'let',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 31,
//                     },
//                     end: {
//                       line: 3,
//                       column: 34,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'lastAccessLHS',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 35,
//                     },
//                     end: {
//                       line: 3,
//                       column: 48,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 49,
//                     },
//                     end: {
//                       line: 3,
//                       column: 50,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'undefined',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 51,
//                     },
//                     end: {
//                       line: 3,
//                       column: 60,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 60,
//                     },
//                     end: {
//                       line: 3,
//                       column: 61,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'let',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 62,
//                     },
//                     end: {
//                       line: 3,
//                       column: 65,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'value',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 66,
//                     },
//                     end: {
//                       line: 3,
//                       column: 71,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 72,
//                     },
//                     end: {
//                       line: 3,
//                       column: 73,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'ops',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 74,
//                     },
//                     end: {
//                       line: 3,
//                       column: 77,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '[',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 77,
//                     },
//                     end: {
//                       line: 3,
//                       column: 78,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Numeric',
//                   value: '0',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 78,
//                     },
//                     end: {
//                       line: 3,
//                       column: 79,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ']',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 79,
//                     },
//                     end: {
//                       line: 3,
//                       column: 80,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 80,
//                     },
//                     end: {
//                       line: 3,
//                       column: 81,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'let',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 82,
//                     },
//                     end: {
//                       line: 3,
//                       column: 85,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'i',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 86,
//                     },
//                     end: {
//                       line: 3,
//                       column: 87,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 88,
//                     },
//                     end: {
//                       line: 3,
//                       column: 89,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Numeric',
//                   value: '1',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 90,
//                     },
//                     end: {
//                       line: 3,
//                       column: 91,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 91,
//                     },
//                     end: {
//                       line: 3,
//                       column: 92,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'while',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 93,
//                     },
//                     end: {
//                       line: 3,
//                       column: 98,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 99,
//                     },
//                     end: {
//                       line: 3,
//                       column: 100,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'i',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 100,
//                     },
//                     end: {
//                       line: 3,
//                       column: 101,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '<',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 102,
//                     },
//                     end: {
//                       line: 3,
//                       column: 103,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'ops',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 104,
//                     },
//                     end: {
//                       line: 3,
//                       column: 107,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '.',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 107,
//                     },
//                     end: {
//                       line: 3,
//                       column: 108,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'length',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 108,
//                     },
//                     end: {
//                       line: 3,
//                       column: 114,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 114,
//                     },
//                     end: {
//                       line: 3,
//                       column: 115,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '{',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 116,
//                     },
//                     end: {
//                       line: 3,
//                       column: 117,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'var',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 118,
//                     },
//                     end: {
//                       line: 3,
//                       column: 121,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'op',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 122,
//                     },
//                     end: {
//                       line: 3,
//                       column: 124,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 125,
//                     },
//                     end: {
//                       line: 3,
//                       column: 126,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'ops',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 127,
//                     },
//                     end: {
//                       line: 3,
//                       column: 130,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '[',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 130,
//                     },
//                     end: {
//                       line: 3,
//                       column: 131,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'i',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 131,
//                     },
//                     end: {
//                       line: 3,
//                       column: 132,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ']',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 132,
//                     },
//                     end: {
//                       line: 3,
//                       column: 133,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 133,
//                     },
//                     end: {
//                       line: 3,
//                       column: 134,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'var',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 135,
//                     },
//                     end: {
//                       line: 3,
//                       column: 138,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'fn',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 139,
//                     },
//                     end: {
//                       line: 3,
//                       column: 141,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 142,
//                     },
//                     end: {
//                       line: 3,
//                       column: 143,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'ops',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 144,
//                     },
//                     end: {
//                       line: 3,
//                       column: 147,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '[',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 147,
//                     },
//                     end: {
//                       line: 3,
//                       column: 148,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'i',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 148,
//                     },
//                     end: {
//                       line: 3,
//                       column: 149,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '+',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 150,
//                     },
//                     end: {
//                       line: 3,
//                       column: 151,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Numeric',
//                   value: '1',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 152,
//                     },
//                     end: {
//                       line: 3,
//                       column: 153,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ']',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 153,
//                     },
//                     end: {
//                       line: 3,
//                       column: 154,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 154,
//                     },
//                     end: {
//                       line: 3,
//                       column: 155,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'i',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 156,
//                     },
//                     end: {
//                       line: 3,
//                       column: 157,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '+=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 158,
//                     },
//                     end: {
//                       line: 3,
//                       column: 160,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Numeric',
//                   value: '2',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 161,
//                     },
//                     end: {
//                       line: 3,
//                       column: 162,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 162,
//                     },
//                     end: {
//                       line: 3,
//                       column: 163,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'if',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 164,
//                     },
//                     end: {
//                       line: 3,
//                       column: 166,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 167,
//                     },
//                     end: {
//                       line: 3,
//                       column: 168,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 168,
//                     },
//                     end: {
//                       line: 3,
//                       column: 169,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'op',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 169,
//                     },
//                     end: {
//                       line: 3,
//                       column: 171,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '===',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 172,
//                     },
//                     end: {
//                       line: 3,
//                       column: 175,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'optionalAccess'",
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 176,
//                     },
//                     end: {
//                       line: 3,
//                       column: 192,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '||',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 193,
//                     },
//                     end: {
//                       line: 3,
//                       column: 195,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'op',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 196,
//                     },
//                     end: {
//                       line: 3,
//                       column: 198,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '===',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 199,
//                     },
//                     end: {
//                       line: 3,
//                       column: 202,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'optionalCall'",
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 203,
//                     },
//                     end: {
//                       line: 3,
//                       column: 217,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 217,
//                     },
//                     end: {
//                       line: 3,
//                       column: 218,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '&&',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 219,
//                     },
//                     end: {
//                       line: 3,
//                       column: 221,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'value',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 222,
//                     },
//                     end: {
//                       line: 3,
//                       column: 227,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '==',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 228,
//                     },
//                     end: {
//                       line: 3,
//                       column: 230,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Null',
//                   value: 'null',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 231,
//                     },
//                     end: {
//                       line: 3,
//                       column: 235,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 235,
//                     },
//                     end: {
//                       line: 3,
//                       column: 236,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '{',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 237,
//                     },
//                     end: {
//                       line: 3,
//                       column: 238,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'return',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 239,
//                     },
//                     end: {
//                       line: 3,
//                       column: 245,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'undefined',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 246,
//                     },
//                     end: {
//                       line: 3,
//                       column: 255,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 255,
//                     },
//                     end: {
//                       line: 3,
//                       column: 256,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '}',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 257,
//                     },
//                     end: {
//                       line: 3,
//                       column: 258,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'if',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 259,
//                     },
//                     end: {
//                       line: 3,
//                       column: 261,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 262,
//                     },
//                     end: {
//                       line: 3,
//                       column: 263,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'op',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 263,
//                     },
//                     end: {
//                       line: 3,
//                       column: 265,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '===',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 266,
//                     },
//                     end: {
//                       line: 3,
//                       column: 269,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'access'",
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 270,
//                     },
//                     end: {
//                       line: 3,
//                       column: 278,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '||',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 279,
//                     },
//                     end: {
//                       line: 3,
//                       column: 281,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'op',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 282,
//                     },
//                     end: {
//                       line: 3,
//                       column: 284,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '===',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 285,
//                     },
//                     end: {
//                       line: 3,
//                       column: 288,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'optionalAccess'",
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 289,
//                     },
//                     end: {
//                       line: 3,
//                       column: 305,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 305,
//                     },
//                     end: {
//                       line: 3,
//                       column: 306,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '{',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 307,
//                     },
//                     end: {
//                       line: 3,
//                       column: 308,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'lastAccessLHS',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 309,
//                     },
//                     end: {
//                       line: 3,
//                       column: 322,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 323,
//                     },
//                     end: {
//                       line: 3,
//                       column: 324,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'value',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 325,
//                     },
//                     end: {
//                       line: 3,
//                       column: 330,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 330,
//                     },
//                     end: {
//                       line: 3,
//                       column: 331,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'value',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 332,
//                     },
//                     end: {
//                       line: 3,
//                       column: 337,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 338,
//                     },
//                     end: {
//                       line: 3,
//                       column: 339,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'fn',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 340,
//                     },
//                     end: {
//                       line: 3,
//                       column: 342,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 342,
//                     },
//                     end: {
//                       line: 3,
//                       column: 343,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'value',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 343,
//                     },
//                     end: {
//                       line: 3,
//                       column: 348,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 348,
//                     },
//                     end: {
//                       line: 3,
//                       column: 349,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 349,
//                     },
//                     end: {
//                       line: 3,
//                       column: 350,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '}',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 351,
//                     },
//                     end: {
//                       line: 3,
//                       column: 352,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'else',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 353,
//                     },
//                     end: {
//                       line: 3,
//                       column: 357,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'if',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 358,
//                     },
//                     end: {
//                       line: 3,
//                       column: 360,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 361,
//                     },
//                     end: {
//                       line: 3,
//                       column: 362,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'op',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 362,
//                     },
//                     end: {
//                       line: 3,
//                       column: 364,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '===',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 365,
//                     },
//                     end: {
//                       line: 3,
//                       column: 368,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'call'",
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 369,
//                     },
//                     end: {
//                       line: 3,
//                       column: 375,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '||',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 376,
//                     },
//                     end: {
//                       line: 3,
//                       column: 378,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'op',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 379,
//                     },
//                     end: {
//                       line: 3,
//                       column: 381,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '===',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 382,
//                     },
//                     end: {
//                       line: 3,
//                       column: 385,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'optionalCall'",
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 386,
//                     },
//                     end: {
//                       line: 3,
//                       column: 400,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 400,
//                     },
//                     end: {
//                       line: 3,
//                       column: 401,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '{',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 402,
//                     },
//                     end: {
//                       line: 3,
//                       column: 403,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'value',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 404,
//                     },
//                     end: {
//                       line: 3,
//                       column: 409,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 410,
//                     },
//                     end: {
//                       line: 3,
//                       column: 411,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'fn',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 412,
//                     },
//                     end: {
//                       line: 3,
//                       column: 414,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 414,
//                     },
//                     end: {
//                       line: 3,
//                       column: 415,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 415,
//                     },
//                     end: {
//                       line: 3,
//                       column: 416,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '...',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 416,
//                     },
//                     end: {
//                       line: 3,
//                       column: 419,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'args',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 419,
//                     },
//                     end: {
//                       line: 3,
//                       column: 423,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 423,
//                     },
//                     end: {
//                       line: 3,
//                       column: 424,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=>',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 425,
//                     },
//                     end: {
//                       line: 3,
//                       column: 427,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'value',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 428,
//                     },
//                     end: {
//                       line: 3,
//                       column: 433,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '.',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 433,
//                     },
//                     end: {
//                       line: 3,
//                       column: 434,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'call',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 434,
//                     },
//                     end: {
//                       line: 3,
//                       column: 438,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 438,
//                     },
//                     end: {
//                       line: 3,
//                       column: 439,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'lastAccessLHS',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 439,
//                     },
//                     end: {
//                       line: 3,
//                       column: 452,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ',',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 452,
//                     },
//                     end: {
//                       line: 3,
//                       column: 453,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '...',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 454,
//                     },
//                     end: {
//                       line: 3,
//                       column: 457,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'args',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 457,
//                     },
//                     end: {
//                       line: 3,
//                       column: 461,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 461,
//                     },
//                     end: {
//                       line: 3,
//                       column: 462,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 462,
//                     },
//                     end: {
//                       line: 3,
//                       column: 463,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 463,
//                     },
//                     end: {
//                       line: 3,
//                       column: 464,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'lastAccessLHS',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 465,
//                     },
//                     end: {
//                       line: 3,
//                       column: 478,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 479,
//                     },
//                     end: {
//                       line: 3,
//                       column: 480,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'undefined',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 481,
//                     },
//                     end: {
//                       line: 3,
//                       column: 490,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 490,
//                     },
//                     end: {
//                       line: 3,
//                       column: 491,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '}',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 492,
//                     },
//                     end: {
//                       line: 3,
//                       column: 493,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '}',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 494,
//                     },
//                     end: {
//                       line: 3,
//                       column: 495,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'return',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 496,
//                     },
//                     end: {
//                       line: 3,
//                       column: 502,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'value',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 503,
//                     },
//                     end: {
//                       line: 3,
//                       column: 508,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 508,
//                     },
//                     end: {
//                       line: 3,
//                       column: 509,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '}',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 510,
//                     },
//                     end: {
//                       line: 3,
//                       column: 511,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'const',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 511,
//                     },
//                     end: {
//                       line: 3,
//                       column: 516,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '{',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 517,
//                     },
//                     end: {
//                       line: 3,
//                       column: 518,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'resolve',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 519,
//                     },
//                     end: {
//                       line: 3,
//                       column: 526,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '}',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 527,
//                     },
//                     end: {
//                       line: 3,
//                       column: 528,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 529,
//                     },
//                     end: {
//                       line: 3,
//                       column: 530,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'require',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 531,
//                     },
//                     end: {
//                       line: 3,
//                       column: 538,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 538,
//                     },
//                     end: {
//                       line: 3,
//                       column: 539,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'path'",
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 539,
//                     },
//                     end: {
//                       line: 3,
//                       column: 545,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 545,
//                     },
//                     end: {
//                       line: 3,
//                       column: 546,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 546,
//                     },
//                     end: {
//                       line: 3,
//                       column: 547,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'var',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 0,
//                     },
//                     end: {
//                       line: 5,
//                       column: 3,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'x',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 4,
//                     },
//                     end: {
//                       line: 5,
//                       column: 5,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 6,
//                     },
//                     end: {
//                       line: 5,
//                       column: 7,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: '_optionalChain',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 8,
//                     },
//                     end: {
//                       line: 5,
//                       column: 22,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 22,
//                     },
//                     end: {
//                       line: 5,
//                       column: 23,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '[',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 23,
//                     },
//                     end: {
//                       line: 5,
//                       column: 24,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'thing',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 24,
//                     },
//                     end: {
//                       line: 5,
//                       column: 29,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ',',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 29,
//                     },
//                     end: {
//                       line: 5,
//                       column: 30,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'optionalAccess'",
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 31,
//                     },
//                     end: {
//                       line: 5,
//                       column: 47,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ',',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 47,
//                     },
//                     end: {
//                       line: 5,
//                       column: 48,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: '_',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 49,
//                     },
//                     end: {
//                       line: 5,
//                       column: 50,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=>',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 51,
//                     },
//                     end: {
//                       line: 5,
//                       column: 53,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: '_',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 54,
//                     },
//                     end: {
//                       line: 5,
//                       column: 55,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '.',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 55,
//                     },
//                     end: {
//                       line: 5,
//                       column: 56,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'stuff',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 56,
//                     },
//                     end: {
//                       line: 5,
//                       column: 61,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ']',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 61,
//                     },
//                     end: {
//                       line: 5,
//                       column: 62,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 62,
//                     },
//                     end: {
//                       line: 5,
//                       column: 63,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 63,
//                     },
//                     end: {
//                       line: 5,
//                       column: 64,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'console',
//                   loc: {
//                     start: {
//                       line: 7,
//                       column: 0,
//                     },
//                     end: {
//                       line: 7,
//                       column: 7,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '.',
//                   loc: {
//                     start: {
//                       line: 7,
//                       column: 7,
//                     },
//                     end: {
//                       line: 7,
//                       column: 8,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'log',
//                   loc: {
//                     start: {
//                       line: 7,
//                       column: 8,
//                     },
//                     end: {
//                       line: 7,
//                       column: 11,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 7,
//                       column: 11,
//                     },
//                     end: {
//                       line: 7,
//                       column: 12,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'hi'",
//                   loc: {
//                     start: {
//                       line: 7,
//                       column: 12,
//                     },
//                     end: {
//                       line: 7,
//                       column: 16,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 7,
//                       column: 16,
//                     },
//                     end: {
//                       line: 7,
//                       column: 17,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 7,
//                       column: 17,
//                     },
//                     end: {
//                       line: 7,
//                       column: 18,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'resolve',
//                   loc: {
//                     start: {
//                       line: 8,
//                       column: 0,
//                     },
//                     end: {
//                       line: 8,
//                       column: 7,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 8,
//                       column: 7,
//                     },
//                     end: {
//                       line: 8,
//                       column: 8,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'process',
//                   loc: {
//                     start: {
//                       line: 8,
//                       column: 8,
//                     },
//                     end: {
//                       line: 8,
//                       column: 15,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '.',
//                   loc: {
//                     start: {
//                       line: 8,
//                       column: 15,
//                     },
//                     end: {
//                       line: 8,
//                       column: 16,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'cwd',
//                   loc: {
//                     start: {
//                       line: 8,
//                       column: 16,
//                     },
//                     end: {
//                       line: 8,
//                       column: 19,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 8,
//                       column: 19,
//                     },
//                     end: {
//                       line: 8,
//                       column: 20,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 8,
//                       column: 20,
//                     },
//                     end: {
//                       line: 8,
//                       column: 21,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 8,
//                       column: 21,
//                     },
//                     end: {
//                       line: 8,
//                       column: 22,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 8,
//                       column: 22,
//                     },
//                     end: {
//                       line: 8,
//                       column: 23,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'exports',
//                   loc: {
//                     start: {
//                       line: 10,
//                       column: 0,
//                     },
//                     end: {
//                       line: 10,
//                       column: 7,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '.',
//                   loc: {
//                     start: {
//                       line: 10,
//                       column: 7,
//                     },
//                     end: {
//                       line: 10,
//                       column: 8,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'x',
//                   loc: {
//                     start: {
//                       line: 10,
//                       column: 8,
//                     },
//                     end: {
//                       line: 10,
//                       column: 9,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 10,
//                       column: 10,
//                     },
//                     end: {
//                       line: 10,
//                       column: 11,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'x',
//                   loc: {
//                     start: {
//                       line: 10,
//                       column: 12,
//                     },
//                     end: {
//                       line: 10,
//                       column: 13,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 10,
//                       column: 13,
//                     },
//                     end: {
//                       line: 10,
//                       column: 14,
//                     },
//                   },
//                 },
//               ],
//               indent: 0,
//             },
//           },
//         ],
//         loc: {
//           start: {
//             line: 3,
//             column: 517,
//             token: 157,
//           },
//           end: {
//             line: 3,
//             column: 528,
//             token: 160,
//           },
//           lines: {
//             infos: [
//               {
//                 line: "Object.defineProperty(exports, '__esModule', { value: true });",
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 62,
//               },
//               {
//                 line: '',
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 0,
//               },
//               {
//                 line: "function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { var op = ops[i]; var fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }const { resolve } = require('path');",
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 547,
//               },
//               {
//                 line: '',
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 0,
//               },
//               {
//                 line: "var x = _optionalChain([thing, 'optionalAccess', _ => _.stuff]);",
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 64,
//               },
//               {
//                 line: '',
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 0,
//               },
//               {
//                 line: "console.log('hi');",
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 18,
//               },
//               {
//                 line: 'resolve(process.cwd());',
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 23,
//               },
//               {
//                 line: '',
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 0,
//               },
//               {
//                 line: 'exports.x = x;',
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 14,
//               },
//             ],
//             mappings: [],
//             cachedSourceMap: null,
//             cachedTabWidth: undefined,
//             length: 10,
//             name: null,
//           },
//           tokens: [
//             {
//               type: 'Identifier',
//               value: 'Object',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 0,
//                 },
//                 end: {
//                   line: 1,
//                   column: 6,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '.',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 6,
//                 },
//                 end: {
//                   line: 1,
//                   column: 7,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'defineProperty',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 7,
//                 },
//                 end: {
//                   line: 1,
//                   column: 21,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 21,
//                 },
//                 end: {
//                   line: 1,
//                   column: 22,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'exports',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 22,
//                 },
//                 end: {
//                   line: 1,
//                   column: 29,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ',',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 29,
//                 },
//                 end: {
//                   line: 1,
//                   column: 30,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'__esModule'",
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 31,
//                 },
//                 end: {
//                   line: 1,
//                   column: 43,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ',',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 43,
//                 },
//                 end: {
//                   line: 1,
//                   column: 44,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '{',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 45,
//                 },
//                 end: {
//                   line: 1,
//                   column: 46,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'value',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 47,
//                 },
//                 end: {
//                   line: 1,
//                   column: 52,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ':',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 52,
//                 },
//                 end: {
//                   line: 1,
//                   column: 53,
//                 },
//               },
//             },
//             {
//               type: 'Boolean',
//               value: 'true',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 54,
//                 },
//                 end: {
//                   line: 1,
//                   column: 58,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '}',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 59,
//                 },
//                 end: {
//                   line: 1,
//                   column: 60,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 60,
//                 },
//                 end: {
//                   line: 1,
//                   column: 61,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 61,
//                 },
//                 end: {
//                   line: 1,
//                   column: 62,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'function',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 0,
//                 },
//                 end: {
//                   line: 3,
//                   column: 8,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: '_optionalChain',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 9,
//                 },
//                 end: {
//                   line: 3,
//                   column: 23,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 23,
//                 },
//                 end: {
//                   line: 3,
//                   column: 24,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'ops',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 24,
//                 },
//                 end: {
//                   line: 3,
//                   column: 27,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 27,
//                 },
//                 end: {
//                   line: 3,
//                   column: 28,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '{',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 29,
//                 },
//                 end: {
//                   line: 3,
//                   column: 30,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'let',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 31,
//                 },
//                 end: {
//                   line: 3,
//                   column: 34,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'lastAccessLHS',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 35,
//                 },
//                 end: {
//                   line: 3,
//                   column: 48,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 49,
//                 },
//                 end: {
//                   line: 3,
//                   column: 50,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'undefined',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 51,
//                 },
//                 end: {
//                   line: 3,
//                   column: 60,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 60,
//                 },
//                 end: {
//                   line: 3,
//                   column: 61,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'let',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 62,
//                 },
//                 end: {
//                   line: 3,
//                   column: 65,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'value',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 66,
//                 },
//                 end: {
//                   line: 3,
//                   column: 71,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 72,
//                 },
//                 end: {
//                   line: 3,
//                   column: 73,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'ops',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 74,
//                 },
//                 end: {
//                   line: 3,
//                   column: 77,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '[',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 77,
//                 },
//                 end: {
//                   line: 3,
//                   column: 78,
//                 },
//               },
//             },
//             {
//               type: 'Numeric',
//               value: '0',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 78,
//                 },
//                 end: {
//                   line: 3,
//                   column: 79,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ']',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 79,
//                 },
//                 end: {
//                   line: 3,
//                   column: 80,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 80,
//                 },
//                 end: {
//                   line: 3,
//                   column: 81,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'let',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 82,
//                 },
//                 end: {
//                   line: 3,
//                   column: 85,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'i',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 86,
//                 },
//                 end: {
//                   line: 3,
//                   column: 87,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 88,
//                 },
//                 end: {
//                   line: 3,
//                   column: 89,
//                 },
//               },
//             },
//             {
//               type: 'Numeric',
//               value: '1',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 90,
//                 },
//                 end: {
//                   line: 3,
//                   column: 91,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 91,
//                 },
//                 end: {
//                   line: 3,
//                   column: 92,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'while',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 93,
//                 },
//                 end: {
//                   line: 3,
//                   column: 98,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 99,
//                 },
//                 end: {
//                   line: 3,
//                   column: 100,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'i',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 100,
//                 },
//                 end: {
//                   line: 3,
//                   column: 101,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '<',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 102,
//                 },
//                 end: {
//                   line: 3,
//                   column: 103,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'ops',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 104,
//                 },
//                 end: {
//                   line: 3,
//                   column: 107,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '.',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 107,
//                 },
//                 end: {
//                   line: 3,
//                   column: 108,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'length',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 108,
//                 },
//                 end: {
//                   line: 3,
//                   column: 114,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 114,
//                 },
//                 end: {
//                   line: 3,
//                   column: 115,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '{',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 116,
//                 },
//                 end: {
//                   line: 3,
//                   column: 117,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'var',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 118,
//                 },
//                 end: {
//                   line: 3,
//                   column: 121,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'op',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 122,
//                 },
//                 end: {
//                   line: 3,
//                   column: 124,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 125,
//                 },
//                 end: {
//                   line: 3,
//                   column: 126,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'ops',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 127,
//                 },
//                 end: {
//                   line: 3,
//                   column: 130,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '[',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 130,
//                 },
//                 end: {
//                   line: 3,
//                   column: 131,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'i',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 131,
//                 },
//                 end: {
//                   line: 3,
//                   column: 132,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ']',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 132,
//                 },
//                 end: {
//                   line: 3,
//                   column: 133,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 133,
//                 },
//                 end: {
//                   line: 3,
//                   column: 134,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'var',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 135,
//                 },
//                 end: {
//                   line: 3,
//                   column: 138,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'fn',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 139,
//                 },
//                 end: {
//                   line: 3,
//                   column: 141,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 142,
//                 },
//                 end: {
//                   line: 3,
//                   column: 143,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'ops',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 144,
//                 },
//                 end: {
//                   line: 3,
//                   column: 147,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '[',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 147,
//                 },
//                 end: {
//                   line: 3,
//                   column: 148,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'i',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 148,
//                 },
//                 end: {
//                   line: 3,
//                   column: 149,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '+',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 150,
//                 },
//                 end: {
//                   line: 3,
//                   column: 151,
//                 },
//               },
//             },
//             {
//               type: 'Numeric',
//               value: '1',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 152,
//                 },
//                 end: {
//                   line: 3,
//                   column: 153,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ']',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 153,
//                 },
//                 end: {
//                   line: 3,
//                   column: 154,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 154,
//                 },
//                 end: {
//                   line: 3,
//                   column: 155,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'i',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 156,
//                 },
//                 end: {
//                   line: 3,
//                   column: 157,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '+=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 158,
//                 },
//                 end: {
//                   line: 3,
//                   column: 160,
//                 },
//               },
//             },
//             {
//               type: 'Numeric',
//               value: '2',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 161,
//                 },
//                 end: {
//                   line: 3,
//                   column: 162,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 162,
//                 },
//                 end: {
//                   line: 3,
//                   column: 163,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'if',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 164,
//                 },
//                 end: {
//                   line: 3,
//                   column: 166,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 167,
//                 },
//                 end: {
//                   line: 3,
//                   column: 168,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 168,
//                 },
//                 end: {
//                   line: 3,
//                   column: 169,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'op',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 169,
//                 },
//                 end: {
//                   line: 3,
//                   column: 171,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '===',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 172,
//                 },
//                 end: {
//                   line: 3,
//                   column: 175,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'optionalAccess'",
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 176,
//                 },
//                 end: {
//                   line: 3,
//                   column: 192,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '||',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 193,
//                 },
//                 end: {
//                   line: 3,
//                   column: 195,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'op',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 196,
//                 },
//                 end: {
//                   line: 3,
//                   column: 198,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '===',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 199,
//                 },
//                 end: {
//                   line: 3,
//                   column: 202,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'optionalCall'",
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 203,
//                 },
//                 end: {
//                   line: 3,
//                   column: 217,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 217,
//                 },
//                 end: {
//                   line: 3,
//                   column: 218,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '&&',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 219,
//                 },
//                 end: {
//                   line: 3,
//                   column: 221,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'value',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 222,
//                 },
//                 end: {
//                   line: 3,
//                   column: 227,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '==',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 228,
//                 },
//                 end: {
//                   line: 3,
//                   column: 230,
//                 },
//               },
//             },
//             {
//               type: 'Null',
//               value: 'null',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 231,
//                 },
//                 end: {
//                   line: 3,
//                   column: 235,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 235,
//                 },
//                 end: {
//                   line: 3,
//                   column: 236,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '{',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 237,
//                 },
//                 end: {
//                   line: 3,
//                   column: 238,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'return',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 239,
//                 },
//                 end: {
//                   line: 3,
//                   column: 245,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'undefined',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 246,
//                 },
//                 end: {
//                   line: 3,
//                   column: 255,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 255,
//                 },
//                 end: {
//                   line: 3,
//                   column: 256,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '}',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 257,
//                 },
//                 end: {
//                   line: 3,
//                   column: 258,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'if',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 259,
//                 },
//                 end: {
//                   line: 3,
//                   column: 261,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 262,
//                 },
//                 end: {
//                   line: 3,
//                   column: 263,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'op',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 263,
//                 },
//                 end: {
//                   line: 3,
//                   column: 265,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '===',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 266,
//                 },
//                 end: {
//                   line: 3,
//                   column: 269,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'access'",
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 270,
//                 },
//                 end: {
//                   line: 3,
//                   column: 278,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '||',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 279,
//                 },
//                 end: {
//                   line: 3,
//                   column: 281,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'op',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 282,
//                 },
//                 end: {
//                   line: 3,
//                   column: 284,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '===',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 285,
//                 },
//                 end: {
//                   line: 3,
//                   column: 288,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'optionalAccess'",
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 289,
//                 },
//                 end: {
//                   line: 3,
//                   column: 305,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 305,
//                 },
//                 end: {
//                   line: 3,
//                   column: 306,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '{',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 307,
//                 },
//                 end: {
//                   line: 3,
//                   column: 308,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'lastAccessLHS',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 309,
//                 },
//                 end: {
//                   line: 3,
//                   column: 322,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 323,
//                 },
//                 end: {
//                   line: 3,
//                   column: 324,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'value',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 325,
//                 },
//                 end: {
//                   line: 3,
//                   column: 330,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 330,
//                 },
//                 end: {
//                   line: 3,
//                   column: 331,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'value',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 332,
//                 },
//                 end: {
//                   line: 3,
//                   column: 337,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 338,
//                 },
//                 end: {
//                   line: 3,
//                   column: 339,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'fn',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 340,
//                 },
//                 end: {
//                   line: 3,
//                   column: 342,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 342,
//                 },
//                 end: {
//                   line: 3,
//                   column: 343,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'value',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 343,
//                 },
//                 end: {
//                   line: 3,
//                   column: 348,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 348,
//                 },
//                 end: {
//                   line: 3,
//                   column: 349,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 349,
//                 },
//                 end: {
//                   line: 3,
//                   column: 350,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '}',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 351,
//                 },
//                 end: {
//                   line: 3,
//                   column: 352,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'else',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 353,
//                 },
//                 end: {
//                   line: 3,
//                   column: 357,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'if',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 358,
//                 },
//                 end: {
//                   line: 3,
//                   column: 360,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 361,
//                 },
//                 end: {
//                   line: 3,
//                   column: 362,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'op',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 362,
//                 },
//                 end: {
//                   line: 3,
//                   column: 364,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '===',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 365,
//                 },
//                 end: {
//                   line: 3,
//                   column: 368,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'call'",
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 369,
//                 },
//                 end: {
//                   line: 3,
//                   column: 375,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '||',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 376,
//                 },
//                 end: {
//                   line: 3,
//                   column: 378,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'op',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 379,
//                 },
//                 end: {
//                   line: 3,
//                   column: 381,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '===',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 382,
//                 },
//                 end: {
//                   line: 3,
//                   column: 385,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'optionalCall'",
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 386,
//                 },
//                 end: {
//                   line: 3,
//                   column: 400,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 400,
//                 },
//                 end: {
//                   line: 3,
//                   column: 401,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '{',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 402,
//                 },
//                 end: {
//                   line: 3,
//                   column: 403,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'value',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 404,
//                 },
//                 end: {
//                   line: 3,
//                   column: 409,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 410,
//                 },
//                 end: {
//                   line: 3,
//                   column: 411,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'fn',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 412,
//                 },
//                 end: {
//                   line: 3,
//                   column: 414,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 414,
//                 },
//                 end: {
//                   line: 3,
//                   column: 415,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 415,
//                 },
//                 end: {
//                   line: 3,
//                   column: 416,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '...',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 416,
//                 },
//                 end: {
//                   line: 3,
//                   column: 419,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'args',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 419,
//                 },
//                 end: {
//                   line: 3,
//                   column: 423,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 423,
//                 },
//                 end: {
//                   line: 3,
//                   column: 424,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=>',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 425,
//                 },
//                 end: {
//                   line: 3,
//                   column: 427,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'value',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 428,
//                 },
//                 end: {
//                   line: 3,
//                   column: 433,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '.',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 433,
//                 },
//                 end: {
//                   line: 3,
//                   column: 434,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'call',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 434,
//                 },
//                 end: {
//                   line: 3,
//                   column: 438,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 438,
//                 },
//                 end: {
//                   line: 3,
//                   column: 439,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'lastAccessLHS',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 439,
//                 },
//                 end: {
//                   line: 3,
//                   column: 452,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ',',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 452,
//                 },
//                 end: {
//                   line: 3,
//                   column: 453,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '...',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 454,
//                 },
//                 end: {
//                   line: 3,
//                   column: 457,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'args',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 457,
//                 },
//                 end: {
//                   line: 3,
//                   column: 461,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 461,
//                 },
//                 end: {
//                   line: 3,
//                   column: 462,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 462,
//                 },
//                 end: {
//                   line: 3,
//                   column: 463,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 463,
//                 },
//                 end: {
//                   line: 3,
//                   column: 464,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'lastAccessLHS',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 465,
//                 },
//                 end: {
//                   line: 3,
//                   column: 478,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 479,
//                 },
//                 end: {
//                   line: 3,
//                   column: 480,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'undefined',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 481,
//                 },
//                 end: {
//                   line: 3,
//                   column: 490,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 490,
//                 },
//                 end: {
//                   line: 3,
//                   column: 491,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '}',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 492,
//                 },
//                 end: {
//                   line: 3,
//                   column: 493,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '}',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 494,
//                 },
//                 end: {
//                   line: 3,
//                   column: 495,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'return',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 496,
//                 },
//                 end: {
//                   line: 3,
//                   column: 502,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'value',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 503,
//                 },
//                 end: {
//                   line: 3,
//                   column: 508,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 508,
//                 },
//                 end: {
//                   line: 3,
//                   column: 509,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '}',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 510,
//                 },
//                 end: {
//                   line: 3,
//                   column: 511,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'const',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 511,
//                 },
//                 end: {
//                   line: 3,
//                   column: 516,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '{',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 517,
//                 },
//                 end: {
//                   line: 3,
//                   column: 518,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'resolve',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 519,
//                 },
//                 end: {
//                   line: 3,
//                   column: 526,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '}',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 527,
//                 },
//                 end: {
//                   line: 3,
//                   column: 528,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 529,
//                 },
//                 end: {
//                   line: 3,
//                   column: 530,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'require',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 531,
//                 },
//                 end: {
//                   line: 3,
//                   column: 538,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 538,
//                 },
//                 end: {
//                   line: 3,
//                   column: 539,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'path'",
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 539,
//                 },
//                 end: {
//                   line: 3,
//                   column: 545,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 545,
//                 },
//                 end: {
//                   line: 3,
//                   column: 546,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 546,
//                 },
//                 end: {
//                   line: 3,
//                   column: 547,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'var',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 0,
//                 },
//                 end: {
//                   line: 5,
//                   column: 3,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'x',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 4,
//                 },
//                 end: {
//                   line: 5,
//                   column: 5,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 6,
//                 },
//                 end: {
//                   line: 5,
//                   column: 7,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: '_optionalChain',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 8,
//                 },
//                 end: {
//                   line: 5,
//                   column: 22,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 22,
//                 },
//                 end: {
//                   line: 5,
//                   column: 23,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '[',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 23,
//                 },
//                 end: {
//                   line: 5,
//                   column: 24,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'thing',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 24,
//                 },
//                 end: {
//                   line: 5,
//                   column: 29,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ',',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 29,
//                 },
//                 end: {
//                   line: 5,
//                   column: 30,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'optionalAccess'",
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 31,
//                 },
//                 end: {
//                   line: 5,
//                   column: 47,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ',',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 47,
//                 },
//                 end: {
//                   line: 5,
//                   column: 48,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: '_',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 49,
//                 },
//                 end: {
//                   line: 5,
//                   column: 50,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=>',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 51,
//                 },
//                 end: {
//                   line: 5,
//                   column: 53,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: '_',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 54,
//                 },
//                 end: {
//                   line: 5,
//                   column: 55,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '.',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 55,
//                 },
//                 end: {
//                   line: 5,
//                   column: 56,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'stuff',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 56,
//                 },
//                 end: {
//                   line: 5,
//                   column: 61,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ']',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 61,
//                 },
//                 end: {
//                   line: 5,
//                   column: 62,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 62,
//                 },
//                 end: {
//                   line: 5,
//                   column: 63,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 63,
//                 },
//                 end: {
//                   line: 5,
//                   column: 64,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'console',
//               loc: {
//                 start: {
//                   line: 7,
//                   column: 0,
//                 },
//                 end: {
//                   line: 7,
//                   column: 7,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '.',
//               loc: {
//                 start: {
//                   line: 7,
//                   column: 7,
//                 },
//                 end: {
//                   line: 7,
//                   column: 8,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'log',
//               loc: {
//                 start: {
//                   line: 7,
//                   column: 8,
//                 },
//                 end: {
//                   line: 7,
//                   column: 11,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 7,
//                   column: 11,
//                 },
//                 end: {
//                   line: 7,
//                   column: 12,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'hi'",
//               loc: {
//                 start: {
//                   line: 7,
//                   column: 12,
//                 },
//                 end: {
//                   line: 7,
//                   column: 16,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 7,
//                   column: 16,
//                 },
//                 end: {
//                   line: 7,
//                   column: 17,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 7,
//                   column: 17,
//                 },
//                 end: {
//                   line: 7,
//                   column: 18,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'resolve',
//               loc: {
//                 start: {
//                   line: 8,
//                   column: 0,
//                 },
//                 end: {
//                   line: 8,
//                   column: 7,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 8,
//                   column: 7,
//                 },
//                 end: {
//                   line: 8,
//                   column: 8,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'process',
//               loc: {
//                 start: {
//                   line: 8,
//                   column: 8,
//                 },
//                 end: {
//                   line: 8,
//                   column: 15,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '.',
//               loc: {
//                 start: {
//                   line: 8,
//                   column: 15,
//                 },
//                 end: {
//                   line: 8,
//                   column: 16,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'cwd',
//               loc: {
//                 start: {
//                   line: 8,
//                   column: 16,
//                 },
//                 end: {
//                   line: 8,
//                   column: 19,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 8,
//                   column: 19,
//                 },
//                 end: {
//                   line: 8,
//                   column: 20,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 8,
//                   column: 20,
//                 },
//                 end: {
//                   line: 8,
//                   column: 21,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 8,
//                   column: 21,
//                 },
//                 end: {
//                   line: 8,
//                   column: 22,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 8,
//                   column: 22,
//                 },
//                 end: {
//                   line: 8,
//                   column: 23,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'exports',
//               loc: {
//                 start: {
//                   line: 10,
//                   column: 0,
//                 },
//                 end: {
//                   line: 10,
//                   column: 7,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '.',
//               loc: {
//                 start: {
//                   line: 10,
//                   column: 7,
//                 },
//                 end: {
//                   line: 10,
//                   column: 8,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'x',
//               loc: {
//                 start: {
//                   line: 10,
//                   column: 8,
//                 },
//                 end: {
//                   line: 10,
//                   column: 9,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 10,
//                   column: 10,
//                 },
//                 end: {
//                   line: 10,
//                   column: 11,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'x',
//               loc: {
//                 start: {
//                   line: 10,
//                   column: 12,
//                 },
//                 end: {
//                   line: 10,
//                   column: 13,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 10,
//                   column: 13,
//                 },
//                 end: {
//                   line: 10,
//                   column: 14,
//                 },
//               },
//             },
//           ],
//           indent: 0,
//         },
//       },
//       init: {
//         type: 'CallExpression',
//         callee: {
//           type: 'Identifier',
//           name: 'require',
//           loc: {
//             start: {
//               line: 3,
//               column: 531,
//               token: 161,
//             },
//             end: {
//               line: 3,
//               column: 538,
//               token: 162,
//             },
//             lines: {
//               infos: [
//                 {
//                   line: "Object.defineProperty(exports, '__esModule', { value: true });",
//                   indent: 0,
//                   locked: false,
//                   sliceStart: 0,
//                   sliceEnd: 62,
//                 },
//                 {
//                   line: '',
//                   indent: 0,
//                   locked: false,
//                   sliceStart: 0,
//                   sliceEnd: 0,
//                 },
//                 {
//                   line: "function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { var op = ops[i]; var fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }const { resolve } = require('path');",
//                   indent: 0,
//                   locked: false,
//                   sliceStart: 0,
//                   sliceEnd: 547,
//                 },
//                 {
//                   line: '',
//                   indent: 0,
//                   locked: false,
//                   sliceStart: 0,
//                   sliceEnd: 0,
//                 },
//                 {
//                   line: "var x = _optionalChain([thing, 'optionalAccess', _ => _.stuff]);",
//                   indent: 0,
//                   locked: false,
//                   sliceStart: 0,
//                   sliceEnd: 64,
//                 },
//                 {
//                   line: '',
//                   indent: 0,
//                   locked: false,
//                   sliceStart: 0,
//                   sliceEnd: 0,
//                 },
//                 {
//                   line: "console.log('hi');",
//                   indent: 0,
//                   locked: false,
//                   sliceStart: 0,
//                   sliceEnd: 18,
//                 },
//                 {
//                   line: 'resolve(process.cwd());',
//                   indent: 0,
//                   locked: false,
//                   sliceStart: 0,
//                   sliceEnd: 23,
//                 },
//                 {
//                   line: '',
//                   indent: 0,
//                   locked: false,
//                   sliceStart: 0,
//                   sliceEnd: 0,
//                 },
//                 {
//                   line: 'exports.x = x;',
//                   indent: 0,
//                   locked: false,
//                   sliceStart: 0,
//                   sliceEnd: 14,
//                 },
//               ],
//               mappings: [],
//               cachedSourceMap: null,
//               cachedTabWidth: undefined,
//               length: 10,
//               name: null,
//             },
//             tokens: [
//               {
//                 type: 'Identifier',
//                 value: 'Object',
//                 loc: {
//                   start: {
//                     line: 1,
//                     column: 0,
//                   },
//                   end: {
//                     line: 1,
//                     column: 6,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '.',
//                 loc: {
//                   start: {
//                     line: 1,
//                     column: 6,
//                   },
//                   end: {
//                     line: 1,
//                     column: 7,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'defineProperty',
//                 loc: {
//                   start: {
//                     line: 1,
//                     column: 7,
//                   },
//                   end: {
//                     line: 1,
//                     column: 21,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '(',
//                 loc: {
//                   start: {
//                     line: 1,
//                     column: 21,
//                   },
//                   end: {
//                     line: 1,
//                     column: 22,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'exports',
//                 loc: {
//                   start: {
//                     line: 1,
//                     column: 22,
//                   },
//                   end: {
//                     line: 1,
//                     column: 29,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ',',
//                 loc: {
//                   start: {
//                     line: 1,
//                     column: 29,
//                   },
//                   end: {
//                     line: 1,
//                     column: 30,
//                   },
//                 },
//               },
//               {
//                 type: 'String',
//                 value: "'__esModule'",
//                 loc: {
//                   start: {
//                     line: 1,
//                     column: 31,
//                   },
//                   end: {
//                     line: 1,
//                     column: 43,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ',',
//                 loc: {
//                   start: {
//                     line: 1,
//                     column: 43,
//                   },
//                   end: {
//                     line: 1,
//                     column: 44,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '{',
//                 loc: {
//                   start: {
//                     line: 1,
//                     column: 45,
//                   },
//                   end: {
//                     line: 1,
//                     column: 46,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'value',
//                 loc: {
//                   start: {
//                     line: 1,
//                     column: 47,
//                   },
//                   end: {
//                     line: 1,
//                     column: 52,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ':',
//                 loc: {
//                   start: {
//                     line: 1,
//                     column: 52,
//                   },
//                   end: {
//                     line: 1,
//                     column: 53,
//                   },
//                 },
//               },
//               {
//                 type: 'Boolean',
//                 value: 'true',
//                 loc: {
//                   start: {
//                     line: 1,
//                     column: 54,
//                   },
//                   end: {
//                     line: 1,
//                     column: 58,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '}',
//                 loc: {
//                   start: {
//                     line: 1,
//                     column: 59,
//                   },
//                   end: {
//                     line: 1,
//                     column: 60,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ')',
//                 loc: {
//                   start: {
//                     line: 1,
//                     column: 60,
//                   },
//                   end: {
//                     line: 1,
//                     column: 61,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ';',
//                 loc: {
//                   start: {
//                     line: 1,
//                     column: 61,
//                   },
//                   end: {
//                     line: 1,
//                     column: 62,
//                   },
//                 },
//               },
//               {
//                 type: 'Keyword',
//                 value: 'function',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 0,
//                   },
//                   end: {
//                     line: 3,
//                     column: 8,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: '_optionalChain',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 9,
//                   },
//                   end: {
//                     line: 3,
//                     column: 23,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '(',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 23,
//                   },
//                   end: {
//                     line: 3,
//                     column: 24,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'ops',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 24,
//                   },
//                   end: {
//                     line: 3,
//                     column: 27,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ')',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 27,
//                   },
//                   end: {
//                     line: 3,
//                     column: 28,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '{',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 29,
//                   },
//                   end: {
//                     line: 3,
//                     column: 30,
//                   },
//                 },
//               },
//               {
//                 type: 'Keyword',
//                 value: 'let',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 31,
//                   },
//                   end: {
//                     line: 3,
//                     column: 34,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'lastAccessLHS',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 35,
//                   },
//                   end: {
//                     line: 3,
//                     column: 48,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '=',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 49,
//                   },
//                   end: {
//                     line: 3,
//                     column: 50,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'undefined',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 51,
//                   },
//                   end: {
//                     line: 3,
//                     column: 60,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ';',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 60,
//                   },
//                   end: {
//                     line: 3,
//                     column: 61,
//                   },
//                 },
//               },
//               {
//                 type: 'Keyword',
//                 value: 'let',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 62,
//                   },
//                   end: {
//                     line: 3,
//                     column: 65,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'value',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 66,
//                   },
//                   end: {
//                     line: 3,
//                     column: 71,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '=',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 72,
//                   },
//                   end: {
//                     line: 3,
//                     column: 73,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'ops',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 74,
//                   },
//                   end: {
//                     line: 3,
//                     column: 77,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '[',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 77,
//                   },
//                   end: {
//                     line: 3,
//                     column: 78,
//                   },
//                 },
//               },
//               {
//                 type: 'Numeric',
//                 value: '0',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 78,
//                   },
//                   end: {
//                     line: 3,
//                     column: 79,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ']',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 79,
//                   },
//                   end: {
//                     line: 3,
//                     column: 80,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ';',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 80,
//                   },
//                   end: {
//                     line: 3,
//                     column: 81,
//                   },
//                 },
//               },
//               {
//                 type: 'Keyword',
//                 value: 'let',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 82,
//                   },
//                   end: {
//                     line: 3,
//                     column: 85,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'i',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 86,
//                   },
//                   end: {
//                     line: 3,
//                     column: 87,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '=',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 88,
//                   },
//                   end: {
//                     line: 3,
//                     column: 89,
//                   },
//                 },
//               },
//               {
//                 type: 'Numeric',
//                 value: '1',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 90,
//                   },
//                   end: {
//                     line: 3,
//                     column: 91,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ';',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 91,
//                   },
//                   end: {
//                     line: 3,
//                     column: 92,
//                   },
//                 },
//               },
//               {
//                 type: 'Keyword',
//                 value: 'while',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 93,
//                   },
//                   end: {
//                     line: 3,
//                     column: 98,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '(',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 99,
//                   },
//                   end: {
//                     line: 3,
//                     column: 100,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'i',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 100,
//                   },
//                   end: {
//                     line: 3,
//                     column: 101,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '<',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 102,
//                   },
//                   end: {
//                     line: 3,
//                     column: 103,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'ops',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 104,
//                   },
//                   end: {
//                     line: 3,
//                     column: 107,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '.',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 107,
//                   },
//                   end: {
//                     line: 3,
//                     column: 108,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'length',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 108,
//                   },
//                   end: {
//                     line: 3,
//                     column: 114,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ')',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 114,
//                   },
//                   end: {
//                     line: 3,
//                     column: 115,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '{',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 116,
//                   },
//                   end: {
//                     line: 3,
//                     column: 117,
//                   },
//                 },
//               },
//               {
//                 type: 'Keyword',
//                 value: 'var',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 118,
//                   },
//                   end: {
//                     line: 3,
//                     column: 121,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'op',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 122,
//                   },
//                   end: {
//                     line: 3,
//                     column: 124,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '=',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 125,
//                   },
//                   end: {
//                     line: 3,
//                     column: 126,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'ops',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 127,
//                   },
//                   end: {
//                     line: 3,
//                     column: 130,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '[',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 130,
//                   },
//                   end: {
//                     line: 3,
//                     column: 131,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'i',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 131,
//                   },
//                   end: {
//                     line: 3,
//                     column: 132,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ']',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 132,
//                   },
//                   end: {
//                     line: 3,
//                     column: 133,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ';',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 133,
//                   },
//                   end: {
//                     line: 3,
//                     column: 134,
//                   },
//                 },
//               },
//               {
//                 type: 'Keyword',
//                 value: 'var',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 135,
//                   },
//                   end: {
//                     line: 3,
//                     column: 138,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'fn',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 139,
//                   },
//                   end: {
//                     line: 3,
//                     column: 141,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '=',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 142,
//                   },
//                   end: {
//                     line: 3,
//                     column: 143,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'ops',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 144,
//                   },
//                   end: {
//                     line: 3,
//                     column: 147,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '[',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 147,
//                   },
//                   end: {
//                     line: 3,
//                     column: 148,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'i',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 148,
//                   },
//                   end: {
//                     line: 3,
//                     column: 149,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '+',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 150,
//                   },
//                   end: {
//                     line: 3,
//                     column: 151,
//                   },
//                 },
//               },
//               {
//                 type: 'Numeric',
//                 value: '1',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 152,
//                   },
//                   end: {
//                     line: 3,
//                     column: 153,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ']',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 153,
//                   },
//                   end: {
//                     line: 3,
//                     column: 154,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ';',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 154,
//                   },
//                   end: {
//                     line: 3,
//                     column: 155,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'i',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 156,
//                   },
//                   end: {
//                     line: 3,
//                     column: 157,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '+=',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 158,
//                   },
//                   end: {
//                     line: 3,
//                     column: 160,
//                   },
//                 },
//               },
//               {
//                 type: 'Numeric',
//                 value: '2',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 161,
//                   },
//                   end: {
//                     line: 3,
//                     column: 162,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ';',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 162,
//                   },
//                   end: {
//                     line: 3,
//                     column: 163,
//                   },
//                 },
//               },
//               {
//                 type: 'Keyword',
//                 value: 'if',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 164,
//                   },
//                   end: {
//                     line: 3,
//                     column: 166,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '(',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 167,
//                   },
//                   end: {
//                     line: 3,
//                     column: 168,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '(',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 168,
//                   },
//                   end: {
//                     line: 3,
//                     column: 169,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'op',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 169,
//                   },
//                   end: {
//                     line: 3,
//                     column: 171,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '===',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 172,
//                   },
//                   end: {
//                     line: 3,
//                     column: 175,
//                   },
//                 },
//               },
//               {
//                 type: 'String',
//                 value: "'optionalAccess'",
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 176,
//                   },
//                   end: {
//                     line: 3,
//                     column: 192,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '||',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 193,
//                   },
//                   end: {
//                     line: 3,
//                     column: 195,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'op',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 196,
//                   },
//                   end: {
//                     line: 3,
//                     column: 198,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '===',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 199,
//                   },
//                   end: {
//                     line: 3,
//                     column: 202,
//                   },
//                 },
//               },
//               {
//                 type: 'String',
//                 value: "'optionalCall'",
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 203,
//                   },
//                   end: {
//                     line: 3,
//                     column: 217,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ')',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 217,
//                   },
//                   end: {
//                     line: 3,
//                     column: 218,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '&&',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 219,
//                   },
//                   end: {
//                     line: 3,
//                     column: 221,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'value',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 222,
//                   },
//                   end: {
//                     line: 3,
//                     column: 227,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '==',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 228,
//                   },
//                   end: {
//                     line: 3,
//                     column: 230,
//                   },
//                 },
//               },
//               {
//                 type: 'Null',
//                 value: 'null',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 231,
//                   },
//                   end: {
//                     line: 3,
//                     column: 235,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ')',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 235,
//                   },
//                   end: {
//                     line: 3,
//                     column: 236,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '{',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 237,
//                   },
//                   end: {
//                     line: 3,
//                     column: 238,
//                   },
//                 },
//               },
//               {
//                 type: 'Keyword',
//                 value: 'return',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 239,
//                   },
//                   end: {
//                     line: 3,
//                     column: 245,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'undefined',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 246,
//                   },
//                   end: {
//                     line: 3,
//                     column: 255,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ';',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 255,
//                   },
//                   end: {
//                     line: 3,
//                     column: 256,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '}',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 257,
//                   },
//                   end: {
//                     line: 3,
//                     column: 258,
//                   },
//                 },
//               },
//               {
//                 type: 'Keyword',
//                 value: 'if',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 259,
//                   },
//                   end: {
//                     line: 3,
//                     column: 261,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '(',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 262,
//                   },
//                   end: {
//                     line: 3,
//                     column: 263,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'op',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 263,
//                   },
//                   end: {
//                     line: 3,
//                     column: 265,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '===',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 266,
//                   },
//                   end: {
//                     line: 3,
//                     column: 269,
//                   },
//                 },
//               },
//               {
//                 type: 'String',
//                 value: "'access'",
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 270,
//                   },
//                   end: {
//                     line: 3,
//                     column: 278,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '||',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 279,
//                   },
//                   end: {
//                     line: 3,
//                     column: 281,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'op',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 282,
//                   },
//                   end: {
//                     line: 3,
//                     column: 284,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '===',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 285,
//                   },
//                   end: {
//                     line: 3,
//                     column: 288,
//                   },
//                 },
//               },
//               {
//                 type: 'String',
//                 value: "'optionalAccess'",
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 289,
//                   },
//                   end: {
//                     line: 3,
//                     column: 305,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ')',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 305,
//                   },
//                   end: {
//                     line: 3,
//                     column: 306,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '{',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 307,
//                   },
//                   end: {
//                     line: 3,
//                     column: 308,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'lastAccessLHS',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 309,
//                   },
//                   end: {
//                     line: 3,
//                     column: 322,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '=',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 323,
//                   },
//                   end: {
//                     line: 3,
//                     column: 324,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'value',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 325,
//                   },
//                   end: {
//                     line: 3,
//                     column: 330,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ';',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 330,
//                   },
//                   end: {
//                     line: 3,
//                     column: 331,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'value',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 332,
//                   },
//                   end: {
//                     line: 3,
//                     column: 337,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '=',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 338,
//                   },
//                   end: {
//                     line: 3,
//                     column: 339,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'fn',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 340,
//                   },
//                   end: {
//                     line: 3,
//                     column: 342,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '(',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 342,
//                   },
//                   end: {
//                     line: 3,
//                     column: 343,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'value',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 343,
//                   },
//                   end: {
//                     line: 3,
//                     column: 348,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ')',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 348,
//                   },
//                   end: {
//                     line: 3,
//                     column: 349,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ';',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 349,
//                   },
//                   end: {
//                     line: 3,
//                     column: 350,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '}',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 351,
//                   },
//                   end: {
//                     line: 3,
//                     column: 352,
//                   },
//                 },
//               },
//               {
//                 type: 'Keyword',
//                 value: 'else',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 353,
//                   },
//                   end: {
//                     line: 3,
//                     column: 357,
//                   },
//                 },
//               },
//               {
//                 type: 'Keyword',
//                 value: 'if',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 358,
//                   },
//                   end: {
//                     line: 3,
//                     column: 360,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '(',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 361,
//                   },
//                   end: {
//                     line: 3,
//                     column: 362,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'op',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 362,
//                   },
//                   end: {
//                     line: 3,
//                     column: 364,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '===',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 365,
//                   },
//                   end: {
//                     line: 3,
//                     column: 368,
//                   },
//                 },
//               },
//               {
//                 type: 'String',
//                 value: "'call'",
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 369,
//                   },
//                   end: {
//                     line: 3,
//                     column: 375,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '||',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 376,
//                   },
//                   end: {
//                     line: 3,
//                     column: 378,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'op',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 379,
//                   },
//                   end: {
//                     line: 3,
//                     column: 381,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '===',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 382,
//                   },
//                   end: {
//                     line: 3,
//                     column: 385,
//                   },
//                 },
//               },
//               {
//                 type: 'String',
//                 value: "'optionalCall'",
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 386,
//                   },
//                   end: {
//                     line: 3,
//                     column: 400,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ')',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 400,
//                   },
//                   end: {
//                     line: 3,
//                     column: 401,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '{',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 402,
//                   },
//                   end: {
//                     line: 3,
//                     column: 403,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'value',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 404,
//                   },
//                   end: {
//                     line: 3,
//                     column: 409,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '=',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 410,
//                   },
//                   end: {
//                     line: 3,
//                     column: 411,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'fn',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 412,
//                   },
//                   end: {
//                     line: 3,
//                     column: 414,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '(',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 414,
//                   },
//                   end: {
//                     line: 3,
//                     column: 415,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '(',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 415,
//                   },
//                   end: {
//                     line: 3,
//                     column: 416,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '...',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 416,
//                   },
//                   end: {
//                     line: 3,
//                     column: 419,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'args',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 419,
//                   },
//                   end: {
//                     line: 3,
//                     column: 423,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ')',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 423,
//                   },
//                   end: {
//                     line: 3,
//                     column: 424,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '=>',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 425,
//                   },
//                   end: {
//                     line: 3,
//                     column: 427,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'value',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 428,
//                   },
//                   end: {
//                     line: 3,
//                     column: 433,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '.',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 433,
//                   },
//                   end: {
//                     line: 3,
//                     column: 434,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'call',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 434,
//                   },
//                   end: {
//                     line: 3,
//                     column: 438,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '(',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 438,
//                   },
//                   end: {
//                     line: 3,
//                     column: 439,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'lastAccessLHS',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 439,
//                   },
//                   end: {
//                     line: 3,
//                     column: 452,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ',',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 452,
//                   },
//                   end: {
//                     line: 3,
//                     column: 453,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '...',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 454,
//                   },
//                   end: {
//                     line: 3,
//                     column: 457,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'args',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 457,
//                   },
//                   end: {
//                     line: 3,
//                     column: 461,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ')',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 461,
//                   },
//                   end: {
//                     line: 3,
//                     column: 462,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ')',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 462,
//                   },
//                   end: {
//                     line: 3,
//                     column: 463,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ';',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 463,
//                   },
//                   end: {
//                     line: 3,
//                     column: 464,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'lastAccessLHS',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 465,
//                   },
//                   end: {
//                     line: 3,
//                     column: 478,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '=',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 479,
//                   },
//                   end: {
//                     line: 3,
//                     column: 480,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'undefined',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 481,
//                   },
//                   end: {
//                     line: 3,
//                     column: 490,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ';',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 490,
//                   },
//                   end: {
//                     line: 3,
//                     column: 491,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '}',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 492,
//                   },
//                   end: {
//                     line: 3,
//                     column: 493,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '}',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 494,
//                   },
//                   end: {
//                     line: 3,
//                     column: 495,
//                   },
//                 },
//               },
//               {
//                 type: 'Keyword',
//                 value: 'return',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 496,
//                   },
//                   end: {
//                     line: 3,
//                     column: 502,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'value',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 503,
//                   },
//                   end: {
//                     line: 3,
//                     column: 508,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ';',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 508,
//                   },
//                   end: {
//                     line: 3,
//                     column: 509,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '}',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 510,
//                   },
//                   end: {
//                     line: 3,
//                     column: 511,
//                   },
//                 },
//               },
//               {
//                 type: 'Keyword',
//                 value: 'const',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 511,
//                   },
//                   end: {
//                     line: 3,
//                     column: 516,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '{',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 517,
//                   },
//                   end: {
//                     line: 3,
//                     column: 518,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'resolve',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 519,
//                   },
//                   end: {
//                     line: 3,
//                     column: 526,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '}',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 527,
//                   },
//                   end: {
//                     line: 3,
//                     column: 528,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '=',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 529,
//                   },
//                   end: {
//                     line: 3,
//                     column: 530,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'require',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 531,
//                   },
//                   end: {
//                     line: 3,
//                     column: 538,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '(',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 538,
//                   },
//                   end: {
//                     line: 3,
//                     column: 539,
//                   },
//                 },
//               },
//               {
//                 type: 'String',
//                 value: "'path'",
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 539,
//                   },
//                   end: {
//                     line: 3,
//                     column: 545,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ')',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 545,
//                   },
//                   end: {
//                     line: 3,
//                     column: 546,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ';',
//                 loc: {
//                   start: {
//                     line: 3,
//                     column: 546,
//                   },
//                   end: {
//                     line: 3,
//                     column: 547,
//                   },
//                 },
//               },
//               {
//                 type: 'Keyword',
//                 value: 'var',
//                 loc: {
//                   start: {
//                     line: 5,
//                     column: 0,
//                   },
//                   end: {
//                     line: 5,
//                     column: 3,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'x',
//                 loc: {
//                   start: {
//                     line: 5,
//                     column: 4,
//                   },
//                   end: {
//                     line: 5,
//                     column: 5,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '=',
//                 loc: {
//                   start: {
//                     line: 5,
//                     column: 6,
//                   },
//                   end: {
//                     line: 5,
//                     column: 7,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: '_optionalChain',
//                 loc: {
//                   start: {
//                     line: 5,
//                     column: 8,
//                   },
//                   end: {
//                     line: 5,
//                     column: 22,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '(',
//                 loc: {
//                   start: {
//                     line: 5,
//                     column: 22,
//                   },
//                   end: {
//                     line: 5,
//                     column: 23,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '[',
//                 loc: {
//                   start: {
//                     line: 5,
//                     column: 23,
//                   },
//                   end: {
//                     line: 5,
//                     column: 24,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'thing',
//                 loc: {
//                   start: {
//                     line: 5,
//                     column: 24,
//                   },
//                   end: {
//                     line: 5,
//                     column: 29,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ',',
//                 loc: {
//                   start: {
//                     line: 5,
//                     column: 29,
//                   },
//                   end: {
//                     line: 5,
//                     column: 30,
//                   },
//                 },
//               },
//               {
//                 type: 'String',
//                 value: "'optionalAccess'",
//                 loc: {
//                   start: {
//                     line: 5,
//                     column: 31,
//                   },
//                   end: {
//                     line: 5,
//                     column: 47,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ',',
//                 loc: {
//                   start: {
//                     line: 5,
//                     column: 47,
//                   },
//                   end: {
//                     line: 5,
//                     column: 48,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: '_',
//                 loc: {
//                   start: {
//                     line: 5,
//                     column: 49,
//                   },
//                   end: {
//                     line: 5,
//                     column: 50,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '=>',
//                 loc: {
//                   start: {
//                     line: 5,
//                     column: 51,
//                   },
//                   end: {
//                     line: 5,
//                     column: 53,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: '_',
//                 loc: {
//                   start: {
//                     line: 5,
//                     column: 54,
//                   },
//                   end: {
//                     line: 5,
//                     column: 55,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '.',
//                 loc: {
//                   start: {
//                     line: 5,
//                     column: 55,
//                   },
//                   end: {
//                     line: 5,
//                     column: 56,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'stuff',
//                 loc: {
//                   start: {
//                     line: 5,
//                     column: 56,
//                   },
//                   end: {
//                     line: 5,
//                     column: 61,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ']',
//                 loc: {
//                   start: {
//                     line: 5,
//                     column: 61,
//                   },
//                   end: {
//                     line: 5,
//                     column: 62,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ')',
//                 loc: {
//                   start: {
//                     line: 5,
//                     column: 62,
//                   },
//                   end: {
//                     line: 5,
//                     column: 63,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ';',
//                 loc: {
//                   start: {
//                     line: 5,
//                     column: 63,
//                   },
//                   end: {
//                     line: 5,
//                     column: 64,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'console',
//                 loc: {
//                   start: {
//                     line: 7,
//                     column: 0,
//                   },
//                   end: {
//                     line: 7,
//                     column: 7,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '.',
//                 loc: {
//                   start: {
//                     line: 7,
//                     column: 7,
//                   },
//                   end: {
//                     line: 7,
//                     column: 8,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'log',
//                 loc: {
//                   start: {
//                     line: 7,
//                     column: 8,
//                   },
//                   end: {
//                     line: 7,
//                     column: 11,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '(',
//                 loc: {
//                   start: {
//                     line: 7,
//                     column: 11,
//                   },
//                   end: {
//                     line: 7,
//                     column: 12,
//                   },
//                 },
//               },
//               {
//                 type: 'String',
//                 value: "'hi'",
//                 loc: {
//                   start: {
//                     line: 7,
//                     column: 12,
//                   },
//                   end: {
//                     line: 7,
//                     column: 16,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ')',
//                 loc: {
//                   start: {
//                     line: 7,
//                     column: 16,
//                   },
//                   end: {
//                     line: 7,
//                     column: 17,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ';',
//                 loc: {
//                   start: {
//                     line: 7,
//                     column: 17,
//                   },
//                   end: {
//                     line: 7,
//                     column: 18,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'resolve',
//                 loc: {
//                   start: {
//                     line: 8,
//                     column: 0,
//                   },
//                   end: {
//                     line: 8,
//                     column: 7,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '(',
//                 loc: {
//                   start: {
//                     line: 8,
//                     column: 7,
//                   },
//                   end: {
//                     line: 8,
//                     column: 8,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'process',
//                 loc: {
//                   start: {
//                     line: 8,
//                     column: 8,
//                   },
//                   end: {
//                     line: 8,
//                     column: 15,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '.',
//                 loc: {
//                   start: {
//                     line: 8,
//                     column: 15,
//                   },
//                   end: {
//                     line: 8,
//                     column: 16,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'cwd',
//                 loc: {
//                   start: {
//                     line: 8,
//                     column: 16,
//                   },
//                   end: {
//                     line: 8,
//                     column: 19,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '(',
//                 loc: {
//                   start: {
//                     line: 8,
//                     column: 19,
//                   },
//                   end: {
//                     line: 8,
//                     column: 20,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ')',
//                 loc: {
//                   start: {
//                     line: 8,
//                     column: 20,
//                   },
//                   end: {
//                     line: 8,
//                     column: 21,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ')',
//                 loc: {
//                   start: {
//                     line: 8,
//                     column: 21,
//                   },
//                   end: {
//                     line: 8,
//                     column: 22,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ';',
//                 loc: {
//                   start: {
//                     line: 8,
//                     column: 22,
//                   },
//                   end: {
//                     line: 8,
//                     column: 23,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'exports',
//                 loc: {
//                   start: {
//                     line: 10,
//                     column: 0,
//                   },
//                   end: {
//                     line: 10,
//                     column: 7,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '.',
//                 loc: {
//                   start: {
//                     line: 10,
//                     column: 7,
//                   },
//                   end: {
//                     line: 10,
//                     column: 8,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'x',
//                 loc: {
//                   start: {
//                     line: 10,
//                     column: 8,
//                   },
//                   end: {
//                     line: 10,
//                     column: 9,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: '=',
//                 loc: {
//                   start: {
//                     line: 10,
//                     column: 10,
//                   },
//                   end: {
//                     line: 10,
//                     column: 11,
//                   },
//                 },
//               },
//               {
//                 type: 'Identifier',
//                 value: 'x',
//                 loc: {
//                   start: {
//                     line: 10,
//                     column: 12,
//                   },
//                   end: {
//                     line: 10,
//                     column: 13,
//                   },
//                 },
//               },
//               {
//                 type: 'Punctuator',
//                 value: ';',
//                 loc: {
//                   start: {
//                     line: 10,
//                     column: 13,
//                   },
//                   end: {
//                     line: 10,
//                     column: 14,
//                   },
//                 },
//               },
//             ],
//             indent: 0,
//           },
//         },
//         arguments: [
//           {
//             type: 'Literal',
//             value: 'path',
//             raw: "'path'",
//             loc: {
//               start: {
//                 line: 3,
//                 column: 539,
//                 token: 163,
//               },
//               end: {
//                 line: 3,
//                 column: 545,
//                 token: 164,
//               },
//               lines: {
//                 infos: [
//                   {
//                     line: "Object.defineProperty(exports, '__esModule', { value: true });",
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 62,
//                   },
//                   {
//                     line: '',
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 0,
//                   },
//                   {
//                     line: "function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { var op = ops[i]; var fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }const { resolve } = require('path');",
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 547,
//                   },
//                   {
//                     line: '',
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 0,
//                   },
//                   {
//                     line: "var x = _optionalChain([thing, 'optionalAccess', _ => _.stuff]);",
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 64,
//                   },
//                   {
//                     line: '',
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 0,
//                   },
//                   {
//                     line: "console.log('hi');",
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 18,
//                   },
//                   {
//                     line: 'resolve(process.cwd());',
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 23,
//                   },
//                   {
//                     line: '',
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 0,
//                   },
//                   {
//                     line: 'exports.x = x;',
//                     indent: 0,
//                     locked: false,
//                     sliceStart: 0,
//                     sliceEnd: 14,
//                   },
//                 ],
//                 mappings: [],
//                 cachedSourceMap: null,
//                 cachedTabWidth: undefined,
//                 length: 10,
//                 name: null,
//               },
//               tokens: [
//                 {
//                   type: 'Identifier',
//                   value: 'Object',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 0,
//                     },
//                     end: {
//                       line: 1,
//                       column: 6,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '.',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 6,
//                     },
//                     end: {
//                       line: 1,
//                       column: 7,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'defineProperty',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 7,
//                     },
//                     end: {
//                       line: 1,
//                       column: 21,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 21,
//                     },
//                     end: {
//                       line: 1,
//                       column: 22,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'exports',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 22,
//                     },
//                     end: {
//                       line: 1,
//                       column: 29,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ',',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 29,
//                     },
//                     end: {
//                       line: 1,
//                       column: 30,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'__esModule'",
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 31,
//                     },
//                     end: {
//                       line: 1,
//                       column: 43,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ',',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 43,
//                     },
//                     end: {
//                       line: 1,
//                       column: 44,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '{',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 45,
//                     },
//                     end: {
//                       line: 1,
//                       column: 46,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'value',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 47,
//                     },
//                     end: {
//                       line: 1,
//                       column: 52,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ':',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 52,
//                     },
//                     end: {
//                       line: 1,
//                       column: 53,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Boolean',
//                   value: 'true',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 54,
//                     },
//                     end: {
//                       line: 1,
//                       column: 58,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '}',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 59,
//                     },
//                     end: {
//                       line: 1,
//                       column: 60,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 60,
//                     },
//                     end: {
//                       line: 1,
//                       column: 61,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 1,
//                       column: 61,
//                     },
//                     end: {
//                       line: 1,
//                       column: 62,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'function',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 0,
//                     },
//                     end: {
//                       line: 3,
//                       column: 8,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: '_optionalChain',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 9,
//                     },
//                     end: {
//                       line: 3,
//                       column: 23,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 23,
//                     },
//                     end: {
//                       line: 3,
//                       column: 24,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'ops',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 24,
//                     },
//                     end: {
//                       line: 3,
//                       column: 27,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 27,
//                     },
//                     end: {
//                       line: 3,
//                       column: 28,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '{',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 29,
//                     },
//                     end: {
//                       line: 3,
//                       column: 30,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'let',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 31,
//                     },
//                     end: {
//                       line: 3,
//                       column: 34,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'lastAccessLHS',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 35,
//                     },
//                     end: {
//                       line: 3,
//                       column: 48,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 49,
//                     },
//                     end: {
//                       line: 3,
//                       column: 50,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'undefined',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 51,
//                     },
//                     end: {
//                       line: 3,
//                       column: 60,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 60,
//                     },
//                     end: {
//                       line: 3,
//                       column: 61,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'let',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 62,
//                     },
//                     end: {
//                       line: 3,
//                       column: 65,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'value',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 66,
//                     },
//                     end: {
//                       line: 3,
//                       column: 71,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 72,
//                     },
//                     end: {
//                       line: 3,
//                       column: 73,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'ops',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 74,
//                     },
//                     end: {
//                       line: 3,
//                       column: 77,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '[',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 77,
//                     },
//                     end: {
//                       line: 3,
//                       column: 78,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Numeric',
//                   value: '0',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 78,
//                     },
//                     end: {
//                       line: 3,
//                       column: 79,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ']',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 79,
//                     },
//                     end: {
//                       line: 3,
//                       column: 80,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 80,
//                     },
//                     end: {
//                       line: 3,
//                       column: 81,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'let',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 82,
//                     },
//                     end: {
//                       line: 3,
//                       column: 85,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'i',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 86,
//                     },
//                     end: {
//                       line: 3,
//                       column: 87,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 88,
//                     },
//                     end: {
//                       line: 3,
//                       column: 89,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Numeric',
//                   value: '1',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 90,
//                     },
//                     end: {
//                       line: 3,
//                       column: 91,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 91,
//                     },
//                     end: {
//                       line: 3,
//                       column: 92,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'while',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 93,
//                     },
//                     end: {
//                       line: 3,
//                       column: 98,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 99,
//                     },
//                     end: {
//                       line: 3,
//                       column: 100,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'i',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 100,
//                     },
//                     end: {
//                       line: 3,
//                       column: 101,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '<',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 102,
//                     },
//                     end: {
//                       line: 3,
//                       column: 103,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'ops',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 104,
//                     },
//                     end: {
//                       line: 3,
//                       column: 107,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '.',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 107,
//                     },
//                     end: {
//                       line: 3,
//                       column: 108,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'length',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 108,
//                     },
//                     end: {
//                       line: 3,
//                       column: 114,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 114,
//                     },
//                     end: {
//                       line: 3,
//                       column: 115,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '{',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 116,
//                     },
//                     end: {
//                       line: 3,
//                       column: 117,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'var',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 118,
//                     },
//                     end: {
//                       line: 3,
//                       column: 121,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'op',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 122,
//                     },
//                     end: {
//                       line: 3,
//                       column: 124,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 125,
//                     },
//                     end: {
//                       line: 3,
//                       column: 126,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'ops',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 127,
//                     },
//                     end: {
//                       line: 3,
//                       column: 130,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '[',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 130,
//                     },
//                     end: {
//                       line: 3,
//                       column: 131,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'i',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 131,
//                     },
//                     end: {
//                       line: 3,
//                       column: 132,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ']',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 132,
//                     },
//                     end: {
//                       line: 3,
//                       column: 133,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 133,
//                     },
//                     end: {
//                       line: 3,
//                       column: 134,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'var',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 135,
//                     },
//                     end: {
//                       line: 3,
//                       column: 138,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'fn',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 139,
//                     },
//                     end: {
//                       line: 3,
//                       column: 141,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 142,
//                     },
//                     end: {
//                       line: 3,
//                       column: 143,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'ops',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 144,
//                     },
//                     end: {
//                       line: 3,
//                       column: 147,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '[',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 147,
//                     },
//                     end: {
//                       line: 3,
//                       column: 148,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'i',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 148,
//                     },
//                     end: {
//                       line: 3,
//                       column: 149,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '+',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 150,
//                     },
//                     end: {
//                       line: 3,
//                       column: 151,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Numeric',
//                   value: '1',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 152,
//                     },
//                     end: {
//                       line: 3,
//                       column: 153,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ']',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 153,
//                     },
//                     end: {
//                       line: 3,
//                       column: 154,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 154,
//                     },
//                     end: {
//                       line: 3,
//                       column: 155,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'i',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 156,
//                     },
//                     end: {
//                       line: 3,
//                       column: 157,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '+=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 158,
//                     },
//                     end: {
//                       line: 3,
//                       column: 160,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Numeric',
//                   value: '2',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 161,
//                     },
//                     end: {
//                       line: 3,
//                       column: 162,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 162,
//                     },
//                     end: {
//                       line: 3,
//                       column: 163,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'if',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 164,
//                     },
//                     end: {
//                       line: 3,
//                       column: 166,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 167,
//                     },
//                     end: {
//                       line: 3,
//                       column: 168,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 168,
//                     },
//                     end: {
//                       line: 3,
//                       column: 169,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'op',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 169,
//                     },
//                     end: {
//                       line: 3,
//                       column: 171,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '===',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 172,
//                     },
//                     end: {
//                       line: 3,
//                       column: 175,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'optionalAccess'",
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 176,
//                     },
//                     end: {
//                       line: 3,
//                       column: 192,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '||',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 193,
//                     },
//                     end: {
//                       line: 3,
//                       column: 195,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'op',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 196,
//                     },
//                     end: {
//                       line: 3,
//                       column: 198,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '===',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 199,
//                     },
//                     end: {
//                       line: 3,
//                       column: 202,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'optionalCall'",
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 203,
//                     },
//                     end: {
//                       line: 3,
//                       column: 217,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 217,
//                     },
//                     end: {
//                       line: 3,
//                       column: 218,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '&&',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 219,
//                     },
//                     end: {
//                       line: 3,
//                       column: 221,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'value',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 222,
//                     },
//                     end: {
//                       line: 3,
//                       column: 227,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '==',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 228,
//                     },
//                     end: {
//                       line: 3,
//                       column: 230,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Null',
//                   value: 'null',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 231,
//                     },
//                     end: {
//                       line: 3,
//                       column: 235,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 235,
//                     },
//                     end: {
//                       line: 3,
//                       column: 236,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '{',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 237,
//                     },
//                     end: {
//                       line: 3,
//                       column: 238,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'return',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 239,
//                     },
//                     end: {
//                       line: 3,
//                       column: 245,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'undefined',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 246,
//                     },
//                     end: {
//                       line: 3,
//                       column: 255,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 255,
//                     },
//                     end: {
//                       line: 3,
//                       column: 256,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '}',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 257,
//                     },
//                     end: {
//                       line: 3,
//                       column: 258,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'if',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 259,
//                     },
//                     end: {
//                       line: 3,
//                       column: 261,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 262,
//                     },
//                     end: {
//                       line: 3,
//                       column: 263,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'op',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 263,
//                     },
//                     end: {
//                       line: 3,
//                       column: 265,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '===',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 266,
//                     },
//                     end: {
//                       line: 3,
//                       column: 269,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'access'",
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 270,
//                     },
//                     end: {
//                       line: 3,
//                       column: 278,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '||',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 279,
//                     },
//                     end: {
//                       line: 3,
//                       column: 281,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'op',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 282,
//                     },
//                     end: {
//                       line: 3,
//                       column: 284,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '===',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 285,
//                     },
//                     end: {
//                       line: 3,
//                       column: 288,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'optionalAccess'",
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 289,
//                     },
//                     end: {
//                       line: 3,
//                       column: 305,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 305,
//                     },
//                     end: {
//                       line: 3,
//                       column: 306,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '{',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 307,
//                     },
//                     end: {
//                       line: 3,
//                       column: 308,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'lastAccessLHS',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 309,
//                     },
//                     end: {
//                       line: 3,
//                       column: 322,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 323,
//                     },
//                     end: {
//                       line: 3,
//                       column: 324,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'value',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 325,
//                     },
//                     end: {
//                       line: 3,
//                       column: 330,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 330,
//                     },
//                     end: {
//                       line: 3,
//                       column: 331,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'value',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 332,
//                     },
//                     end: {
//                       line: 3,
//                       column: 337,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 338,
//                     },
//                     end: {
//                       line: 3,
//                       column: 339,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'fn',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 340,
//                     },
//                     end: {
//                       line: 3,
//                       column: 342,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 342,
//                     },
//                     end: {
//                       line: 3,
//                       column: 343,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'value',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 343,
//                     },
//                     end: {
//                       line: 3,
//                       column: 348,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 348,
//                     },
//                     end: {
//                       line: 3,
//                       column: 349,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 349,
//                     },
//                     end: {
//                       line: 3,
//                       column: 350,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '}',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 351,
//                     },
//                     end: {
//                       line: 3,
//                       column: 352,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'else',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 353,
//                     },
//                     end: {
//                       line: 3,
//                       column: 357,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'if',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 358,
//                     },
//                     end: {
//                       line: 3,
//                       column: 360,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 361,
//                     },
//                     end: {
//                       line: 3,
//                       column: 362,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'op',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 362,
//                     },
//                     end: {
//                       line: 3,
//                       column: 364,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '===',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 365,
//                     },
//                     end: {
//                       line: 3,
//                       column: 368,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'call'",
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 369,
//                     },
//                     end: {
//                       line: 3,
//                       column: 375,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '||',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 376,
//                     },
//                     end: {
//                       line: 3,
//                       column: 378,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'op',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 379,
//                     },
//                     end: {
//                       line: 3,
//                       column: 381,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '===',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 382,
//                     },
//                     end: {
//                       line: 3,
//                       column: 385,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'optionalCall'",
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 386,
//                     },
//                     end: {
//                       line: 3,
//                       column: 400,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 400,
//                     },
//                     end: {
//                       line: 3,
//                       column: 401,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '{',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 402,
//                     },
//                     end: {
//                       line: 3,
//                       column: 403,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'value',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 404,
//                     },
//                     end: {
//                       line: 3,
//                       column: 409,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 410,
//                     },
//                     end: {
//                       line: 3,
//                       column: 411,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'fn',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 412,
//                     },
//                     end: {
//                       line: 3,
//                       column: 414,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 414,
//                     },
//                     end: {
//                       line: 3,
//                       column: 415,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 415,
//                     },
//                     end: {
//                       line: 3,
//                       column: 416,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '...',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 416,
//                     },
//                     end: {
//                       line: 3,
//                       column: 419,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'args',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 419,
//                     },
//                     end: {
//                       line: 3,
//                       column: 423,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 423,
//                     },
//                     end: {
//                       line: 3,
//                       column: 424,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=>',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 425,
//                     },
//                     end: {
//                       line: 3,
//                       column: 427,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'value',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 428,
//                     },
//                     end: {
//                       line: 3,
//                       column: 433,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '.',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 433,
//                     },
//                     end: {
//                       line: 3,
//                       column: 434,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'call',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 434,
//                     },
//                     end: {
//                       line: 3,
//                       column: 438,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 438,
//                     },
//                     end: {
//                       line: 3,
//                       column: 439,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'lastAccessLHS',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 439,
//                     },
//                     end: {
//                       line: 3,
//                       column: 452,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ',',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 452,
//                     },
//                     end: {
//                       line: 3,
//                       column: 453,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '...',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 454,
//                     },
//                     end: {
//                       line: 3,
//                       column: 457,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'args',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 457,
//                     },
//                     end: {
//                       line: 3,
//                       column: 461,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 461,
//                     },
//                     end: {
//                       line: 3,
//                       column: 462,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 462,
//                     },
//                     end: {
//                       line: 3,
//                       column: 463,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 463,
//                     },
//                     end: {
//                       line: 3,
//                       column: 464,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'lastAccessLHS',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 465,
//                     },
//                     end: {
//                       line: 3,
//                       column: 478,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 479,
//                     },
//                     end: {
//                       line: 3,
//                       column: 480,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'undefined',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 481,
//                     },
//                     end: {
//                       line: 3,
//                       column: 490,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 490,
//                     },
//                     end: {
//                       line: 3,
//                       column: 491,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '}',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 492,
//                     },
//                     end: {
//                       line: 3,
//                       column: 493,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '}',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 494,
//                     },
//                     end: {
//                       line: 3,
//                       column: 495,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'return',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 496,
//                     },
//                     end: {
//                       line: 3,
//                       column: 502,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'value',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 503,
//                     },
//                     end: {
//                       line: 3,
//                       column: 508,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 508,
//                     },
//                     end: {
//                       line: 3,
//                       column: 509,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '}',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 510,
//                     },
//                     end: {
//                       line: 3,
//                       column: 511,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'const',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 511,
//                     },
//                     end: {
//                       line: 3,
//                       column: 516,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '{',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 517,
//                     },
//                     end: {
//                       line: 3,
//                       column: 518,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'resolve',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 519,
//                     },
//                     end: {
//                       line: 3,
//                       column: 526,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '}',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 527,
//                     },
//                     end: {
//                       line: 3,
//                       column: 528,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 529,
//                     },
//                     end: {
//                       line: 3,
//                       column: 530,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'require',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 531,
//                     },
//                     end: {
//                       line: 3,
//                       column: 538,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 538,
//                     },
//                     end: {
//                       line: 3,
//                       column: 539,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'path'",
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 539,
//                     },
//                     end: {
//                       line: 3,
//                       column: 545,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 545,
//                     },
//                     end: {
//                       line: 3,
//                       column: 546,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 3,
//                       column: 546,
//                     },
//                     end: {
//                       line: 3,
//                       column: 547,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Keyword',
//                   value: 'var',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 0,
//                     },
//                     end: {
//                       line: 5,
//                       column: 3,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'x',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 4,
//                     },
//                     end: {
//                       line: 5,
//                       column: 5,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 6,
//                     },
//                     end: {
//                       line: 5,
//                       column: 7,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: '_optionalChain',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 8,
//                     },
//                     end: {
//                       line: 5,
//                       column: 22,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 22,
//                     },
//                     end: {
//                       line: 5,
//                       column: 23,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '[',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 23,
//                     },
//                     end: {
//                       line: 5,
//                       column: 24,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'thing',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 24,
//                     },
//                     end: {
//                       line: 5,
//                       column: 29,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ',',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 29,
//                     },
//                     end: {
//                       line: 5,
//                       column: 30,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'optionalAccess'",
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 31,
//                     },
//                     end: {
//                       line: 5,
//                       column: 47,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ',',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 47,
//                     },
//                     end: {
//                       line: 5,
//                       column: 48,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: '_',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 49,
//                     },
//                     end: {
//                       line: 5,
//                       column: 50,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=>',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 51,
//                     },
//                     end: {
//                       line: 5,
//                       column: 53,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: '_',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 54,
//                     },
//                     end: {
//                       line: 5,
//                       column: 55,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '.',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 55,
//                     },
//                     end: {
//                       line: 5,
//                       column: 56,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'stuff',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 56,
//                     },
//                     end: {
//                       line: 5,
//                       column: 61,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ']',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 61,
//                     },
//                     end: {
//                       line: 5,
//                       column: 62,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 62,
//                     },
//                     end: {
//                       line: 5,
//                       column: 63,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 5,
//                       column: 63,
//                     },
//                     end: {
//                       line: 5,
//                       column: 64,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'console',
//                   loc: {
//                     start: {
//                       line: 7,
//                       column: 0,
//                     },
//                     end: {
//                       line: 7,
//                       column: 7,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '.',
//                   loc: {
//                     start: {
//                       line: 7,
//                       column: 7,
//                     },
//                     end: {
//                       line: 7,
//                       column: 8,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'log',
//                   loc: {
//                     start: {
//                       line: 7,
//                       column: 8,
//                     },
//                     end: {
//                       line: 7,
//                       column: 11,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 7,
//                       column: 11,
//                     },
//                     end: {
//                       line: 7,
//                       column: 12,
//                     },
//                   },
//                 },
//                 {
//                   type: 'String',
//                   value: "'hi'",
//                   loc: {
//                     start: {
//                       line: 7,
//                       column: 12,
//                     },
//                     end: {
//                       line: 7,
//                       column: 16,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 7,
//                       column: 16,
//                     },
//                     end: {
//                       line: 7,
//                       column: 17,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 7,
//                       column: 17,
//                     },
//                     end: {
//                       line: 7,
//                       column: 18,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'resolve',
//                   loc: {
//                     start: {
//                       line: 8,
//                       column: 0,
//                     },
//                     end: {
//                       line: 8,
//                       column: 7,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 8,
//                       column: 7,
//                     },
//                     end: {
//                       line: 8,
//                       column: 8,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'process',
//                   loc: {
//                     start: {
//                       line: 8,
//                       column: 8,
//                     },
//                     end: {
//                       line: 8,
//                       column: 15,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '.',
//                   loc: {
//                     start: {
//                       line: 8,
//                       column: 15,
//                     },
//                     end: {
//                       line: 8,
//                       column: 16,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'cwd',
//                   loc: {
//                     start: {
//                       line: 8,
//                       column: 16,
//                     },
//                     end: {
//                       line: 8,
//                       column: 19,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '(',
//                   loc: {
//                     start: {
//                       line: 8,
//                       column: 19,
//                     },
//                     end: {
//                       line: 8,
//                       column: 20,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 8,
//                       column: 20,
//                     },
//                     end: {
//                       line: 8,
//                       column: 21,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ')',
//                   loc: {
//                     start: {
//                       line: 8,
//                       column: 21,
//                     },
//                     end: {
//                       line: 8,
//                       column: 22,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 8,
//                       column: 22,
//                     },
//                     end: {
//                       line: 8,
//                       column: 23,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'exports',
//                   loc: {
//                     start: {
//                       line: 10,
//                       column: 0,
//                     },
//                     end: {
//                       line: 10,
//                       column: 7,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '.',
//                   loc: {
//                     start: {
//                       line: 10,
//                       column: 7,
//                     },
//                     end: {
//                       line: 10,
//                       column: 8,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'x',
//                   loc: {
//                     start: {
//                       line: 10,
//                       column: 8,
//                     },
//                     end: {
//                       line: 10,
//                       column: 9,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: '=',
//                   loc: {
//                     start: {
//                       line: 10,
//                       column: 10,
//                     },
//                     end: {
//                       line: 10,
//                       column: 11,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Identifier',
//                   value: 'x',
//                   loc: {
//                     start: {
//                       line: 10,
//                       column: 12,
//                     },
//                     end: {
//                       line: 10,
//                       column: 13,
//                     },
//                   },
//                 },
//                 {
//                   type: 'Punctuator',
//                   value: ';',
//                   loc: {
//                     start: {
//                       line: 10,
//                       column: 13,
//                     },
//                     end: {
//                       line: 10,
//                       column: 14,
//                     },
//                   },
//                 },
//               ],
//               indent: 0,
//             },
//           },
//         ],
//         loc: {
//           start: {
//             line: 3,
//             column: 531,
//             token: 161,
//           },
//           end: {
//             line: 3,
//             column: 546,
//             token: 165,
//           },
//           lines: {
//             infos: [
//               {
//                 line: "Object.defineProperty(exports, '__esModule', { value: true });",
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 62,
//               },
//               {
//                 line: '',
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 0,
//               },
//               {
//                 line: "function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { var op = ops[i]; var fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }const { resolve } = require('path');",
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 547,
//               },
//               {
//                 line: '',
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 0,
//               },
//               {
//                 line: "var x = _optionalChain([thing, 'optionalAccess', _ => _.stuff]);",
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 64,
//               },
//               {
//                 line: '',
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 0,
//               },
//               {
//                 line: "console.log('hi');",
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 18,
//               },
//               {
//                 line: 'resolve(process.cwd());',
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 23,
//               },
//               {
//                 line: '',
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 0,
//               },
//               {
//                 line: 'exports.x = x;',
//                 indent: 0,
//                 locked: false,
//                 sliceStart: 0,
//                 sliceEnd: 14,
//               },
//             ],
//             mappings: [],
//             cachedSourceMap: null,
//             cachedTabWidth: undefined,
//             length: 10,
//             name: null,
//           },
//           tokens: [
//             {
//               type: 'Identifier',
//               value: 'Object',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 0,
//                 },
//                 end: {
//                   line: 1,
//                   column: 6,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '.',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 6,
//                 },
//                 end: {
//                   line: 1,
//                   column: 7,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'defineProperty',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 7,
//                 },
//                 end: {
//                   line: 1,
//                   column: 21,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 21,
//                 },
//                 end: {
//                   line: 1,
//                   column: 22,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'exports',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 22,
//                 },
//                 end: {
//                   line: 1,
//                   column: 29,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ',',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 29,
//                 },
//                 end: {
//                   line: 1,
//                   column: 30,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'__esModule'",
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 31,
//                 },
//                 end: {
//                   line: 1,
//                   column: 43,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ',',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 43,
//                 },
//                 end: {
//                   line: 1,
//                   column: 44,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '{',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 45,
//                 },
//                 end: {
//                   line: 1,
//                   column: 46,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'value',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 47,
//                 },
//                 end: {
//                   line: 1,
//                   column: 52,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ':',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 52,
//                 },
//                 end: {
//                   line: 1,
//                   column: 53,
//                 },
//               },
//             },
//             {
//               type: 'Boolean',
//               value: 'true',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 54,
//                 },
//                 end: {
//                   line: 1,
//                   column: 58,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '}',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 59,
//                 },
//                 end: {
//                   line: 1,
//                   column: 60,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 60,
//                 },
//                 end: {
//                   line: 1,
//                   column: 61,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 1,
//                   column: 61,
//                 },
//                 end: {
//                   line: 1,
//                   column: 62,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'function',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 0,
//                 },
//                 end: {
//                   line: 3,
//                   column: 8,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: '_optionalChain',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 9,
//                 },
//                 end: {
//                   line: 3,
//                   column: 23,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 23,
//                 },
//                 end: {
//                   line: 3,
//                   column: 24,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'ops',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 24,
//                 },
//                 end: {
//                   line: 3,
//                   column: 27,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 27,
//                 },
//                 end: {
//                   line: 3,
//                   column: 28,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '{',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 29,
//                 },
//                 end: {
//                   line: 3,
//                   column: 30,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'let',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 31,
//                 },
//                 end: {
//                   line: 3,
//                   column: 34,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'lastAccessLHS',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 35,
//                 },
//                 end: {
//                   line: 3,
//                   column: 48,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 49,
//                 },
//                 end: {
//                   line: 3,
//                   column: 50,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'undefined',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 51,
//                 },
//                 end: {
//                   line: 3,
//                   column: 60,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 60,
//                 },
//                 end: {
//                   line: 3,
//                   column: 61,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'let',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 62,
//                 },
//                 end: {
//                   line: 3,
//                   column: 65,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'value',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 66,
//                 },
//                 end: {
//                   line: 3,
//                   column: 71,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 72,
//                 },
//                 end: {
//                   line: 3,
//                   column: 73,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'ops',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 74,
//                 },
//                 end: {
//                   line: 3,
//                   column: 77,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '[',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 77,
//                 },
//                 end: {
//                   line: 3,
//                   column: 78,
//                 },
//               },
//             },
//             {
//               type: 'Numeric',
//               value: '0',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 78,
//                 },
//                 end: {
//                   line: 3,
//                   column: 79,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ']',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 79,
//                 },
//                 end: {
//                   line: 3,
//                   column: 80,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 80,
//                 },
//                 end: {
//                   line: 3,
//                   column: 81,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'let',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 82,
//                 },
//                 end: {
//                   line: 3,
//                   column: 85,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'i',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 86,
//                 },
//                 end: {
//                   line: 3,
//                   column: 87,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 88,
//                 },
//                 end: {
//                   line: 3,
//                   column: 89,
//                 },
//               },
//             },
//             {
//               type: 'Numeric',
//               value: '1',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 90,
//                 },
//                 end: {
//                   line: 3,
//                   column: 91,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 91,
//                 },
//                 end: {
//                   line: 3,
//                   column: 92,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'while',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 93,
//                 },
//                 end: {
//                   line: 3,
//                   column: 98,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 99,
//                 },
//                 end: {
//                   line: 3,
//                   column: 100,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'i',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 100,
//                 },
//                 end: {
//                   line: 3,
//                   column: 101,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '<',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 102,
//                 },
//                 end: {
//                   line: 3,
//                   column: 103,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'ops',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 104,
//                 },
//                 end: {
//                   line: 3,
//                   column: 107,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '.',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 107,
//                 },
//                 end: {
//                   line: 3,
//                   column: 108,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'length',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 108,
//                 },
//                 end: {
//                   line: 3,
//                   column: 114,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 114,
//                 },
//                 end: {
//                   line: 3,
//                   column: 115,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '{',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 116,
//                 },
//                 end: {
//                   line: 3,
//                   column: 117,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'var',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 118,
//                 },
//                 end: {
//                   line: 3,
//                   column: 121,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'op',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 122,
//                 },
//                 end: {
//                   line: 3,
//                   column: 124,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 125,
//                 },
//                 end: {
//                   line: 3,
//                   column: 126,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'ops',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 127,
//                 },
//                 end: {
//                   line: 3,
//                   column: 130,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '[',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 130,
//                 },
//                 end: {
//                   line: 3,
//                   column: 131,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'i',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 131,
//                 },
//                 end: {
//                   line: 3,
//                   column: 132,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ']',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 132,
//                 },
//                 end: {
//                   line: 3,
//                   column: 133,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 133,
//                 },
//                 end: {
//                   line: 3,
//                   column: 134,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'var',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 135,
//                 },
//                 end: {
//                   line: 3,
//                   column: 138,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'fn',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 139,
//                 },
//                 end: {
//                   line: 3,
//                   column: 141,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 142,
//                 },
//                 end: {
//                   line: 3,
//                   column: 143,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'ops',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 144,
//                 },
//                 end: {
//                   line: 3,
//                   column: 147,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '[',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 147,
//                 },
//                 end: {
//                   line: 3,
//                   column: 148,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'i',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 148,
//                 },
//                 end: {
//                   line: 3,
//                   column: 149,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '+',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 150,
//                 },
//                 end: {
//                   line: 3,
//                   column: 151,
//                 },
//               },
//             },
//             {
//               type: 'Numeric',
//               value: '1',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 152,
//                 },
//                 end: {
//                   line: 3,
//                   column: 153,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ']',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 153,
//                 },
//                 end: {
//                   line: 3,
//                   column: 154,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 154,
//                 },
//                 end: {
//                   line: 3,
//                   column: 155,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'i',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 156,
//                 },
//                 end: {
//                   line: 3,
//                   column: 157,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '+=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 158,
//                 },
//                 end: {
//                   line: 3,
//                   column: 160,
//                 },
//               },
//             },
//             {
//               type: 'Numeric',
//               value: '2',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 161,
//                 },
//                 end: {
//                   line: 3,
//                   column: 162,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 162,
//                 },
//                 end: {
//                   line: 3,
//                   column: 163,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'if',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 164,
//                 },
//                 end: {
//                   line: 3,
//                   column: 166,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 167,
//                 },
//                 end: {
//                   line: 3,
//                   column: 168,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 168,
//                 },
//                 end: {
//                   line: 3,
//                   column: 169,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'op',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 169,
//                 },
//                 end: {
//                   line: 3,
//                   column: 171,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '===',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 172,
//                 },
//                 end: {
//                   line: 3,
//                   column: 175,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'optionalAccess'",
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 176,
//                 },
//                 end: {
//                   line: 3,
//                   column: 192,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '||',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 193,
//                 },
//                 end: {
//                   line: 3,
//                   column: 195,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'op',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 196,
//                 },
//                 end: {
//                   line: 3,
//                   column: 198,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '===',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 199,
//                 },
//                 end: {
//                   line: 3,
//                   column: 202,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'optionalCall'",
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 203,
//                 },
//                 end: {
//                   line: 3,
//                   column: 217,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 217,
//                 },
//                 end: {
//                   line: 3,
//                   column: 218,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '&&',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 219,
//                 },
//                 end: {
//                   line: 3,
//                   column: 221,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'value',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 222,
//                 },
//                 end: {
//                   line: 3,
//                   column: 227,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '==',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 228,
//                 },
//                 end: {
//                   line: 3,
//                   column: 230,
//                 },
//               },
//             },
//             {
//               type: 'Null',
//               value: 'null',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 231,
//                 },
//                 end: {
//                   line: 3,
//                   column: 235,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 235,
//                 },
//                 end: {
//                   line: 3,
//                   column: 236,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '{',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 237,
//                 },
//                 end: {
//                   line: 3,
//                   column: 238,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'return',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 239,
//                 },
//                 end: {
//                   line: 3,
//                   column: 245,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'undefined',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 246,
//                 },
//                 end: {
//                   line: 3,
//                   column: 255,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 255,
//                 },
//                 end: {
//                   line: 3,
//                   column: 256,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '}',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 257,
//                 },
//                 end: {
//                   line: 3,
//                   column: 258,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'if',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 259,
//                 },
//                 end: {
//                   line: 3,
//                   column: 261,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 262,
//                 },
//                 end: {
//                   line: 3,
//                   column: 263,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'op',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 263,
//                 },
//                 end: {
//                   line: 3,
//                   column: 265,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '===',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 266,
//                 },
//                 end: {
//                   line: 3,
//                   column: 269,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'access'",
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 270,
//                 },
//                 end: {
//                   line: 3,
//                   column: 278,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '||',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 279,
//                 },
//                 end: {
//                   line: 3,
//                   column: 281,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'op',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 282,
//                 },
//                 end: {
//                   line: 3,
//                   column: 284,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '===',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 285,
//                 },
//                 end: {
//                   line: 3,
//                   column: 288,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'optionalAccess'",
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 289,
//                 },
//                 end: {
//                   line: 3,
//                   column: 305,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 305,
//                 },
//                 end: {
//                   line: 3,
//                   column: 306,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '{',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 307,
//                 },
//                 end: {
//                   line: 3,
//                   column: 308,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'lastAccessLHS',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 309,
//                 },
//                 end: {
//                   line: 3,
//                   column: 322,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 323,
//                 },
//                 end: {
//                   line: 3,
//                   column: 324,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'value',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 325,
//                 },
//                 end: {
//                   line: 3,
//                   column: 330,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 330,
//                 },
//                 end: {
//                   line: 3,
//                   column: 331,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'value',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 332,
//                 },
//                 end: {
//                   line: 3,
//                   column: 337,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 338,
//                 },
//                 end: {
//                   line: 3,
//                   column: 339,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'fn',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 340,
//                 },
//                 end: {
//                   line: 3,
//                   column: 342,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 342,
//                 },
//                 end: {
//                   line: 3,
//                   column: 343,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'value',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 343,
//                 },
//                 end: {
//                   line: 3,
//                   column: 348,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 348,
//                 },
//                 end: {
//                   line: 3,
//                   column: 349,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 349,
//                 },
//                 end: {
//                   line: 3,
//                   column: 350,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '}',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 351,
//                 },
//                 end: {
//                   line: 3,
//                   column: 352,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'else',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 353,
//                 },
//                 end: {
//                   line: 3,
//                   column: 357,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'if',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 358,
//                 },
//                 end: {
//                   line: 3,
//                   column: 360,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 361,
//                 },
//                 end: {
//                   line: 3,
//                   column: 362,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'op',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 362,
//                 },
//                 end: {
//                   line: 3,
//                   column: 364,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '===',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 365,
//                 },
//                 end: {
//                   line: 3,
//                   column: 368,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'call'",
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 369,
//                 },
//                 end: {
//                   line: 3,
//                   column: 375,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '||',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 376,
//                 },
//                 end: {
//                   line: 3,
//                   column: 378,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'op',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 379,
//                 },
//                 end: {
//                   line: 3,
//                   column: 381,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '===',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 382,
//                 },
//                 end: {
//                   line: 3,
//                   column: 385,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'optionalCall'",
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 386,
//                 },
//                 end: {
//                   line: 3,
//                   column: 400,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 400,
//                 },
//                 end: {
//                   line: 3,
//                   column: 401,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '{',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 402,
//                 },
//                 end: {
//                   line: 3,
//                   column: 403,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'value',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 404,
//                 },
//                 end: {
//                   line: 3,
//                   column: 409,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 410,
//                 },
//                 end: {
//                   line: 3,
//                   column: 411,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'fn',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 412,
//                 },
//                 end: {
//                   line: 3,
//                   column: 414,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 414,
//                 },
//                 end: {
//                   line: 3,
//                   column: 415,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 415,
//                 },
//                 end: {
//                   line: 3,
//                   column: 416,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '...',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 416,
//                 },
//                 end: {
//                   line: 3,
//                   column: 419,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'args',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 419,
//                 },
//                 end: {
//                   line: 3,
//                   column: 423,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 423,
//                 },
//                 end: {
//                   line: 3,
//                   column: 424,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=>',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 425,
//                 },
//                 end: {
//                   line: 3,
//                   column: 427,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'value',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 428,
//                 },
//                 end: {
//                   line: 3,
//                   column: 433,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '.',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 433,
//                 },
//                 end: {
//                   line: 3,
//                   column: 434,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'call',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 434,
//                 },
//                 end: {
//                   line: 3,
//                   column: 438,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 438,
//                 },
//                 end: {
//                   line: 3,
//                   column: 439,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'lastAccessLHS',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 439,
//                 },
//                 end: {
//                   line: 3,
//                   column: 452,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ',',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 452,
//                 },
//                 end: {
//                   line: 3,
//                   column: 453,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '...',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 454,
//                 },
//                 end: {
//                   line: 3,
//                   column: 457,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'args',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 457,
//                 },
//                 end: {
//                   line: 3,
//                   column: 461,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 461,
//                 },
//                 end: {
//                   line: 3,
//                   column: 462,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 462,
//                 },
//                 end: {
//                   line: 3,
//                   column: 463,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 463,
//                 },
//                 end: {
//                   line: 3,
//                   column: 464,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'lastAccessLHS',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 465,
//                 },
//                 end: {
//                   line: 3,
//                   column: 478,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 479,
//                 },
//                 end: {
//                   line: 3,
//                   column: 480,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'undefined',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 481,
//                 },
//                 end: {
//                   line: 3,
//                   column: 490,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 490,
//                 },
//                 end: {
//                   line: 3,
//                   column: 491,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '}',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 492,
//                 },
//                 end: {
//                   line: 3,
//                   column: 493,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '}',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 494,
//                 },
//                 end: {
//                   line: 3,
//                   column: 495,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'return',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 496,
//                 },
//                 end: {
//                   line: 3,
//                   column: 502,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'value',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 503,
//                 },
//                 end: {
//                   line: 3,
//                   column: 508,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 508,
//                 },
//                 end: {
//                   line: 3,
//                   column: 509,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '}',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 510,
//                 },
//                 end: {
//                   line: 3,
//                   column: 511,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'const',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 511,
//                 },
//                 end: {
//                   line: 3,
//                   column: 516,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '{',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 517,
//                 },
//                 end: {
//                   line: 3,
//                   column: 518,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'resolve',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 519,
//                 },
//                 end: {
//                   line: 3,
//                   column: 526,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '}',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 527,
//                 },
//                 end: {
//                   line: 3,
//                   column: 528,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 529,
//                 },
//                 end: {
//                   line: 3,
//                   column: 530,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'require',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 531,
//                 },
//                 end: {
//                   line: 3,
//                   column: 538,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 538,
//                 },
//                 end: {
//                   line: 3,
//                   column: 539,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'path'",
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 539,
//                 },
//                 end: {
//                   line: 3,
//                   column: 545,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 545,
//                 },
//                 end: {
//                   line: 3,
//                   column: 546,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 3,
//                   column: 546,
//                 },
//                 end: {
//                   line: 3,
//                   column: 547,
//                 },
//               },
//             },
//             {
//               type: 'Keyword',
//               value: 'var',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 0,
//                 },
//                 end: {
//                   line: 5,
//                   column: 3,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'x',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 4,
//                 },
//                 end: {
//                   line: 5,
//                   column: 5,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 6,
//                 },
//                 end: {
//                   line: 5,
//                   column: 7,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: '_optionalChain',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 8,
//                 },
//                 end: {
//                   line: 5,
//                   column: 22,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 22,
//                 },
//                 end: {
//                   line: 5,
//                   column: 23,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '[',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 23,
//                 },
//                 end: {
//                   line: 5,
//                   column: 24,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'thing',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 24,
//                 },
//                 end: {
//                   line: 5,
//                   column: 29,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ',',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 29,
//                 },
//                 end: {
//                   line: 5,
//                   column: 30,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'optionalAccess'",
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 31,
//                 },
//                 end: {
//                   line: 5,
//                   column: 47,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ',',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 47,
//                 },
//                 end: {
//                   line: 5,
//                   column: 48,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: '_',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 49,
//                 },
//                 end: {
//                   line: 5,
//                   column: 50,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=>',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 51,
//                 },
//                 end: {
//                   line: 5,
//                   column: 53,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: '_',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 54,
//                 },
//                 end: {
//                   line: 5,
//                   column: 55,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '.',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 55,
//                 },
//                 end: {
//                   line: 5,
//                   column: 56,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'stuff',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 56,
//                 },
//                 end: {
//                   line: 5,
//                   column: 61,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ']',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 61,
//                 },
//                 end: {
//                   line: 5,
//                   column: 62,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 62,
//                 },
//                 end: {
//                   line: 5,
//                   column: 63,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 5,
//                   column: 63,
//                 },
//                 end: {
//                   line: 5,
//                   column: 64,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'console',
//               loc: {
//                 start: {
//                   line: 7,
//                   column: 0,
//                 },
//                 end: {
//                   line: 7,
//                   column: 7,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '.',
//               loc: {
//                 start: {
//                   line: 7,
//                   column: 7,
//                 },
//                 end: {
//                   line: 7,
//                   column: 8,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'log',
//               loc: {
//                 start: {
//                   line: 7,
//                   column: 8,
//                 },
//                 end: {
//                   line: 7,
//                   column: 11,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 7,
//                   column: 11,
//                 },
//                 end: {
//                   line: 7,
//                   column: 12,
//                 },
//               },
//             },
//             {
//               type: 'String',
//               value: "'hi'",
//               loc: {
//                 start: {
//                   line: 7,
//                   column: 12,
//                 },
//                 end: {
//                   line: 7,
//                   column: 16,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 7,
//                   column: 16,
//                 },
//                 end: {
//                   line: 7,
//                   column: 17,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 7,
//                   column: 17,
//                 },
//                 end: {
//                   line: 7,
//                   column: 18,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'resolve',
//               loc: {
//                 start: {
//                   line: 8,
//                   column: 0,
//                 },
//                 end: {
//                   line: 8,
//                   column: 7,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 8,
//                   column: 7,
//                 },
//                 end: {
//                   line: 8,
//                   column: 8,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'process',
//               loc: {
//                 start: {
//                   line: 8,
//                   column: 8,
//                 },
//                 end: {
//                   line: 8,
//                   column: 15,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '.',
//               loc: {
//                 start: {
//                   line: 8,
//                   column: 15,
//                 },
//                 end: {
//                   line: 8,
//                   column: 16,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'cwd',
//               loc: {
//                 start: {
//                   line: 8,
//                   column: 16,
//                 },
//                 end: {
//                   line: 8,
//                   column: 19,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '(',
//               loc: {
//                 start: {
//                   line: 8,
//                   column: 19,
//                 },
//                 end: {
//                   line: 8,
//                   column: 20,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 8,
//                   column: 20,
//                 },
//                 end: {
//                   line: 8,
//                   column: 21,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ')',
//               loc: {
//                 start: {
//                   line: 8,
//                   column: 21,
//                 },
//                 end: {
//                   line: 8,
//                   column: 22,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 8,
//                   column: 22,
//                 },
//                 end: {
//                   line: 8,
//                   column: 23,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'exports',
//               loc: {
//                 start: {
//                   line: 10,
//                   column: 0,
//                 },
//                 end: {
//                   line: 10,
//                   column: 7,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '.',
//               loc: {
//                 start: {
//                   line: 10,
//                   column: 7,
//                 },
//                 end: {
//                   line: 10,
//                   column: 8,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'x',
//               loc: {
//                 start: {
//                   line: 10,
//                   column: 8,
//                 },
//                 end: {
//                   line: 10,
//                   column: 9,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: '=',
//               loc: {
//                 start: {
//                   line: 10,
//                   column: 10,
//                 },
//                 end: {
//                   line: 10,
//                   column: 11,
//                 },
//               },
//             },
//             {
//               type: 'Identifier',
//               value: 'x',
//               loc: {
//                 start: {
//                   line: 10,
//                   column: 12,
//                 },
//                 end: {
//                   line: 10,
//                   column: 13,
//                 },
//               },
//             },
//             {
//               type: 'Punctuator',
//               value: ';',
//               loc: {
//                 start: {
//                   line: 10,
//                   column: 13,
//                 },
//                 end: {
//                   line: 10,
//                   column: 14,
//                 },
//               },
//             },
//           ],
//           indent: 0,
//         },
//       },
//       loc: {
//         start: {
//           line: 3,
//           column: 517,
//           token: 157,
//         },
//         end: {
//           line: 3,
//           column: 546,
//           token: 165,
//         },
//         lines: {
//           infos: [
//             {
//               line: "Object.defineProperty(exports, '__esModule', { value: true });",
//               indent: 0,
//               locked: false,
//               sliceStart: 0,
//               sliceEnd: 62,
//             },
//             {
//               line: '',
//               indent: 0,
//               locked: false,
//               sliceStart: 0,
//               sliceEnd: 0,
//             },
//             {
//               line: "function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { var op = ops[i]; var fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }const { resolve } = require('path');",
//               indent: 0,
//               locked: false,
//               sliceStart: 0,
//               sliceEnd: 547,
//             },
//             {
//               line: '',
//               indent: 0,
//               locked: false,
//               sliceStart: 0,
//               sliceEnd: 0,
//             },
//             {
//               line: "var x = _optionalChain([thing, 'optionalAccess', _ => _.stuff]);",
//               indent: 0,
//               locked: false,
//               sliceStart: 0,
//               sliceEnd: 64,
//             },
//             {
//               line: '',
//               indent: 0,
//               locked: false,
//               sliceStart: 0,
//               sliceEnd: 0,
//             },
//             {
//               line: "console.log('hi');",
//               indent: 0,
//               locked: false,
//               sliceStart: 0,
//               sliceEnd: 18,
//             },
//             {
//               line: 'resolve(process.cwd());',
//               indent: 0,
//               locked: false,
//               sliceStart: 0,
//               sliceEnd: 23,
//             },
//             {
//               line: '',
//               indent: 0,
//               locked: false,
//               sliceStart: 0,
//               sliceEnd: 0,
//             },
//             {
//               line: 'exports.x = x;',
//               indent: 0,
//               locked: false,
//               sliceStart: 0,
//               sliceEnd: 14,
//             },
//           ],
//           mappings: [],
//           cachedSourceMap: null,
//           cachedTabWidth: undefined,
//           length: 10,
//           name: null,
//         },
//         tokens: [
//           {
//             type: 'Identifier',
//             value: 'Object',
//             loc: {
//               start: {
//                 line: 1,
//                 column: 0,
//               },
//               end: {
//                 line: 1,
//                 column: 6,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '.',
//             loc: {
//               start: {
//                 line: 1,
//                 column: 6,
//               },
//               end: {
//                 line: 1,
//                 column: 7,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'defineProperty',
//             loc: {
//               start: {
//                 line: 1,
//                 column: 7,
//               },
//               end: {
//                 line: 1,
//                 column: 21,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '(',
//             loc: {
//               start: {
//                 line: 1,
//                 column: 21,
//               },
//               end: {
//                 line: 1,
//                 column: 22,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'exports',
//             loc: {
//               start: {
//                 line: 1,
//                 column: 22,
//               },
//               end: {
//                 line: 1,
//                 column: 29,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ',',
//             loc: {
//               start: {
//                 line: 1,
//                 column: 29,
//               },
//               end: {
//                 line: 1,
//                 column: 30,
//               },
//             },
//           },
//           {
//             type: 'String',
//             value: "'__esModule'",
//             loc: {
//               start: {
//                 line: 1,
//                 column: 31,
//               },
//               end: {
//                 line: 1,
//                 column: 43,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ',',
//             loc: {
//               start: {
//                 line: 1,
//                 column: 43,
//               },
//               end: {
//                 line: 1,
//                 column: 44,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '{',
//             loc: {
//               start: {
//                 line: 1,
//                 column: 45,
//               },
//               end: {
//                 line: 1,
//                 column: 46,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'value',
//             loc: {
//               start: {
//                 line: 1,
//                 column: 47,
//               },
//               end: {
//                 line: 1,
//                 column: 52,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ':',
//             loc: {
//               start: {
//                 line: 1,
//                 column: 52,
//               },
//               end: {
//                 line: 1,
//                 column: 53,
//               },
//             },
//           },
//           {
//             type: 'Boolean',
//             value: 'true',
//             loc: {
//               start: {
//                 line: 1,
//                 column: 54,
//               },
//               end: {
//                 line: 1,
//                 column: 58,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '}',
//             loc: {
//               start: {
//                 line: 1,
//                 column: 59,
//               },
//               end: {
//                 line: 1,
//                 column: 60,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ')',
//             loc: {
//               start: {
//                 line: 1,
//                 column: 60,
//               },
//               end: {
//                 line: 1,
//                 column: 61,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ';',
//             loc: {
//               start: {
//                 line: 1,
//                 column: 61,
//               },
//               end: {
//                 line: 1,
//                 column: 62,
//               },
//             },
//           },
//           {
//             type: 'Keyword',
//             value: 'function',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 0,
//               },
//               end: {
//                 line: 3,
//                 column: 8,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: '_optionalChain',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 9,
//               },
//               end: {
//                 line: 3,
//                 column: 23,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '(',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 23,
//               },
//               end: {
//                 line: 3,
//                 column: 24,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'ops',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 24,
//               },
//               end: {
//                 line: 3,
//                 column: 27,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ')',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 27,
//               },
//               end: {
//                 line: 3,
//                 column: 28,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '{',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 29,
//               },
//               end: {
//                 line: 3,
//                 column: 30,
//               },
//             },
//           },
//           {
//             type: 'Keyword',
//             value: 'let',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 31,
//               },
//               end: {
//                 line: 3,
//                 column: 34,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'lastAccessLHS',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 35,
//               },
//               end: {
//                 line: 3,
//                 column: 48,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '=',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 49,
//               },
//               end: {
//                 line: 3,
//                 column: 50,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'undefined',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 51,
//               },
//               end: {
//                 line: 3,
//                 column: 60,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ';',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 60,
//               },
//               end: {
//                 line: 3,
//                 column: 61,
//               },
//             },
//           },
//           {
//             type: 'Keyword',
//             value: 'let',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 62,
//               },
//               end: {
//                 line: 3,
//                 column: 65,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'value',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 66,
//               },
//               end: {
//                 line: 3,
//                 column: 71,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '=',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 72,
//               },
//               end: {
//                 line: 3,
//                 column: 73,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'ops',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 74,
//               },
//               end: {
//                 line: 3,
//                 column: 77,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '[',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 77,
//               },
//               end: {
//                 line: 3,
//                 column: 78,
//               },
//             },
//           },
//           {
//             type: 'Numeric',
//             value: '0',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 78,
//               },
//               end: {
//                 line: 3,
//                 column: 79,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ']',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 79,
//               },
//               end: {
//                 line: 3,
//                 column: 80,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ';',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 80,
//               },
//               end: {
//                 line: 3,
//                 column: 81,
//               },
//             },
//           },
//           {
//             type: 'Keyword',
//             value: 'let',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 82,
//               },
//               end: {
//                 line: 3,
//                 column: 85,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'i',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 86,
//               },
//               end: {
//                 line: 3,
//                 column: 87,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '=',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 88,
//               },
//               end: {
//                 line: 3,
//                 column: 89,
//               },
//             },
//           },
//           {
//             type: 'Numeric',
//             value: '1',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 90,
//               },
//               end: {
//                 line: 3,
//                 column: 91,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ';',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 91,
//               },
//               end: {
//                 line: 3,
//                 column: 92,
//               },
//             },
//           },
//           {
//             type: 'Keyword',
//             value: 'while',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 93,
//               },
//               end: {
//                 line: 3,
//                 column: 98,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '(',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 99,
//               },
//               end: {
//                 line: 3,
//                 column: 100,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'i',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 100,
//               },
//               end: {
//                 line: 3,
//                 column: 101,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '<',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 102,
//               },
//               end: {
//                 line: 3,
//                 column: 103,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'ops',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 104,
//               },
//               end: {
//                 line: 3,
//                 column: 107,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '.',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 107,
//               },
//               end: {
//                 line: 3,
//                 column: 108,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'length',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 108,
//               },
//               end: {
//                 line: 3,
//                 column: 114,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ')',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 114,
//               },
//               end: {
//                 line: 3,
//                 column: 115,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '{',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 116,
//               },
//               end: {
//                 line: 3,
//                 column: 117,
//               },
//             },
//           },
//           {
//             type: 'Keyword',
//             value: 'var',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 118,
//               },
//               end: {
//                 line: 3,
//                 column: 121,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'op',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 122,
//               },
//               end: {
//                 line: 3,
//                 column: 124,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '=',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 125,
//               },
//               end: {
//                 line: 3,
//                 column: 126,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'ops',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 127,
//               },
//               end: {
//                 line: 3,
//                 column: 130,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '[',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 130,
//               },
//               end: {
//                 line: 3,
//                 column: 131,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'i',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 131,
//               },
//               end: {
//                 line: 3,
//                 column: 132,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ']',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 132,
//               },
//               end: {
//                 line: 3,
//                 column: 133,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ';',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 133,
//               },
//               end: {
//                 line: 3,
//                 column: 134,
//               },
//             },
//           },
//           {
//             type: 'Keyword',
//             value: 'var',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 135,
//               },
//               end: {
//                 line: 3,
//                 column: 138,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'fn',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 139,
//               },
//               end: {
//                 line: 3,
//                 column: 141,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '=',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 142,
//               },
//               end: {
//                 line: 3,
//                 column: 143,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'ops',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 144,
//               },
//               end: {
//                 line: 3,
//                 column: 147,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '[',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 147,
//               },
//               end: {
//                 line: 3,
//                 column: 148,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'i',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 148,
//               },
//               end: {
//                 line: 3,
//                 column: 149,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '+',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 150,
//               },
//               end: {
//                 line: 3,
//                 column: 151,
//               },
//             },
//           },
//           {
//             type: 'Numeric',
//             value: '1',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 152,
//               },
//               end: {
//                 line: 3,
//                 column: 153,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ']',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 153,
//               },
//               end: {
//                 line: 3,
//                 column: 154,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ';',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 154,
//               },
//               end: {
//                 line: 3,
//                 column: 155,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'i',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 156,
//               },
//               end: {
//                 line: 3,
//                 column: 157,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '+=',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 158,
//               },
//               end: {
//                 line: 3,
//                 column: 160,
//               },
//             },
//           },
//           {
//             type: 'Numeric',
//             value: '2',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 161,
//               },
//               end: {
//                 line: 3,
//                 column: 162,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ';',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 162,
//               },
//               end: {
//                 line: 3,
//                 column: 163,
//               },
//             },
//           },
//           {
//             type: 'Keyword',
//             value: 'if',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 164,
//               },
//               end: {
//                 line: 3,
//                 column: 166,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '(',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 167,
//               },
//               end: {
//                 line: 3,
//                 column: 168,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '(',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 168,
//               },
//               end: {
//                 line: 3,
//                 column: 169,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'op',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 169,
//               },
//               end: {
//                 line: 3,
//                 column: 171,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '===',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 172,
//               },
//               end: {
//                 line: 3,
//                 column: 175,
//               },
//             },
//           },
//           {
//             type: 'String',
//             value: "'optionalAccess'",
//             loc: {
//               start: {
//                 line: 3,
//                 column: 176,
//               },
//               end: {
//                 line: 3,
//                 column: 192,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '||',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 193,
//               },
//               end: {
//                 line: 3,
//                 column: 195,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'op',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 196,
//               },
//               end: {
//                 line: 3,
//                 column: 198,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '===',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 199,
//               },
//               end: {
//                 line: 3,
//                 column: 202,
//               },
//             },
//           },
//           {
//             type: 'String',
//             value: "'optionalCall'",
//             loc: {
//               start: {
//                 line: 3,
//                 column: 203,
//               },
//               end: {
//                 line: 3,
//                 column: 217,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ')',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 217,
//               },
//               end: {
//                 line: 3,
//                 column: 218,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '&&',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 219,
//               },
//               end: {
//                 line: 3,
//                 column: 221,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'value',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 222,
//               },
//               end: {
//                 line: 3,
//                 column: 227,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '==',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 228,
//               },
//               end: {
//                 line: 3,
//                 column: 230,
//               },
//             },
//           },
//           {
//             type: 'Null',
//             value: 'null',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 231,
//               },
//               end: {
//                 line: 3,
//                 column: 235,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ')',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 235,
//               },
//               end: {
//                 line: 3,
//                 column: 236,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '{',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 237,
//               },
//               end: {
//                 line: 3,
//                 column: 238,
//               },
//             },
//           },
//           {
//             type: 'Keyword',
//             value: 'return',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 239,
//               },
//               end: {
//                 line: 3,
//                 column: 245,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'undefined',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 246,
//               },
//               end: {
//                 line: 3,
//                 column: 255,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ';',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 255,
//               },
//               end: {
//                 line: 3,
//                 column: 256,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '}',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 257,
//               },
//               end: {
//                 line: 3,
//                 column: 258,
//               },
//             },
//           },
//           {
//             type: 'Keyword',
//             value: 'if',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 259,
//               },
//               end: {
//                 line: 3,
//                 column: 261,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '(',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 262,
//               },
//               end: {
//                 line: 3,
//                 column: 263,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'op',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 263,
//               },
//               end: {
//                 line: 3,
//                 column: 265,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '===',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 266,
//               },
//               end: {
//                 line: 3,
//                 column: 269,
//               },
//             },
//           },
//           {
//             type: 'String',
//             value: "'access'",
//             loc: {
//               start: {
//                 line: 3,
//                 column: 270,
//               },
//               end: {
//                 line: 3,
//                 column: 278,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '||',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 279,
//               },
//               end: {
//                 line: 3,
//                 column: 281,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'op',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 282,
//               },
//               end: {
//                 line: 3,
//                 column: 284,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '===',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 285,
//               },
//               end: {
//                 line: 3,
//                 column: 288,
//               },
//             },
//           },
//           {
//             type: 'String',
//             value: "'optionalAccess'",
//             loc: {
//               start: {
//                 line: 3,
//                 column: 289,
//               },
//               end: {
//                 line: 3,
//                 column: 305,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ')',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 305,
//               },
//               end: {
//                 line: 3,
//                 column: 306,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '{',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 307,
//               },
//               end: {
//                 line: 3,
//                 column: 308,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'lastAccessLHS',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 309,
//               },
//               end: {
//                 line: 3,
//                 column: 322,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '=',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 323,
//               },
//               end: {
//                 line: 3,
//                 column: 324,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'value',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 325,
//               },
//               end: {
//                 line: 3,
//                 column: 330,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ';',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 330,
//               },
//               end: {
//                 line: 3,
//                 column: 331,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'value',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 332,
//               },
//               end: {
//                 line: 3,
//                 column: 337,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '=',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 338,
//               },
//               end: {
//                 line: 3,
//                 column: 339,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'fn',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 340,
//               },
//               end: {
//                 line: 3,
//                 column: 342,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '(',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 342,
//               },
//               end: {
//                 line: 3,
//                 column: 343,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'value',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 343,
//               },
//               end: {
//                 line: 3,
//                 column: 348,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ')',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 348,
//               },
//               end: {
//                 line: 3,
//                 column: 349,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ';',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 349,
//               },
//               end: {
//                 line: 3,
//                 column: 350,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '}',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 351,
//               },
//               end: {
//                 line: 3,
//                 column: 352,
//               },
//             },
//           },
//           {
//             type: 'Keyword',
//             value: 'else',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 353,
//               },
//               end: {
//                 line: 3,
//                 column: 357,
//               },
//             },
//           },
//           {
//             type: 'Keyword',
//             value: 'if',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 358,
//               },
//               end: {
//                 line: 3,
//                 column: 360,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '(',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 361,
//               },
//               end: {
//                 line: 3,
//                 column: 362,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'op',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 362,
//               },
//               end: {
//                 line: 3,
//                 column: 364,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '===',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 365,
//               },
//               end: {
//                 line: 3,
//                 column: 368,
//               },
//             },
//           },
//           {
//             type: 'String',
//             value: "'call'",
//             loc: {
//               start: {
//                 line: 3,
//                 column: 369,
//               },
//               end: {
//                 line: 3,
//                 column: 375,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '||',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 376,
//               },
//               end: {
//                 line: 3,
//                 column: 378,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'op',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 379,
//               },
//               end: {
//                 line: 3,
//                 column: 381,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '===',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 382,
//               },
//               end: {
//                 line: 3,
//                 column: 385,
//               },
//             },
//           },
//           {
//             type: 'String',
//             value: "'optionalCall'",
//             loc: {
//               start: {
//                 line: 3,
//                 column: 386,
//               },
//               end: {
//                 line: 3,
//                 column: 400,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ')',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 400,
//               },
//               end: {
//                 line: 3,
//                 column: 401,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '{',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 402,
//               },
//               end: {
//                 line: 3,
//                 column: 403,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'value',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 404,
//               },
//               end: {
//                 line: 3,
//                 column: 409,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '=',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 410,
//               },
//               end: {
//                 line: 3,
//                 column: 411,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'fn',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 412,
//               },
//               end: {
//                 line: 3,
//                 column: 414,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '(',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 414,
//               },
//               end: {
//                 line: 3,
//                 column: 415,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '(',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 415,
//               },
//               end: {
//                 line: 3,
//                 column: 416,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '...',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 416,
//               },
//               end: {
//                 line: 3,
//                 column: 419,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'args',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 419,
//               },
//               end: {
//                 line: 3,
//                 column: 423,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ')',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 423,
//               },
//               end: {
//                 line: 3,
//                 column: 424,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '=>',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 425,
//               },
//               end: {
//                 line: 3,
//                 column: 427,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'value',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 428,
//               },
//               end: {
//                 line: 3,
//                 column: 433,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '.',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 433,
//               },
//               end: {
//                 line: 3,
//                 column: 434,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'call',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 434,
//               },
//               end: {
//                 line: 3,
//                 column: 438,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '(',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 438,
//               },
//               end: {
//                 line: 3,
//                 column: 439,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'lastAccessLHS',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 439,
//               },
//               end: {
//                 line: 3,
//                 column: 452,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ',',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 452,
//               },
//               end: {
//                 line: 3,
//                 column: 453,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '...',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 454,
//               },
//               end: {
//                 line: 3,
//                 column: 457,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'args',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 457,
//               },
//               end: {
//                 line: 3,
//                 column: 461,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ')',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 461,
//               },
//               end: {
//                 line: 3,
//                 column: 462,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ')',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 462,
//               },
//               end: {
//                 line: 3,
//                 column: 463,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ';',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 463,
//               },
//               end: {
//                 line: 3,
//                 column: 464,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'lastAccessLHS',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 465,
//               },
//               end: {
//                 line: 3,
//                 column: 478,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '=',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 479,
//               },
//               end: {
//                 line: 3,
//                 column: 480,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'undefined',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 481,
//               },
//               end: {
//                 line: 3,
//                 column: 490,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ';',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 490,
//               },
//               end: {
//                 line: 3,
//                 column: 491,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '}',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 492,
//               },
//               end: {
//                 line: 3,
//                 column: 493,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '}',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 494,
//               },
//               end: {
//                 line: 3,
//                 column: 495,
//               },
//             },
//           },
//           {
//             type: 'Keyword',
//             value: 'return',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 496,
//               },
//               end: {
//                 line: 3,
//                 column: 502,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'value',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 503,
//               },
//               end: {
//                 line: 3,
//                 column: 508,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ';',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 508,
//               },
//               end: {
//                 line: 3,
//                 column: 509,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '}',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 510,
//               },
//               end: {
//                 line: 3,
//                 column: 511,
//               },
//             },
//           },
//           {
//             type: 'Keyword',
//             value: 'const',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 511,
//               },
//               end: {
//                 line: 3,
//                 column: 516,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '{',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 517,
//               },
//               end: {
//                 line: 3,
//                 column: 518,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'resolve',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 519,
//               },
//               end: {
//                 line: 3,
//                 column: 526,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '}',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 527,
//               },
//               end: {
//                 line: 3,
//                 column: 528,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '=',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 529,
//               },
//               end: {
//                 line: 3,
//                 column: 530,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'require',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 531,
//               },
//               end: {
//                 line: 3,
//                 column: 538,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '(',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 538,
//               },
//               end: {
//                 line: 3,
//                 column: 539,
//               },
//             },
//           },
//           {
//             type: 'String',
//             value: "'path'",
//             loc: {
//               start: {
//                 line: 3,
//                 column: 539,
//               },
//               end: {
//                 line: 3,
//                 column: 545,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ')',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 545,
//               },
//               end: {
//                 line: 3,
//                 column: 546,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ';',
//             loc: {
//               start: {
//                 line: 3,
//                 column: 546,
//               },
//               end: {
//                 line: 3,
//                 column: 547,
//               },
//             },
//           },
//           {
//             type: 'Keyword',
//             value: 'var',
//             loc: {
//               start: {
//                 line: 5,
//                 column: 0,
//               },
//               end: {
//                 line: 5,
//                 column: 3,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'x',
//             loc: {
//               start: {
//                 line: 5,
//                 column: 4,
//               },
//               end: {
//                 line: 5,
//                 column: 5,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '=',
//             loc: {
//               start: {
//                 line: 5,
//                 column: 6,
//               },
//               end: {
//                 line: 5,
//                 column: 7,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: '_optionalChain',
//             loc: {
//               start: {
//                 line: 5,
//                 column: 8,
//               },
//               end: {
//                 line: 5,
//                 column: 22,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '(',
//             loc: {
//               start: {
//                 line: 5,
//                 column: 22,
//               },
//               end: {
//                 line: 5,
//                 column: 23,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '[',
//             loc: {
//               start: {
//                 line: 5,
//                 column: 23,
//               },
//               end: {
//                 line: 5,
//                 column: 24,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'thing',
//             loc: {
//               start: {
//                 line: 5,
//                 column: 24,
//               },
//               end: {
//                 line: 5,
//                 column: 29,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ',',
//             loc: {
//               start: {
//                 line: 5,
//                 column: 29,
//               },
//               end: {
//                 line: 5,
//                 column: 30,
//               },
//             },
//           },
//           {
//             type: 'String',
//             value: "'optionalAccess'",
//             loc: {
//               start: {
//                 line: 5,
//                 column: 31,
//               },
//               end: {
//                 line: 5,
//                 column: 47,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ',',
//             loc: {
//               start: {
//                 line: 5,
//                 column: 47,
//               },
//               end: {
//                 line: 5,
//                 column: 48,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: '_',
//             loc: {
//               start: {
//                 line: 5,
//                 column: 49,
//               },
//               end: {
//                 line: 5,
//                 column: 50,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '=>',
//             loc: {
//               start: {
//                 line: 5,
//                 column: 51,
//               },
//               end: {
//                 line: 5,
//                 column: 53,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: '_',
//             loc: {
//               start: {
//                 line: 5,
//                 column: 54,
//               },
//               end: {
//                 line: 5,
//                 column: 55,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '.',
//             loc: {
//               start: {
//                 line: 5,
//                 column: 55,
//               },
//               end: {
//                 line: 5,
//                 column: 56,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'stuff',
//             loc: {
//               start: {
//                 line: 5,
//                 column: 56,
//               },
//               end: {
//                 line: 5,
//                 column: 61,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ']',
//             loc: {
//               start: {
//                 line: 5,
//                 column: 61,
//               },
//               end: {
//                 line: 5,
//                 column: 62,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ')',
//             loc: {
//               start: {
//                 line: 5,
//                 column: 62,
//               },
//               end: {
//                 line: 5,
//                 column: 63,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ';',
//             loc: {
//               start: {
//                 line: 5,
//                 column: 63,
//               },
//               end: {
//                 line: 5,
//                 column: 64,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'console',
//             loc: {
//               start: {
//                 line: 7,
//                 column: 0,
//               },
//               end: {
//                 line: 7,
//                 column: 7,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '.',
//             loc: {
//               start: {
//                 line: 7,
//                 column: 7,
//               },
//               end: {
//                 line: 7,
//                 column: 8,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'log',
//             loc: {
//               start: {
//                 line: 7,
//                 column: 8,
//               },
//               end: {
//                 line: 7,
//                 column: 11,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '(',
//             loc: {
//               start: {
//                 line: 7,
//                 column: 11,
//               },
//               end: {
//                 line: 7,
//                 column: 12,
//               },
//             },
//           },
//           {
//             type: 'String',
//             value: "'hi'",
//             loc: {
//               start: {
//                 line: 7,
//                 column: 12,
//               },
//               end: {
//                 line: 7,
//                 column: 16,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ')',
//             loc: {
//               start: {
//                 line: 7,
//                 column: 16,
//               },
//               end: {
//                 line: 7,
//                 column: 17,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ';',
//             loc: {
//               start: {
//                 line: 7,
//                 column: 17,
//               },
//               end: {
//                 line: 7,
//                 column: 18,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'resolve',
//             loc: {
//               start: {
//                 line: 8,
//                 column: 0,
//               },
//               end: {
//                 line: 8,
//                 column: 7,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '(',
//             loc: {
//               start: {
//                 line: 8,
//                 column: 7,
//               },
//               end: {
//                 line: 8,
//                 column: 8,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'process',
//             loc: {
//               start: {
//                 line: 8,
//                 column: 8,
//               },
//               end: {
//                 line: 8,
//                 column: 15,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '.',
//             loc: {
//               start: {
//                 line: 8,
//                 column: 15,
//               },
//               end: {
//                 line: 8,
//                 column: 16,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'cwd',
//             loc: {
//               start: {
//                 line: 8,
//                 column: 16,
//               },
//               end: {
//                 line: 8,
//                 column: 19,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '(',
//             loc: {
//               start: {
//                 line: 8,
//                 column: 19,
//               },
//               end: {
//                 line: 8,
//                 column: 20,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ')',
//             loc: {
//               start: {
//                 line: 8,
//                 column: 20,
//               },
//               end: {
//                 line: 8,
//                 column: 21,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ')',
//             loc: {
//               start: {
//                 line: 8,
//                 column: 21,
//               },
//               end: {
//                 line: 8,
//                 column: 22,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ';',
//             loc: {
//               start: {
//                 line: 8,
//                 column: 22,
//               },
//               end: {
//                 line: 8,
//                 column: 23,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'exports',
//             loc: {
//               start: {
//                 line: 10,
//                 column: 0,
//               },
//               end: {
//                 line: 10,
//                 column: 7,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '.',
//             loc: {
//               start: {
//                 line: 10,
//                 column: 7,
//               },
//               end: {
//                 line: 10,
//                 column: 8,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'x',
//             loc: {
//               start: {
//                 line: 10,
//                 column: 8,
//               },
//               end: {
//                 line: 10,
//                 column: 9,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: '=',
//             loc: {
//               start: {
//                 line: 10,
//                 column: 10,
//               },
//               end: {
//                 line: 10,
//                 column: 11,
//               },
//             },
//           },
//           {
//             type: 'Identifier',
//             value: 'x',
//             loc: {
//               start: {
//                 line: 10,
//                 column: 12,
//               },
//               end: {
//                 line: 10,
//                 column: 13,
//               },
//             },
//           },
//           {
//             type: 'Punctuator',
//             value: ';',
//             loc: {
//               start: {
//                 line: 10,
//                 column: 13,
//               },
//               end: {
//                 line: 10,
//                 column: 14,
//               },
//             },
//           },
//         ],
//         indent: 0,
//       },
//     },
//   ],
//   kind: 'const',
//   loc: {
//     start: {
//       line: 3,
//       column: 511,
//       token: 156,
//     },
//     end: {
//       line: 3,
//       column: 547,
//       token: 166,
//     },
//     lines: {
//       infos: [
//         {
//           line: "Object.defineProperty(exports, '__esModule', { value: true });",
//           indent: 0,
//           locked: false,
//           sliceStart: 0,
//           sliceEnd: 62,
//         },
//         {
//           line: '',
//           indent: 0,
//           locked: false,
//           sliceStart: 0,
//           sliceEnd: 0,
//         },
//         {
//           line: "function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { var op = ops[i]; var fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }const { resolve } = require('path');",
//           indent: 0,
//           locked: false,
//           sliceStart: 0,
//           sliceEnd: 547,
//         },
//         {
//           line: '',
//           indent: 0,
//           locked: false,
//           sliceStart: 0,
//           sliceEnd: 0,
//         },
//         {
//           line: "var x = _optionalChain([thing, 'optionalAccess', _ => _.stuff]);",
//           indent: 0,
//           locked: false,
//           sliceStart: 0,
//           sliceEnd: 64,
//         },
//         {
//           line: '',
//           indent: 0,
//           locked: false,
//           sliceStart: 0,
//           sliceEnd: 0,
//         },
//         {
//           line: "console.log('hi');",
//           indent: 0,
//           locked: false,
//           sliceStart: 0,
//           sliceEnd: 18,
//         },
//         {
//           line: 'resolve(process.cwd());',
//           indent: 0,
//           locked: false,
//           sliceStart: 0,
//           sliceEnd: 23,
//         },
//         {
//           line: '',
//           indent: 0,
//           locked: false,
//           sliceStart: 0,
//           sliceEnd: 0,
//         },
//         {
//           line: 'exports.x = x;',
//           indent: 0,
//           locked: false,
//           sliceStart: 0,
//           sliceEnd: 14,
//         },
//       ],
//       mappings: [],
//       cachedSourceMap: null,
//       cachedTabWidth: undefined,
//       length: 10,
//       name: null,
//     },
//     tokens: [
//       {
//         type: 'Identifier',
//         value: 'Object',
//         loc: {
//           start: {
//             line: 1,
//             column: 0,
//           },
//           end: {
//             line: 1,
//             column: 6,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '.',
//         loc: {
//           start: {
//             line: 1,
//             column: 6,
//           },
//           end: {
//             line: 1,
//             column: 7,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'defineProperty',
//         loc: {
//           start: {
//             line: 1,
//             column: 7,
//           },
//           end: {
//             line: 1,
//             column: 21,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '(',
//         loc: {
//           start: {
//             line: 1,
//             column: 21,
//           },
//           end: {
//             line: 1,
//             column: 22,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'exports',
//         loc: {
//           start: {
//             line: 1,
//             column: 22,
//           },
//           end: {
//             line: 1,
//             column: 29,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ',',
//         loc: {
//           start: {
//             line: 1,
//             column: 29,
//           },
//           end: {
//             line: 1,
//             column: 30,
//           },
//         },
//       },
//       {
//         type: 'String',
//         value: "'__esModule'",
//         loc: {
//           start: {
//             line: 1,
//             column: 31,
//           },
//           end: {
//             line: 1,
//             column: 43,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ',',
//         loc: {
//           start: {
//             line: 1,
//             column: 43,
//           },
//           end: {
//             line: 1,
//             column: 44,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '{',
//         loc: {
//           start: {
//             line: 1,
//             column: 45,
//           },
//           end: {
//             line: 1,
//             column: 46,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'value',
//         loc: {
//           start: {
//             line: 1,
//             column: 47,
//           },
//           end: {
//             line: 1,
//             column: 52,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ':',
//         loc: {
//           start: {
//             line: 1,
//             column: 52,
//           },
//           end: {
//             line: 1,
//             column: 53,
//           },
//         },
//       },
//       {
//         type: 'Boolean',
//         value: 'true',
//         loc: {
//           start: {
//             line: 1,
//             column: 54,
//           },
//           end: {
//             line: 1,
//             column: 58,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '}',
//         loc: {
//           start: {
//             line: 1,
//             column: 59,
//           },
//           end: {
//             line: 1,
//             column: 60,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ')',
//         loc: {
//           start: {
//             line: 1,
//             column: 60,
//           },
//           end: {
//             line: 1,
//             column: 61,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ';',
//         loc: {
//           start: {
//             line: 1,
//             column: 61,
//           },
//           end: {
//             line: 1,
//             column: 62,
//           },
//         },
//       },
//       {
//         type: 'Keyword',
//         value: 'function',
//         loc: {
//           start: {
//             line: 3,
//             column: 0,
//           },
//           end: {
//             line: 3,
//             column: 8,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: '_optionalChain',
//         loc: {
//           start: {
//             line: 3,
//             column: 9,
//           },
//           end: {
//             line: 3,
//             column: 23,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '(',
//         loc: {
//           start: {
//             line: 3,
//             column: 23,
//           },
//           end: {
//             line: 3,
//             column: 24,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'ops',
//         loc: {
//           start: {
//             line: 3,
//             column: 24,
//           },
//           end: {
//             line: 3,
//             column: 27,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ')',
//         loc: {
//           start: {
//             line: 3,
//             column: 27,
//           },
//           end: {
//             line: 3,
//             column: 28,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '{',
//         loc: {
//           start: {
//             line: 3,
//             column: 29,
//           },
//           end: {
//             line: 3,
//             column: 30,
//           },
//         },
//       },
//       {
//         type: 'Keyword',
//         value: 'let',
//         loc: {
//           start: {
//             line: 3,
//             column: 31,
//           },
//           end: {
//             line: 3,
//             column: 34,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'lastAccessLHS',
//         loc: {
//           start: {
//             line: 3,
//             column: 35,
//           },
//           end: {
//             line: 3,
//             column: 48,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '=',
//         loc: {
//           start: {
//             line: 3,
//             column: 49,
//           },
//           end: {
//             line: 3,
//             column: 50,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'undefined',
//         loc: {
//           start: {
//             line: 3,
//             column: 51,
//           },
//           end: {
//             line: 3,
//             column: 60,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ';',
//         loc: {
//           start: {
//             line: 3,
//             column: 60,
//           },
//           end: {
//             line: 3,
//             column: 61,
//           },
//         },
//       },
//       {
//         type: 'Keyword',
//         value: 'let',
//         loc: {
//           start: {
//             line: 3,
//             column: 62,
//           },
//           end: {
//             line: 3,
//             column: 65,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'value',
//         loc: {
//           start: {
//             line: 3,
//             column: 66,
//           },
//           end: {
//             line: 3,
//             column: 71,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '=',
//         loc: {
//           start: {
//             line: 3,
//             column: 72,
//           },
//           end: {
//             line: 3,
//             column: 73,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'ops',
//         loc: {
//           start: {
//             line: 3,
//             column: 74,
//           },
//           end: {
//             line: 3,
//             column: 77,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '[',
//         loc: {
//           start: {
//             line: 3,
//             column: 77,
//           },
//           end: {
//             line: 3,
//             column: 78,
//           },
//         },
//       },
//       {
//         type: 'Numeric',
//         value: '0',
//         loc: {
//           start: {
//             line: 3,
//             column: 78,
//           },
//           end: {
//             line: 3,
//             column: 79,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ']',
//         loc: {
//           start: {
//             line: 3,
//             column: 79,
//           },
//           end: {
//             line: 3,
//             column: 80,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ';',
//         loc: {
//           start: {
//             line: 3,
//             column: 80,
//           },
//           end: {
//             line: 3,
//             column: 81,
//           },
//         },
//       },
//       {
//         type: 'Keyword',
//         value: 'let',
//         loc: {
//           start: {
//             line: 3,
//             column: 82,
//           },
//           end: {
//             line: 3,
//             column: 85,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'i',
//         loc: {
//           start: {
//             line: 3,
//             column: 86,
//           },
//           end: {
//             line: 3,
//             column: 87,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '=',
//         loc: {
//           start: {
//             line: 3,
//             column: 88,
//           },
//           end: {
//             line: 3,
//             column: 89,
//           },
//         },
//       },
//       {
//         type: 'Numeric',
//         value: '1',
//         loc: {
//           start: {
//             line: 3,
//             column: 90,
//           },
//           end: {
//             line: 3,
//             column: 91,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ';',
//         loc: {
//           start: {
//             line: 3,
//             column: 91,
//           },
//           end: {
//             line: 3,
//             column: 92,
//           },
//         },
//       },
//       {
//         type: 'Keyword',
//         value: 'while',
//         loc: {
//           start: {
//             line: 3,
//             column: 93,
//           },
//           end: {
//             line: 3,
//             column: 98,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '(',
//         loc: {
//           start: {
//             line: 3,
//             column: 99,
//           },
//           end: {
//             line: 3,
//             column: 100,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'i',
//         loc: {
//           start: {
//             line: 3,
//             column: 100,
//           },
//           end: {
//             line: 3,
//             column: 101,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '<',
//         loc: {
//           start: {
//             line: 3,
//             column: 102,
//           },
//           end: {
//             line: 3,
//             column: 103,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'ops',
//         loc: {
//           start: {
//             line: 3,
//             column: 104,
//           },
//           end: {
//             line: 3,
//             column: 107,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '.',
//         loc: {
//           start: {
//             line: 3,
//             column: 107,
//           },
//           end: {
//             line: 3,
//             column: 108,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'length',
//         loc: {
//           start: {
//             line: 3,
//             column: 108,
//           },
//           end: {
//             line: 3,
//             column: 114,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ')',
//         loc: {
//           start: {
//             line: 3,
//             column: 114,
//           },
//           end: {
//             line: 3,
//             column: 115,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '{',
//         loc: {
//           start: {
//             line: 3,
//             column: 116,
//           },
//           end: {
//             line: 3,
//             column: 117,
//           },
//         },
//       },
//       {
//         type: 'Keyword',
//         value: 'var',
//         loc: {
//           start: {
//             line: 3,
//             column: 118,
//           },
//           end: {
//             line: 3,
//             column: 121,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'op',
//         loc: {
//           start: {
//             line: 3,
//             column: 122,
//           },
//           end: {
//             line: 3,
//             column: 124,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '=',
//         loc: {
//           start: {
//             line: 3,
//             column: 125,
//           },
//           end: {
//             line: 3,
//             column: 126,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'ops',
//         loc: {
//           start: {
//             line: 3,
//             column: 127,
//           },
//           end: {
//             line: 3,
//             column: 130,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '[',
//         loc: {
//           start: {
//             line: 3,
//             column: 130,
//           },
//           end: {
//             line: 3,
//             column: 131,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'i',
//         loc: {
//           start: {
//             line: 3,
//             column: 131,
//           },
//           end: {
//             line: 3,
//             column: 132,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ']',
//         loc: {
//           start: {
//             line: 3,
//             column: 132,
//           },
//           end: {
//             line: 3,
//             column: 133,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ';',
//         loc: {
//           start: {
//             line: 3,
//             column: 133,
//           },
//           end: {
//             line: 3,
//             column: 134,
//           },
//         },
//       },
//       {
//         type: 'Keyword',
//         value: 'var',
//         loc: {
//           start: {
//             line: 3,
//             column: 135,
//           },
//           end: {
//             line: 3,
//             column: 138,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'fn',
//         loc: {
//           start: {
//             line: 3,
//             column: 139,
//           },
//           end: {
//             line: 3,
//             column: 141,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '=',
//         loc: {
//           start: {
//             line: 3,
//             column: 142,
//           },
//           end: {
//             line: 3,
//             column: 143,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'ops',
//         loc: {
//           start: {
//             line: 3,
//             column: 144,
//           },
//           end: {
//             line: 3,
//             column: 147,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '[',
//         loc: {
//           start: {
//             line: 3,
//             column: 147,
//           },
//           end: {
//             line: 3,
//             column: 148,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'i',
//         loc: {
//           start: {
//             line: 3,
//             column: 148,
//           },
//           end: {
//             line: 3,
//             column: 149,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '+',
//         loc: {
//           start: {
//             line: 3,
//             column: 150,
//           },
//           end: {
//             line: 3,
//             column: 151,
//           },
//         },
//       },
//       {
//         type: 'Numeric',
//         value: '1',
//         loc: {
//           start: {
//             line: 3,
//             column: 152,
//           },
//           end: {
//             line: 3,
//             column: 153,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ']',
//         loc: {
//           start: {
//             line: 3,
//             column: 153,
//           },
//           end: {
//             line: 3,
//             column: 154,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ';',
//         loc: {
//           start: {
//             line: 3,
//             column: 154,
//           },
//           end: {
//             line: 3,
//             column: 155,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'i',
//         loc: {
//           start: {
//             line: 3,
//             column: 156,
//           },
//           end: {
//             line: 3,
//             column: 157,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '+=',
//         loc: {
//           start: {
//             line: 3,
//             column: 158,
//           },
//           end: {
//             line: 3,
//             column: 160,
//           },
//         },
//       },
//       {
//         type: 'Numeric',
//         value: '2',
//         loc: {
//           start: {
//             line: 3,
//             column: 161,
//           },
//           end: {
//             line: 3,
//             column: 162,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ';',
//         loc: {
//           start: {
//             line: 3,
//             column: 162,
//           },
//           end: {
//             line: 3,
//             column: 163,
//           },
//         },
//       },
//       {
//         type: 'Keyword',
//         value: 'if',
//         loc: {
//           start: {
//             line: 3,
//             column: 164,
//           },
//           end: {
//             line: 3,
//             column: 166,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '(',
//         loc: {
//           start: {
//             line: 3,
//             column: 167,
//           },
//           end: {
//             line: 3,
//             column: 168,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '(',
//         loc: {
//           start: {
//             line: 3,
//             column: 168,
//           },
//           end: {
//             line: 3,
//             column: 169,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'op',
//         loc: {
//           start: {
//             line: 3,
//             column: 169,
//           },
//           end: {
//             line: 3,
//             column: 171,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '===',
//         loc: {
//           start: {
//             line: 3,
//             column: 172,
//           },
//           end: {
//             line: 3,
//             column: 175,
//           },
//         },
//       },
//       {
//         type: 'String',
//         value: "'optionalAccess'",
//         loc: {
//           start: {
//             line: 3,
//             column: 176,
//           },
//           end: {
//             line: 3,
//             column: 192,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '||',
//         loc: {
//           start: {
//             line: 3,
//             column: 193,
//           },
//           end: {
//             line: 3,
//             column: 195,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'op',
//         loc: {
//           start: {
//             line: 3,
//             column: 196,
//           },
//           end: {
//             line: 3,
//             column: 198,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '===',
//         loc: {
//           start: {
//             line: 3,
//             column: 199,
//           },
//           end: {
//             line: 3,
//             column: 202,
//           },
//         },
//       },
//       {
//         type: 'String',
//         value: "'optionalCall'",
//         loc: {
//           start: {
//             line: 3,
//             column: 203,
//           },
//           end: {
//             line: 3,
//             column: 217,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ')',
//         loc: {
//           start: {
//             line: 3,
//             column: 217,
//           },
//           end: {
//             line: 3,
//             column: 218,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '&&',
//         loc: {
//           start: {
//             line: 3,
//             column: 219,
//           },
//           end: {
//             line: 3,
//             column: 221,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'value',
//         loc: {
//           start: {
//             line: 3,
//             column: 222,
//           },
//           end: {
//             line: 3,
//             column: 227,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '==',
//         loc: {
//           start: {
//             line: 3,
//             column: 228,
//           },
//           end: {
//             line: 3,
//             column: 230,
//           },
//         },
//       },
//       {
//         type: 'Null',
//         value: 'null',
//         loc: {
//           start: {
//             line: 3,
//             column: 231,
//           },
//           end: {
//             line: 3,
//             column: 235,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ')',
//         loc: {
//           start: {
//             line: 3,
//             column: 235,
//           },
//           end: {
//             line: 3,
//             column: 236,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '{',
//         loc: {
//           start: {
//             line: 3,
//             column: 237,
//           },
//           end: {
//             line: 3,
//             column: 238,
//           },
//         },
//       },
//       {
//         type: 'Keyword',
//         value: 'return',
//         loc: {
//           start: {
//             line: 3,
//             column: 239,
//           },
//           end: {
//             line: 3,
//             column: 245,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'undefined',
//         loc: {
//           start: {
//             line: 3,
//             column: 246,
//           },
//           end: {
//             line: 3,
//             column: 255,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ';',
//         loc: {
//           start: {
//             line: 3,
//             column: 255,
//           },
//           end: {
//             line: 3,
//             column: 256,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '}',
//         loc: {
//           start: {
//             line: 3,
//             column: 257,
//           },
//           end: {
//             line: 3,
//             column: 258,
//           },
//         },
//       },
//       {
//         type: 'Keyword',
//         value: 'if',
//         loc: {
//           start: {
//             line: 3,
//             column: 259,
//           },
//           end: {
//             line: 3,
//             column: 261,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '(',
//         loc: {
//           start: {
//             line: 3,
//             column: 262,
//           },
//           end: {
//             line: 3,
//             column: 263,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'op',
//         loc: {
//           start: {
//             line: 3,
//             column: 263,
//           },
//           end: {
//             line: 3,
//             column: 265,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '===',
//         loc: {
//           start: {
//             line: 3,
//             column: 266,
//           },
//           end: {
//             line: 3,
//             column: 269,
//           },
//         },
//       },
//       {
//         type: 'String',
//         value: "'access'",
//         loc: {
//           start: {
//             line: 3,
//             column: 270,
//           },
//           end: {
//             line: 3,
//             column: 278,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '||',
//         loc: {
//           start: {
//             line: 3,
//             column: 279,
//           },
//           end: {
//             line: 3,
//             column: 281,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'op',
//         loc: {
//           start: {
//             line: 3,
//             column: 282,
//           },
//           end: {
//             line: 3,
//             column: 284,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '===',
//         loc: {
//           start: {
//             line: 3,
//             column: 285,
//           },
//           end: {
//             line: 3,
//             column: 288,
//           },
//         },
//       },
//       {
//         type: 'String',
//         value: "'optionalAccess'",
//         loc: {
//           start: {
//             line: 3,
//             column: 289,
//           },
//           end: {
//             line: 3,
//             column: 305,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ')',
//         loc: {
//           start: {
//             line: 3,
//             column: 305,
//           },
//           end: {
//             line: 3,
//             column: 306,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '{',
//         loc: {
//           start: {
//             line: 3,
//             column: 307,
//           },
//           end: {
//             line: 3,
//             column: 308,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'lastAccessLHS',
//         loc: {
//           start: {
//             line: 3,
//             column: 309,
//           },
//           end: {
//             line: 3,
//             column: 322,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '=',
//         loc: {
//           start: {
//             line: 3,
//             column: 323,
//           },
//           end: {
//             line: 3,
//             column: 324,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'value',
//         loc: {
//           start: {
//             line: 3,
//             column: 325,
//           },
//           end: {
//             line: 3,
//             column: 330,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ';',
//         loc: {
//           start: {
//             line: 3,
//             column: 330,
//           },
//           end: {
//             line: 3,
//             column: 331,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'value',
//         loc: {
//           start: {
//             line: 3,
//             column: 332,
//           },
//           end: {
//             line: 3,
//             column: 337,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '=',
//         loc: {
//           start: {
//             line: 3,
//             column: 338,
//           },
//           end: {
//             line: 3,
//             column: 339,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'fn',
//         loc: {
//           start: {
//             line: 3,
//             column: 340,
//           },
//           end: {
//             line: 3,
//             column: 342,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '(',
//         loc: {
//           start: {
//             line: 3,
//             column: 342,
//           },
//           end: {
//             line: 3,
//             column: 343,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'value',
//         loc: {
//           start: {
//             line: 3,
//             column: 343,
//           },
//           end: {
//             line: 3,
//             column: 348,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ')',
//         loc: {
//           start: {
//             line: 3,
//             column: 348,
//           },
//           end: {
//             line: 3,
//             column: 349,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ';',
//         loc: {
//           start: {
//             line: 3,
//             column: 349,
//           },
//           end: {
//             line: 3,
//             column: 350,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '}',
//         loc: {
//           start: {
//             line: 3,
//             column: 351,
//           },
//           end: {
//             line: 3,
//             column: 352,
//           },
//         },
//       },
//       {
//         type: 'Keyword',
//         value: 'else',
//         loc: {
//           start: {
//             line: 3,
//             column: 353,
//           },
//           end: {
//             line: 3,
//             column: 357,
//           },
//         },
//       },
//       {
//         type: 'Keyword',
//         value: 'if',
//         loc: {
//           start: {
//             line: 3,
//             column: 358,
//           },
//           end: {
//             line: 3,
//             column: 360,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '(',
//         loc: {
//           start: {
//             line: 3,
//             column: 361,
//           },
//           end: {
//             line: 3,
//             column: 362,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'op',
//         loc: {
//           start: {
//             line: 3,
//             column: 362,
//           },
//           end: {
//             line: 3,
//             column: 364,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '===',
//         loc: {
//           start: {
//             line: 3,
//             column: 365,
//           },
//           end: {
//             line: 3,
//             column: 368,
//           },
//         },
//       },
//       {
//         type: 'String',
//         value: "'call'",
//         loc: {
//           start: {
//             line: 3,
//             column: 369,
//           },
//           end: {
//             line: 3,
//             column: 375,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '||',
//         loc: {
//           start: {
//             line: 3,
//             column: 376,
//           },
//           end: {
//             line: 3,
//             column: 378,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'op',
//         loc: {
//           start: {
//             line: 3,
//             column: 379,
//           },
//           end: {
//             line: 3,
//             column: 381,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '===',
//         loc: {
//           start: {
//             line: 3,
//             column: 382,
//           },
//           end: {
//             line: 3,
//             column: 385,
//           },
//         },
//       },
//       {
//         type: 'String',
//         value: "'optionalCall'",
//         loc: {
//           start: {
//             line: 3,
//             column: 386,
//           },
//           end: {
//             line: 3,
//             column: 400,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ')',
//         loc: {
//           start: {
//             line: 3,
//             column: 400,
//           },
//           end: {
//             line: 3,
//             column: 401,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '{',
//         loc: {
//           start: {
//             line: 3,
//             column: 402,
//           },
//           end: {
//             line: 3,
//             column: 403,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'value',
//         loc: {
//           start: {
//             line: 3,
//             column: 404,
//           },
//           end: {
//             line: 3,
//             column: 409,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '=',
//         loc: {
//           start: {
//             line: 3,
//             column: 410,
//           },
//           end: {
//             line: 3,
//             column: 411,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'fn',
//         loc: {
//           start: {
//             line: 3,
//             column: 412,
//           },
//           end: {
//             line: 3,
//             column: 414,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '(',
//         loc: {
//           start: {
//             line: 3,
//             column: 414,
//           },
//           end: {
//             line: 3,
//             column: 415,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '(',
//         loc: {
//           start: {
//             line: 3,
//             column: 415,
//           },
//           end: {
//             line: 3,
//             column: 416,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '...',
//         loc: {
//           start: {
//             line: 3,
//             column: 416,
//           },
//           end: {
//             line: 3,
//             column: 419,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'args',
//         loc: {
//           start: {
//             line: 3,
//             column: 419,
//           },
//           end: {
//             line: 3,
//             column: 423,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ')',
//         loc: {
//           start: {
//             line: 3,
//             column: 423,
//           },
//           end: {
//             line: 3,
//             column: 424,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '=>',
//         loc: {
//           start: {
//             line: 3,
//             column: 425,
//           },
//           end: {
//             line: 3,
//             column: 427,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'value',
//         loc: {
//           start: {
//             line: 3,
//             column: 428,
//           },
//           end: {
//             line: 3,
//             column: 433,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '.',
//         loc: {
//           start: {
//             line: 3,
//             column: 433,
//           },
//           end: {
//             line: 3,
//             column: 434,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'call',
//         loc: {
//           start: {
//             line: 3,
//             column: 434,
//           },
//           end: {
//             line: 3,
//             column: 438,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '(',
//         loc: {
//           start: {
//             line: 3,
//             column: 438,
//           },
//           end: {
//             line: 3,
//             column: 439,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'lastAccessLHS',
//         loc: {
//           start: {
//             line: 3,
//             column: 439,
//           },
//           end: {
//             line: 3,
//             column: 452,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ',',
//         loc: {
//           start: {
//             line: 3,
//             column: 452,
//           },
//           end: {
//             line: 3,
//             column: 453,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '...',
//         loc: {
//           start: {
//             line: 3,
//             column: 454,
//           },
//           end: {
//             line: 3,
//             column: 457,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'args',
//         loc: {
//           start: {
//             line: 3,
//             column: 457,
//           },
//           end: {
//             line: 3,
//             column: 461,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ')',
//         loc: {
//           start: {
//             line: 3,
//             column: 461,
//           },
//           end: {
//             line: 3,
//             column: 462,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ')',
//         loc: {
//           start: {
//             line: 3,
//             column: 462,
//           },
//           end: {
//             line: 3,
//             column: 463,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ';',
//         loc: {
//           start: {
//             line: 3,
//             column: 463,
//           },
//           end: {
//             line: 3,
//             column: 464,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'lastAccessLHS',
//         loc: {
//           start: {
//             line: 3,
//             column: 465,
//           },
//           end: {
//             line: 3,
//             column: 478,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '=',
//         loc: {
//           start: {
//             line: 3,
//             column: 479,
//           },
//           end: {
//             line: 3,
//             column: 480,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'undefined',
//         loc: {
//           start: {
//             line: 3,
//             column: 481,
//           },
//           end: {
//             line: 3,
//             column: 490,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ';',
//         loc: {
//           start: {
//             line: 3,
//             column: 490,
//           },
//           end: {
//             line: 3,
//             column: 491,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '}',
//         loc: {
//           start: {
//             line: 3,
//             column: 492,
//           },
//           end: {
//             line: 3,
//             column: 493,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '}',
//         loc: {
//           start: {
//             line: 3,
//             column: 494,
//           },
//           end: {
//             line: 3,
//             column: 495,
//           },
//         },
//       },
//       {
//         type: 'Keyword',
//         value: 'return',
//         loc: {
//           start: {
//             line: 3,
//             column: 496,
//           },
//           end: {
//             line: 3,
//             column: 502,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'value',
//         loc: {
//           start: {
//             line: 3,
//             column: 503,
//           },
//           end: {
//             line: 3,
//             column: 508,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ';',
//         loc: {
//           start: {
//             line: 3,
//             column: 508,
//           },
//           end: {
//             line: 3,
//             column: 509,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '}',
//         loc: {
//           start: {
//             line: 3,
//             column: 510,
//           },
//           end: {
//             line: 3,
//             column: 511,
//           },
//         },
//       },
//       {
//         type: 'Keyword',
//         value: 'const',
//         loc: {
//           start: {
//             line: 3,
//             column: 511,
//           },
//           end: {
//             line: 3,
//             column: 516,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '{',
//         loc: {
//           start: {
//             line: 3,
//             column: 517,
//           },
//           end: {
//             line: 3,
//             column: 518,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'resolve',
//         loc: {
//           start: {
//             line: 3,
//             column: 519,
//           },
//           end: {
//             line: 3,
//             column: 526,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '}',
//         loc: {
//           start: {
//             line: 3,
//             column: 527,
//           },
//           end: {
//             line: 3,
//             column: 528,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '=',
//         loc: {
//           start: {
//             line: 3,
//             column: 529,
//           },
//           end: {
//             line: 3,
//             column: 530,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'require',
//         loc: {
//           start: {
//             line: 3,
//             column: 531,
//           },
//           end: {
//             line: 3,
//             column: 538,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '(',
//         loc: {
//           start: {
//             line: 3,
//             column: 538,
//           },
//           end: {
//             line: 3,
//             column: 539,
//           },
//         },
//       },
//       {
//         type: 'String',
//         value: "'path'",
//         loc: {
//           start: {
//             line: 3,
//             column: 539,
//           },
//           end: {
//             line: 3,
//             column: 545,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ')',
//         loc: {
//           start: {
//             line: 3,
//             column: 545,
//           },
//           end: {
//             line: 3,
//             column: 546,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ';',
//         loc: {
//           start: {
//             line: 3,
//             column: 546,
//           },
//           end: {
//             line: 3,
//             column: 547,
//           },
//         },
//       },
//       {
//         type: 'Keyword',
//         value: 'var',
//         loc: {
//           start: {
//             line: 5,
//             column: 0,
//           },
//           end: {
//             line: 5,
//             column: 3,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'x',
//         loc: {
//           start: {
//             line: 5,
//             column: 4,
//           },
//           end: {
//             line: 5,
//             column: 5,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '=',
//         loc: {
//           start: {
//             line: 5,
//             column: 6,
//           },
//           end: {
//             line: 5,
//             column: 7,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: '_optionalChain',
//         loc: {
//           start: {
//             line: 5,
//             column: 8,
//           },
//           end: {
//             line: 5,
//             column: 22,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '(',
//         loc: {
//           start: {
//             line: 5,
//             column: 22,
//           },
//           end: {
//             line: 5,
//             column: 23,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '[',
//         loc: {
//           start: {
//             line: 5,
//             column: 23,
//           },
//           end: {
//             line: 5,
//             column: 24,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'thing',
//         loc: {
//           start: {
//             line: 5,
//             column: 24,
//           },
//           end: {
//             line: 5,
//             column: 29,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ',',
//         loc: {
//           start: {
//             line: 5,
//             column: 29,
//           },
//           end: {
//             line: 5,
//             column: 30,
//           },
//         },
//       },
//       {
//         type: 'String',
//         value: "'optionalAccess'",
//         loc: {
//           start: {
//             line: 5,
//             column: 31,
//           },
//           end: {
//             line: 5,
//             column: 47,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ',',
//         loc: {
//           start: {
//             line: 5,
//             column: 47,
//           },
//           end: {
//             line: 5,
//             column: 48,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: '_',
//         loc: {
//           start: {
//             line: 5,
//             column: 49,
//           },
//           end: {
//             line: 5,
//             column: 50,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '=>',
//         loc: {
//           start: {
//             line: 5,
//             column: 51,
//           },
//           end: {
//             line: 5,
//             column: 53,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: '_',
//         loc: {
//           start: {
//             line: 5,
//             column: 54,
//           },
//           end: {
//             line: 5,
//             column: 55,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '.',
//         loc: {
//           start: {
//             line: 5,
//             column: 55,
//           },
//           end: {
//             line: 5,
//             column: 56,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'stuff',
//         loc: {
//           start: {
//             line: 5,
//             column: 56,
//           },
//           end: {
//             line: 5,
//             column: 61,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ']',
//         loc: {
//           start: {
//             line: 5,
//             column: 61,
//           },
//           end: {
//             line: 5,
//             column: 62,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ')',
//         loc: {
//           start: {
//             line: 5,
//             column: 62,
//           },
//           end: {
//             line: 5,
//             column: 63,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ';',
//         loc: {
//           start: {
//             line: 5,
//             column: 63,
//           },
//           end: {
//             line: 5,
//             column: 64,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'console',
//         loc: {
//           start: {
//             line: 7,
//             column: 0,
//           },
//           end: {
//             line: 7,
//             column: 7,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '.',
//         loc: {
//           start: {
//             line: 7,
//             column: 7,
//           },
//           end: {
//             line: 7,
//             column: 8,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'log',
//         loc: {
//           start: {
//             line: 7,
//             column: 8,
//           },
//           end: {
//             line: 7,
//             column: 11,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '(',
//         loc: {
//           start: {
//             line: 7,
//             column: 11,
//           },
//           end: {
//             line: 7,
//             column: 12,
//           },
//         },
//       },
//       {
//         type: 'String',
//         value: "'hi'",
//         loc: {
//           start: {
//             line: 7,
//             column: 12,
//           },
//           end: {
//             line: 7,
//             column: 16,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ')',
//         loc: {
//           start: {
//             line: 7,
//             column: 16,
//           },
//           end: {
//             line: 7,
//             column: 17,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ';',
//         loc: {
//           start: {
//             line: 7,
//             column: 17,
//           },
//           end: {
//             line: 7,
//             column: 18,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'resolve',
//         loc: {
//           start: {
//             line: 8,
//             column: 0,
//           },
//           end: {
//             line: 8,
//             column: 7,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '(',
//         loc: {
//           start: {
//             line: 8,
//             column: 7,
//           },
//           end: {
//             line: 8,
//             column: 8,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'process',
//         loc: {
//           start: {
//             line: 8,
//             column: 8,
//           },
//           end: {
//             line: 8,
//             column: 15,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '.',
//         loc: {
//           start: {
//             line: 8,
//             column: 15,
//           },
//           end: {
//             line: 8,
//             column: 16,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'cwd',
//         loc: {
//           start: {
//             line: 8,
//             column: 16,
//           },
//           end: {
//             line: 8,
//             column: 19,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '(',
//         loc: {
//           start: {
//             line: 8,
//             column: 19,
//           },
//           end: {
//             line: 8,
//             column: 20,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ')',
//         loc: {
//           start: {
//             line: 8,
//             column: 20,
//           },
//           end: {
//             line: 8,
//             column: 21,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ')',
//         loc: {
//           start: {
//             line: 8,
//             column: 21,
//           },
//           end: {
//             line: 8,
//             column: 22,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ';',
//         loc: {
//           start: {
//             line: 8,
//             column: 22,
//           },
//           end: {
//             line: 8,
//             column: 23,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'exports',
//         loc: {
//           start: {
//             line: 10,
//             column: 0,
//           },
//           end: {
//             line: 10,
//             column: 7,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '.',
//         loc: {
//           start: {
//             line: 10,
//             column: 7,
//           },
//           end: {
//             line: 10,
//             column: 8,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'x',
//         loc: {
//           start: {
//             line: 10,
//             column: 8,
//           },
//           end: {
//             line: 10,
//             column: 9,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: '=',
//         loc: {
//           start: {
//             line: 10,
//             column: 10,
//           },
//           end: {
//             line: 10,
//             column: 11,
//           },
//         },
//       },
//       {
//         type: 'Identifier',
//         value: 'x',
//         loc: {
//           start: {
//             line: 10,
//             column: 12,
//           },
//           end: {
//             line: 10,
//             column: 13,
//           },
//         },
//       },
//       {
//         type: 'Punctuator',
//         value: ';',
//         loc: {
//           start: {
//             line: 10,
//             column: 13,
//           },
//           end: {
//             line: 10,
//             column: 14,
//           },
//         },
//       },
//     ],
//     indent: 0,
//   },
// };
