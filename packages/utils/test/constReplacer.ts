// import type { TsCompilerInstance } from 'ts-jest/dist/types';
// import * as ts from 'typescript';
import {
  createVariableDeclarationList,
  getCombinedNodeFlags,
  isVariableDeclarationList,
  Node,
  NodeFlags,
  SourceFile,
  TransformationContext,
  Transformer,
  TransformerFactory,
  visitEachChild,
  visitNode,
  VisitResult,
} from 'typescript';

function isVarConst(node: Node): boolean {
  // eslint-disable-next-line no-bitwise
  return !!(getCombinedNodeFlags(node) & NodeFlags.Const);
}

/**
 * Remember to increase the version whenever transformer's content is changed. This is to inform Jest to not reuse
 * the previous cache which contains old transformer's content
 */
export const version = 1;

// Used for constructing cache key
export const name = 'const-to-var';

/**
 *
 */
// export function factory(compilerInstance: TsCompilerInstance): TransformerFactory<SourceFile> {
export function factory(): TransformerFactory<SourceFile> {
  // const ts = compilerInstance.configSet.compilerModule;
  function transformerFactory(context: TransformationContext): Transformer<SourceFile> {
    function transformer(sourceFile: SourceFile): SourceFile {
      function visitor(node: Node): VisitResult<Node> {
        if (isVariableDeclarationList(node) && isVarConst(node)) {
          // TODO: If we ever go as high as TS 4.0, we'll need to use `ts.factory` rather than `ts` for creating nodes
          return createVariableDeclarationList(node.declarations, NodeFlags.None);
        }
        return visitEachChild(node, visitor, context);
      }
      return visitNode(sourceFile, visitor);
    }
    return transformer;
  }
  return transformerFactory;
}
