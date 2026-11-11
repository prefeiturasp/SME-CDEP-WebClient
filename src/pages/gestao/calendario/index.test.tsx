import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { obterSemanas } from '~/core/services/calendario-eventos-service';
import { Calendario } from './index';

jest.mock('~/core/services/calendario-eventos-service', () => ({
  obterSemanas: jest.fn(),
}));

jest.mock('./mes', () => ({
  Mes: (props: any) => (
    <div data-testid='mes-component' data-mes={props.mesEscolhido}>
      Mes Mock - Semanas: {props.semanas?.length ?? 0}
      <button onClick={() => props.carregarDadosMesSelecionado?.(props.mesEscolhido)}>
        Recarregar Mes
      </button>
      <button onClick={() => props.onClickMes?.({ key: 1, label: 'Janeiro' }, 0)}>
        Trigger onClickMes
      </button>
    </div>
  ),
}));

describe('Calendario', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (obterSemanas as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: {
        semanas: [{ numero: 1, dias: [] }],
      },
    });
  });

  it('deve renderizar o cabeçalho e todos os 12 meses', () => {
    render(<Calendario />);

    expect(screen.getByText('Calendário de visitas')).toBeInTheDocument();

    const meses = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    meses.forEach((mes) => {
      expect(screen.getByText(mes)).toBeInTheDocument();
    });
  });

  it('deve expandir o mês selecionado ao clicar no card do mês e carregar as semanas', async () => {
    render(<Calendario />);

    const cardJaneiro = screen.getByText('Janeiro');
    fireEvent.click(cardJaneiro);

    await waitFor(() => {
      expect(obterSemanas).toHaveBeenCalledWith(1);
    });

    expect(screen.getByTestId('mes-component')).toBeInTheDocument();
    expect(screen.getByText('Mes Mock - Semanas: 1')).toBeInTheDocument();
  });

  it('deve recolher o mês ao clicar novamente no mesmo mês já expandido', async () => {
    render(<Calendario />);

    const cardJaneiro = screen.getByText('Janeiro');
    fireEvent.click(cardJaneiro);

    await waitFor(() => {
      expect(screen.getByTestId('mes-component')).toBeInTheDocument();
    });

    fireEvent.click(cardJaneiro);

    expect(screen.queryByTestId('mes-component')).not.toBeInTheDocument();
  });

  it('deve alternar para outro mês ao clicar em um mês diferente', async () => {
    render(<Calendario />);

    fireEvent.click(screen.getByText('Janeiro'));

    await waitFor(() => {
      expect(obterSemanas).toHaveBeenCalledWith(1);
    });

    fireEvent.click(screen.getByText('Fevereiro'));

    await waitFor(() => {
      expect(obterSemanas).toHaveBeenCalledWith(2);
      expect(screen.getByTestId('mes-component')).toHaveAttribute('data-mes', '2');
    });
  });

  it('deve chamar onClickMes ao clicar no ícone do card', async () => {
    const { container } = render(<Calendario />);

    const iconesFaAngleRight = container.querySelectorAll('.anticon');
    if (iconesFaAngleRight.length > 0) {
      fireEvent.click(iconesFaAngleRight[0]);

      await waitFor(() => {
        expect(obterSemanas).toHaveBeenCalledWith(1);
      });
    }
  });

  it('não deve atualizar dados quando obterSemanas retornar sucesso falso', async () => {
    (obterSemanas as jest.Mock).mockResolvedValueOnce({
      sucesso: false,
      dados: null,
    });

    render(<Calendario />);

    fireEvent.click(screen.getByText('Março'));

    await waitFor(() => {
      expect(obterSemanas).toHaveBeenCalledWith(3);
    });

    expect(screen.getByTestId('mes-component')).toBeInTheDocument();
    expect(screen.getByText('Mes Mock - Semanas: 0')).toBeInTheDocument();
  });

  it('deve permitir recarregar os dados através de carregarDadosMesSelecionado passado para o componente Mes', async () => {
    render(<Calendario />);

    fireEvent.click(screen.getByText('Janeiro'));

    await waitFor(() => {
      expect(screen.getByTestId('mes-component')).toBeInTheDocument();
    });

    const botaoRecarregar = screen.getByRole('button', { name: /Recarregar Mes/i });
    fireEvent.click(botaoRecarregar);

    await waitFor(() => {
      expect(obterSemanas).toHaveBeenCalledTimes(2);
    });
  });

  it('deve permitir disparar onClickMes a partir do componente Mes', async () => {
    render(<Calendario />);

    fireEvent.click(screen.getByText('Janeiro'));

    await waitFor(() => {
      expect(screen.getByTestId('mes-component')).toBeInTheDocument();
    });

    const botaoTrigger = screen.getByRole('button', { name: /Trigger onClickMes/i });
    fireEvent.click(botaoTrigger);

    await waitFor(() => {
      expect(obterSemanas).toHaveBeenCalledTimes(2);
    });
  });
});
