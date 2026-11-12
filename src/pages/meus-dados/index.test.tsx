import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { HttpStatusCode } from 'axios';
import { CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_TELEFONE } from '~/core/constants/ids/input';
import { ROUTES } from '~/core/enum/routes';
import { TipoPerfil } from '~/core/enum/tipo-perfil-enum';
import { TipoUsuario } from '~/core/enum/tipo-usuario-enum';
import { useAppDispatch, useAppSelector } from '~/core/hooks/use-redux';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import usuarioService from '~/core/services/usuario-service';
import MeusDados from './index';

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

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    obterMeusDados: jest.fn(),
  },
}));

jest.mock('./components/modal-edit-email/modal-edit-email-button', () => {
  const MockEmailBtn = () => <button type='button'>MockEmailBtn</button>;
  return MockEmailBtn;
});
jest.mock('./components/modal-edit-nova-senha/modal-edit-nova-senha-button', () => {
  const MockSenhaBtn = () => <button type='button'>MockSenhaBtn</button>;
  return MockSenhaBtn;
});
jest.mock('./components/modal-edit-telefone/modal-edit-telefone-button', () => {
  const MockTelBtn = () => <button type='button'>MockTelBtn</button>;
  return MockTelBtn;
});
jest.mock('./components/modal-edit-endereco/modal-edit-endereco-button', () => {
  const MockEndBtn = () => <button type='button'>MockEndBtn</button>;
  return MockEndBtn;
});
jest.mock('./components/modal-edit-tipo-usuario/modal-edit-tipo-usuario-button', () => {
  const MockTipoBtn = () => <button type='button'>MockTipoBtn</button>;
  return MockTipoBtn;
});

jest.setTimeout(15000);

describe('MeusDados', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        auth: { usuarioLogin: 'diego.moreno', usuarioNome: 'Diego Moreno' },
        perfil: {
          perfilSelecionado: {
            perfilNome: 'Administrador Geral',
            perfil: TipoPerfil.ADMIN_GERAL,
          },
        },
      }),
    );
  });

  it('C18/C20/C21: carrega dados de usuário externo, exibe todos os campos e navega Voltar para INDICADORES (admin)', async () => {
    (usuarioService.obterMeusDados as jest.Mock).mockResolvedValue({
      status: HttpStatusCode.Ok,
      data: {
        login: 'diego.moreno',
        cpf: '123.456.789-00',
        email: 'diego@sme.prefeitura.sp.gov.br',
        telefone: '11999999999',
        tipo: TipoUsuario.ESTUDANTE,
      },
    });

    render(<MeusDados />);

    expect(mockDispatch).toHaveBeenCalledWith(setSpinning(true));

    await waitFor(() => {
      expect(usuarioService.obterMeusDados).toHaveBeenCalledWith('diego.moreno');
    });

    await waitFor(() => {
      expect(screen.getByText('Login: diego.moreno')).toBeInTheDocument();
    });

    expect(screen.getByText('Diego Moreno')).toBeInTheDocument();
    expect(screen.getByText('Perfil: Administrador Geral')).toBeInTheDocument();
    expect(screen.getByText('CPF: 123.456.789-00')).toBeInTheDocument();
    expect(document.getElementById(CDEP_INPUT_TELEFONE)).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledWith(setSpinning(false));

    fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR) as HTMLElement);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.INDICADORES);
  });

  it('C20b/C21b: oculta campos extras para usuário CORESSO e navega Voltar para PRINCIPAL (não admin)', async () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        auth: { usuarioLogin: 'coresso.user', usuarioNome: 'Coresso User' },
        perfil: {
          perfilSelecionado: {
            perfilNome: 'Solicitante',
            perfil: 'SOLICITANTE',
          },
        },
      }),
    );

    (usuarioService.obterMeusDados as jest.Mock).mockResolvedValue({
      status: HttpStatusCode.Ok,
      data: {
        login: 'coresso.user',
        cpf: '111.222.333-44',
        email: 'coresso@sme.prefeitura.sp.gov.br',
        tipo: TipoUsuario.CORESSO,
      },
    });

    render(<MeusDados />);

    await waitFor(() => {
      expect(screen.getByText('Login: coresso.user')).toBeInTheDocument();
    });

    expect(document.getElementById(CDEP_INPUT_TELEFONE)).not.toBeInTheDocument();

    fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR) as HTMLElement);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
  });

  it('C19: trata resposta não-200 e exibe alert quando obterMeusDados falha', async () => {
    (usuarioService.obterMeusDados as jest.Mock).mockResolvedValueOnce({
      status: HttpStatusCode.NoContent,
      data: null,
    });

    const { unmount } = render(<MeusDados />);
    await waitFor(() => expect(mockDispatch).toHaveBeenCalledWith(setSpinning(false)));
    expect(screen.queryByText('Login: diego.moreno')).not.toBeInTheDocument();
    unmount();

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => undefined);
    (usuarioService.obterMeusDados as jest.Mock).mockRejectedValueOnce(new Error('Falha API'));

    render(<MeusDados />);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('erro ao obter meus dados');
    });
    expect(mockDispatch).toHaveBeenCalledWith(setSpinning(false));
    alertSpy.mockRestore();
  });
});
