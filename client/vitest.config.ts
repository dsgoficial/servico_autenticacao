/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const r = (p: string) => path.resolve(dir, p);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': r('./src'),
      '@components': r('./src/components'),
      '@features': r('./src/features'),
      '@hooks': r('./src/hooks'),
      '@lib': r('./src/lib'),
      '@services': r('./src/services'),
      '@stores': r('./src/stores'),
      '@types': r('./src/types'),
      '@utils': r('./src/utils'),
      '@routes': r('./src/routes'),
      '@assets': r('./src/assets'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: false,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
        'src/**/*.d.ts',
        'src/types/**',
        'src/main.tsx',
      ],
    },
  },
});
