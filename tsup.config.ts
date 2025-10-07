import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/*.ts', 'src/apps/*.ts'],
  outDir: 'lib',
  target: 'node22',
  splitting: true,
  sourcemap: false,
  format: ['esm'],
  dts: false,
  clean: true,
  minify: true,
  shims: true,
  noExternal: [
    'some-framework'
  ]
})
