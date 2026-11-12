import { fireEvent, render, screen } from '@testing-library/react';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';
import { ROUTES } from '~/core/enum/routes';
import { useAppDispatch, useAppSelector } from '~/core/hooks/use-redux';
import { setAcervosSelecionados } from '~/core/redux/modules/solicitacao/actions';
import { ButtonEnviarParaMinhaSelecao } from './index';

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

describe('ButtonEnviarParaMinhaSelecao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  it('C01: fica desabilitado sem seleção/acervoId ou quando controle de disponibilidade está indisponível', () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({ solicitacao: { acervosSelecionados: [] } }),
    );

    const { rerender } = render(<ButtonEnviarParaMinhaSelecao />);
    expect(screen.getByRole('button', { name: 'Enviar para a minha seleção' })).toBeDisabled();

    rerender(
      <ButtonEnviarParaMinhaSelecao
        pesquisaAcervo={
          {
            acervoId: 10,
            temControleDisponibilidade: true,
            estaDisponivel: false,
          } as unknown as PesquisaAcervoDTO
        }
      />,
    );
    expect(screen.getByRole('button', { name: 'Enviar para a minha seleção' })).toBeDisabled();
  });

  it('C02: navega sem despachar quando não recebe pesquisaAcervo e há itens selecionados', () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({ solicitacao: { acervosSelecionados: [1, 2] } }),
    );

    render(<ButtonEnviarParaMinhaSelecao />);
    const btn = screen.getByRole('button', { name: 'Enviar para a minha seleção' });
    expect(btn).toBeEnabled();

    fireEvent.click(btn);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SOLICITACAO);
  });

  it('C03: adiciona acervoId na seleção quando ainda não está na lista e navega', () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({ solicitacao: { acervosSelecionados: [1] } }),
    );

    render(
      <ButtonEnviarParaMinhaSelecao
        pesquisaAcervo={{ acervoId: 5 } as unknown as PesquisaAcervoDTO}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Enviar para a minha seleção' }));

    expect(mockDispatch).toHaveBeenCalledWith(setAcervosSelecionados([1, 5]));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SOLICITACAO);
  });

  it('C04: não duplica acervoId se já estiver na lista e navega', () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({ solicitacao: { acervosSelecionados: [5] } }),
    );

    render(
      <ButtonEnviarParaMinhaSelecao
        pesquisaAcervo={{ acervoId: 5 } as unknown as PesquisaAcervoDTO}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Enviar para a minha seleção' }));

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SOLICITACAO);
  });
});
