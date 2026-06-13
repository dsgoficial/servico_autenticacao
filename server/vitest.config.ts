import { defineConfig } from 'vitest/config';
import fs from 'node:fs';
import path from 'node:path';

/**
 * O backend é ESM "NodeNext": os imports trazem a extensão `.js` explícita
 * (ex.: `'../database/index.js'`) apontando para arquivos `.ts`. O resolver do
 * Vite/Vitest procuraria o `.js` literal e não acharia o `.ts`. Este plugin
 * reescreve specifiers relativos terminados em `.js` para o `.ts`
 * correspondente quando ele existe. O mesmo caminho é usado pelo código sob
 * teste e pelos `vi.mock()`, garantindo que ambos resolvam para o mesmo módulo.
 */
function resolveTsFromJs() {
  return {
    name: 'resolve-ts-from-js',
    enforce: 'pre' as const,
    resolveId(source: string, importer?: string) {
      if (importer && source.startsWith('.') && source.endsWith('.js')) {
        const candidate = path.resolve(
          path.dirname(importer.split('?')[0]),
          `${source.slice(0, -3)}.ts`,
        );
        if (fs.existsSync(candidate)) return candidate;
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [resolveTsFromJs()],
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*_types.ts',
        'src/**/index.ts',
        'src/server/**',
        'src/routes.ts',
        'src/database/db.ts',
      ],
    },
  },
});
