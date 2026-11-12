import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { HttpStatusCode } from 'axios';
import { CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import {
  CDEP_INPUT_BAIRRO,
  CDEP_INPUT_CEP,
  CDEP_INPUT_CIDADE,
  CDEP_INPUT_COMPLEMENTO,
  CDEP_INPUT_EMAIL,
  CDEP_INPUT_ENDERECO,
  CDEP_INPUT_INSTITUICAO_EMPRESA,
  CDEP_INPUT_NUMERO,
  CDEP_INPUT_SENHA,
  CDEP_INPUT_TELEFONE,
} from '~/core/constants/ids/input';
import { CDEP_SELECT_TIPO_USUARIO, CDEP_SELECT_UF } from '~/core/constants/ids/select';
import { ROUTES } from '~/core/enum/routes';
import { TipoPerfil } from '~/core/enum/tipo-perfil-enum';
import { TipoUsuario } from '~/core/enum/tipo-usuario-enum';
import usuarioService from '~/core/services/usuario-service';
import MeusDados from './index';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();
let mockAuthState: { usuarioLogin?: string; usuarioNome?: string } = {
  usuarioLogin: 'usuario.teste',
  usuarioNome: 'Maria dos Santos',
};
let mockPerfilState: {
  perfilSelecionado?: { perfilNome?: string; perfil?: TipoPerfil };
} = {
  perfilSelecionado: {
    perfilNome: 'Pesquisador',
    perfil: TipoPerfil.EXTERNO,
  },
};

jest.mock('~/core/hooks/use-redux', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) =>
    selector({
      auth: mockAuthState,
      perfil: mockPerfilState,
    }),
}));

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    obterMeusDados: jest.fn(),
  },
}));

jest.mock('./components/modal-edit-email/modal-edit-email-button', () => {
  return function MockModalEditEmailButton() {
    return <button data-testid='modal-edit-email-button'>Alterar Email</button>;
  };
});
jest.mock('./components/modal-edit-nova-senha/modal-edit-nova-senha-button', () => {
  return function MockModalEditNovaSenhaButton() {
    return <button data-testid='modal-edit-nova-senha-button'>Alterar Senha</button>;
  };
});
jest.mock('./components/modal-edit-telefone/modal-edit-telefone-button', () => {
  return function MockModalEditTelefoneButton() {
    return <button data-testid='modal-edit-telefone-button'>Alterar Telefone</button>;
  };
});
jest.mock('./components/modal-edit-endereco/modal-edit-endereco-button', () => {
  return function MockModalEditEnderecoButton() {
    return <button data-testid='modal-edit-endereco-button'>Alterar Endereço</button>;
  };
});
jest.mock('./components/modal-edit-tipo-usuario/modal-edit-tipo-usuario-button', () => {
  return function MockModalEditTipoUsuarioButton() {
    return <button data-testid='modal-edit-tipo-usuario-button'>Alterar Tipo Usuário</button>;
  };
});

describe('MeusDados', () => {
  const dadosUsuarioMock = {
    login: 'usuario.teste',
    nome: 'Maria dos Santos',
    cpf: '123.456.789-00',
    email: 'maria@teste.com',
    telefone: '(11) 98765-4321',
    cep: '01001-000',
    endereco: 'Praça da Sé',
    numero: '100',
    complemento: 'Apto 1',
    bairro: 'Sé',
    cidade: 'São Paulo',
    uf: 'SP',
    tipo: 1,
    instituicaoEmpresa: 'USP',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    mockAuthState = {
      usuarioLogin: 'usuario.teste',
      usuarioNome: 'Maria dos Santos',
    };
    mockPerfilState = {
      perfilSelecionado: {
        perfilNome: 'Pesquisador',
        perfil: TipoPerfil.EXTERNO,
      },
    };
    (usuarioService.obterMeusDados as jest.Mock).mockResolvedValue({
      status: HttpStatusCode.Ok,
      data: dadosUsuarioMock,
    });
  });

  it('deve carregar os dados do usuário e renderizar as informações e campos de endereço', async () => {
    render(<MeusDados />);

    expect(screen.getByText('Meus dados')).toBeInTheDocument();
    expect(screen.getByText('Maria dos Santos')).toBeInTheDocument();
    expect(screen.getByText(/Perfil:\s*Pesquisador/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(usuarioService.obterMeusDados).toHaveBeenCalledWith('usuario.teste');
    });

    expect(screen.getByText('Login: usuario.teste')).toBeInTheDocument();
    expect(screen.getByText('CPF: 123.456.789-00')).toBeInTheDocument();

    expect(document.getElementById(CDEP_INPUT_EMAIL)).toBeInTheDocument();
    expect(document.getElementById(CDEP_INPUT_SENHA)).toBeInTheDocument();
    expect(document.getElementById(CDEP_INPUT_TELEFONE)).toBeInTheDocument();
    expect(document.getElementById(CDEP_INPUT_CEP)).toBeInTheDocument();
    expect(document.getElementById(CDEP_INPUT_ENDERECO)).toBeInTheDocument();
    expect(document.getElementById(CDEP_INPUT_NUMERO)).toBeInTheDocument();
    expect(document.getElementById(CDEP_INPUT_COMPLEMENTO)).toBeInTheDocument();
    expect(document.getElementById(CDEP_INPUT_BAIRRO)).toBeInTheDocument();
    expect(document.getElementById(CDEP_INPUT_CIDADE)).toBeInTheDocument();
    expect(document.getElementById(CDEP_SELECT_UF)).toBeInTheDocument();
    expect(document.getElementById(CDEP_SELECT_TIPO_USUARIO)).toBeInTheDocument();
    expect(document.getElementById(CDEP_INPUT_INSTITUICAO_EMPRESA)).toBeInTheDocument();

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: true }));
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: false }));
  });

  it('não deve renderizar campos de endereço e complementares para usuário CORESSO', async () => {
    (usuarioService.obterMeusDados as jest.Mock).mockResolvedValueOnce({
      status: HttpStatusCode.Ok,
      data: {
        ...dadosUsuarioMock,
        tipo: TipoUsuario.CORESSO,
      },
    });

    render(<MeusDados />);

    await waitFor(() => {
      expect(screen.getByText('Login: usuario.teste')).toBeInTheDocument();
    });

    expect(document.getElementById(CDEP_INPUT_EMAIL)).toBeInTheDocument();
    expect(document.getElementById(CDEP_INPUT_SENHA)).toBeInTheDocument();

    expect(document.getElementById(CDEP_INPUT_TELEFONE)).not.toBeInTheDocument();
    expect(document.getElementById(CDEP_INPUT_CEP)).not.toBeInTheDocument();
    expect(document.getElementById(CDEP_INPUT_ENDERECO)).not.toBeInTheDocument();
    expect(document.getElementById(CDEP_INPUT_NUMERO)).not.toBeInTheDocument();
    expect(document.getElementById(CDEP_INPUT_COMPLEMENTO)).not.toBeInTheDocument();
    expect(document.getElementById(CDEP_INPUT_BAIRRO)).not.toBeInTheDocument();
    expect(document.getElementById(CDEP_INPUT_CIDADE)).not.toBeInTheDocument();
    expect(document.getElementById(CDEP_SELECT_UF)).not.toBeInTheDocument();
    expect(document.getElementById(CDEP_SELECT_TIPO_USUARIO)).not.toBeInTheDocument();
    expect(document.getElementById(CDEP_INPUT_INSTITUICAO_EMPRESA)).not.toBeInTheDocument();
  });

  it('não deve preencher dados quando a API retornar status diferente de 200 (Ok)', async () => {
    (usuarioService.obterMeusDados as jest.Mock).mockResolvedValueOnce({
      status: HttpStatusCode.NoContent,
      data: null,
    });

    render(<MeusDados />);

    await waitFor(() => {
      expect(usuarioService.obterMeusDados).toHaveBeenCalled();
    });

    expect(screen.queryByText('Login: usuario.teste')).not.toBeInTheDocument();
  });

  it('deve disparar alert quando ocorrer erro na requisição', async () => {
    (usuarioService.obterMeusDados as jest.Mock).mockRejectedValueOnce(new Error('Erro API'));

    render(<MeusDados />);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('erro ao obter meus dados');
    });

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: false }));
  });

  describe('Navegação do botão voltar', () => {
    it('deve navegar para ROUTES.PRINCIPAL quando o usuário não for perfil admin', async () => {
      mockPerfilState = {
        perfilSelecionado: {
          perfilNome: 'Solicitante',
          perfil: TipoPerfil.EXTERNO,
        },
      };

      render(<MeusDados />);

      const botaoVoltar = document.getElementById(CDEP_BUTTON_VOLTAR)!;
      fireEvent.click(botaoVoltar);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
    });

    it('deve navegar para ROUTES.INDICADORES quando o usuário for perfil admin', async () => {
      mockPerfilState = {
        perfilSelecionado: {
          perfilNome: 'Administrador Geral',
          perfil: TipoPerfil.ADMIN_GERAL,
        },
      };

      render(<MeusDados />);

      const botaoVoltar = document.getElementById(CDEP_BUTTON_VOLTAR)!;
      fireEvent.click(botaoVoltar);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.INDICADORES);
    });
  });
});
