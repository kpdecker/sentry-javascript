/**
 * Replace plugin docs: https://github.com/rollup/plugins/tree/master/packages/replace
 * Sucrase plugin docs: https://github.com/rollup/plugins/tree/master/packages/sucrase
 */

import replace from '@rollup/plugin-replace';
import sucrase from '@rollup/plugin-sucrase';

/**
 * Create a plugin to transpile TS syntax using `sucrase`.
 *
 * @returns An instance of the `@rollup/plugin-sucrase` plugin
 */
export function makeSucrasePlugin() {
  return sucrase({
    transforms: ['typescript', 'jsx'],
  });
}

/**
 * Create a plugin to switch all instances of `const` to `var`, both to prevent problems when we shadow `global` and
 * because it's fewer characters.
 *
 * @returns An instance of the `@rollup/plugin-replace` plugin
 */
export function makeConstToVarPlugin() {
  return replace({
    // TODO `preventAssignment` will default to true in version 5.x of the replace plugin, at which point we can get rid
    // of this. (It actually makes no difference in this case whether it's true or false, since we never assign to
    // `const`, but if we don't give it a value, it will spam with warnings.)
    preventAssignment: true,
    values: {
      // Include a space at the end to guarantee we're not accidentally catching the beginning of the words "constant,"
      // "constantly," etc.
      'const ': 'var ',
    },
  });
}
