import { defineConfig } from 'tsup';
import { sassPlugin } from 'esbuild-sass-plugin';

export default defineConfig({
  treeshake: true,
  format: ['cjs', 'esm'],
  dts: true,
  external: ['chrome', 'react'],
  esbuildPlugins: [sassPlugin()],
});
