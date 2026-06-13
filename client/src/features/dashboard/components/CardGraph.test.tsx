import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';

// O recharts não renderiza bem em jsdom (depende de medidas de layout). Como o
// foco aqui é a lógica de variação/tendência do card, stubamos o gráfico.
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  AreaChart: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Area: () => null,
}));

import { CardGraph } from './CardGraph';

const renderCard = (series: Array<Record<string, number>>) =>
  render(<CardGraph label="Logins" series={series} seriesKey="logins" />);

describe('CardGraph — variação e tendência', () => {
  it('tendência de alta: seta para cima e variação positiva', () => {
    renderCard([{ logins: 10 }, { logins: 20 }]);
    expect(screen.getByTestId('ArrowDropUpIcon')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument(); // valor atual
  });

  it('tendência de queda: seta para baixo e variação negativa (em módulo)', () => {
    renderCard([{ logins: 20 }, { logins: 10 }]);
    expect(screen.getByTestId('ArrowDropDownIcon')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  // Regressão (bug #7): variação 0 caía no ramo de "queda" (seta vermelha).
  // Agora deve mostrar o estado neutro (ícone Remove).
  it('REGRESSÃO: variação 0 mostra o estado neutro, não queda', () => {
    renderCard([{ logins: 10 }, { logins: 10 }]);
    expect(screen.getByTestId('RemoveIcon')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.queryByTestId('ArrowDropDownIcon')).toBeNull();
    expect(screen.queryByTestId('ArrowDropUpIcon')).toBeNull();
  });

  it('com menos de 2 pontos a variação é 0 (neutro) e mostra o valor', () => {
    renderCard([{ logins: 5 }]);
    expect(screen.getByTestId('RemoveIcon')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('série vazia: valor 0 e estado neutro', () => {
    renderCard([]);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByTestId('RemoveIcon')).toBeInTheDocument();
  });
});
