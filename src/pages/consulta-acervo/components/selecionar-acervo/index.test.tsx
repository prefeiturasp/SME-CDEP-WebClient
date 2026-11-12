import { fireEvent, render, screen } from '@testing-library/react';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';
import { useAppDispatch, useAppSelector } from '~/core/hooks/use-redux';
import { setAcervosSelecionados } from '~/core/redux/modules/solicitacao/actions';
import CheckboxSelecionarAcervo from './index';

const mockDispatch = jest.fn();

jest.mock('~/core/hooks/use-redux', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

describe('CheckboxSelecionarAcervo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  it('C07/C09: alterna entre "Selecionar" e "Selecionado" ao marcar e desmarcar', () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({ solicitacao: { acervosSelecionados: [1] } }),
    );

    const { rerender } = render(
      <CheckboxSelecionarAcervo pesquisaAcervo={{ acervoId: 2 } as unknown as PesquisaAcervoDTO} />,
    );

    expect(screen.getByText('Selecionar')).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(mockDispatch).toHaveBeenCalledWith(setAcervosSelecionados([1, 2]));

    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({ solicitacao: { acervosSelecionados: [1, 2] } }),
    );
    rerender(
      <CheckboxSelecionarAcervo pesquisaAcervo={{ acervoId: 2 } as unknown as PesquisaAcervoDTO} />,
    );

    expect(screen.getByText('Selecionado')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeChecked();

    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockDispatch).toHaveBeenCalledWith(setAcervosSelecionados([1]));
  });

  it('C08: desabilita checkbox quando controle de disponibilidade indica indisponível', () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({ solicitacao: { acervosSelecionados: [] } }),
    );

    render(
      <CheckboxSelecionarAcervo
        pesquisaAcervo={
          {
            acervoId: 3,
            temControleDisponibilidade: true,
            estaDisponivel: false,
          } as unknown as PesquisaAcervoDTO
        }
      />,
    );

    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});
