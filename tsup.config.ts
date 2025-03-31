import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/grammar.ts'],
  format: ['cjs', 'esm'],
  // Add outExtension to specify .mjs for esm format
  outExtension({ format }) {
    return {
      js: `.${format === 'esm' ? 'mjs' : 'cjs'}`,
    }
  },
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
})
