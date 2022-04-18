import deepMerge from 'deepmerge';

import { makeBaseNPMConfig, makeNPMConfigVariants } from '../../rollup/index.js';

const baseConfig = makeBaseNPMConfig({
  // We need to include `instrumentServer.ts` separately because it's only conditionally required, and so rollup doesn't automatically include it when calculating the module dependency tree
  // entrypoint: ['src/index.server.ts', 'src/index.client.ts', 'src/utils/instrumentServer.ts'],
  entrypoint: ['src/sucraseTest.ts'],
  esModuleInterop: true,
  watchPackages: ['integrations', 'node', 'react', 'tracing'],
});

export default makeNPMConfigVariants(
  deepMerge(baseConfig, {
    // we already exclude anything listed as a dependency in `package.json`, but somewhere we import from a
    // subpackage of nextjs and rollup doesn't automatically make the connection, so we have to exclude it manually
    external: ['next/router'],
  }),
);
