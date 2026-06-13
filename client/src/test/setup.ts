import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Desmonta a árvore React e limpa o localStorage entre os testes para garantir
// isolamento (o jsdom compartilha um único localStorage por arquivo).
afterEach(() => {
  cleanup();
  localStorage.clear();
});
