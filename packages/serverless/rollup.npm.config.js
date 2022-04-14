import { makeBaseNPMConfig, makeNPMConfigVariants } from '../../rollup/index.js';

export default makeNPMConfigVariants(
  makeBaseNPMConfig({
    entrypoint: ['src/index.ts', 'src/awslambda-auto.ts'],
    watchPackages: ['node', 'tracing'],
  }),
);
