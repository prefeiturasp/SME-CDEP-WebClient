import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MesesEnum } from '~/core/enum/meses';
import { obterSemanas } from '~/core/services/calendario-eventos-service';
import { Calendario } from './index';

jest.mock('~/core/services/calendario-eventos-service', () => ({
  obterSemanas: jest.fn(),
}));

jest.mock('./mes', () => ({
  Mes: ({
    mesEscolhido,
    semanas,
  }: {
    mesEscolhido?: number;
    semanas?: Array<{ numero: number }>;
  }) => (
    <div data-testid='mock-mes' data-mes={mesEscolhido ?? ''} data-semanas={semanas?.length ?? 0} />
  ),
}));

describe('Calendario', () => {
  jest.setTimeout(30000);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('C14/C15/C16: renderiza 12 meses, expande mês com semanas ao clicar e recolhe ao clicar novamente', async () => {
    (obterSemanas as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: {
        semanas: [
          { numero: 1, dias: [] },
          { numero: 2, dias: [] },
        ],
      },
    });

    render(<Calendario />);

    expect(screen.getByText('Calendário de visitas')).toBeInTheDocument();
    expect(screen.getByText('Janeiro')).toBeInTheDocument();
    expect(screen.getByText('Dezembro')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Janeiro'));

    await waitFor(() => {
      expect(obterSemanas).toHaveBeenCalledWith(MesesEnum.Janeiro);
    });

    const mesEl = await screen.findByTestId('mock-mes');
    expect(mesEl).toHaveAttribute('data-mes', String(MesesEnum.Janeiro));
    expect(mesEl).toHaveAttribute('data-semanas', '2');

    fireEvent.click(screen.getByText('Janeiro'));
    await waitFor(() => {
      expect(screen.queryByTestId('mock-mes')).not.toBeInTheDocument();
    });
  });

  it('C17: mantém dados indefinidos quando obterSemanas retorna sucesso=false', async () => {
    (obterSemanas as jest.Mock).mockResolvedValue({
      sucesso: false,
    });

    render(<Calendario />);

    const card = screen.getByText('Fevereiro');
    const icon = card.parentElement?.previousSibling as HTMLElement;
    fireEvent.click(icon || card);

    await waitFor(() => {
      expect(obterSemanas).toHaveBeenCalledWith(MesesEnum.Fevereiro);
    });

    expect(screen.getByTestId('mock-mes')).toHaveAttribute('data-semanas', '0');
  });
});
