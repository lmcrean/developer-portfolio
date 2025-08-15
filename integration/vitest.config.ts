import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test-setup.ts',
        '**/*.config.*',
        '**/*.d.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../apps/web/src'),
      '@site': resolve(__dirname, '../apps/web'),
      '@shared': resolve(__dirname, '../shared'),
      'react': resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom']
  },
  esbuild: {
    // Skip type checking for faster builds
    target: 'es2020'
  },
  optimizeDeps: {
    // Include dependencies that need to be pre-bundled
    include: ['react', 'react-dom', 'axios']
  }
}); 