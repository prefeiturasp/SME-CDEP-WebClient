import { render, screen, waitFor } from '@testing-library/react';
import { TipoUsuario } from '~/core/enum/tipo-usuario-enum';
import usuarioService from '~/core/services/usuario-service';
import CardDadosSolicitante from './index';

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    obterDadosSolicitante: jest.fn(),
  },
}));

jest.mock('~/core/services/api', () => ({
  tratarThen: jest.fn((res) => res?.data ?? res),
  tratarCatch: jest.fn(() => ({ sucesso: false, dados: null })),
}));

describe('CardDadosSolicitante', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockDadosExterno = {
    nome: 'Ana Carolina Silva',
    login: '123.456.789-00',
    telefone: '(11) 98765-4321',
    email: 'ana.silva@email.com',
    tipo: 'Estudante',
    tipoId: TipoUsuario.ESTUDANTE,
    endereco: 'Avenida Paulista, 1000 - Bela Vista',
  };

  const mockDadosCoresso = {
    nome: 'Roberto Servidor',
    login: '1122334',
    telefone: '(11) 3396-0000',
    email: 'roberto@sme.prefeitura.sp.gov.br',
    tipo: 'Servidor SME',
    tipoId: TipoUsuario.CORESSO,
    endereco: 'Rua da Consolação, 200',
  };

  it('deve renderizar dados completos para usuário externo incluindo CPF, telefone e endereço', async () => {
    (usuarioService.obterDadosSolicitante as jest.Mock).mockResolvedValueOnce({
      sucesso: true,
      dados: mockDadosExterno,
    });

    render(<CardDadosSolicitante />);

    expect(screen.getByText('Dados do solicitante')).toBeInTheDocument();

    await waitFor(() => {
      expect(usuarioService.obterDadosSolicitante).toHaveBeenCalled();
      expect(screen.getByText('Ana Carolina Silva')).toBeInTheDocument();
    });

    expect(screen.getByText('CPF:')).toBeInTheDocument();
    expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
    expect(screen.getByText('Telefone:')).toBeInTheDocument();
    expect(screen.getByText('(11) 98765-4321')).toBeInTheDocument();
    expect(screen.getByText('E-mail:')).toBeInTheDocument();
    expect(screen.getByText('ana.silva@email.com')).toBeInTheDocument();
    expect(screen.getByText('Tipo do Usuário:')).toBeInTheDocument();
    expect(screen.getByText('Estudante')).toBeInTheDocument();
    expect(screen.getByText('Endereço:')).toBeInTheDocument();
    expect(screen.getByText('Avenida Paulista, 1000 - Bela Vista')).toBeInTheDocument();
  });

  it('não deve renderizar campos de CPF, telefone e endereço para usuário CORESSO', async () => {
    (usuarioService.obterDadosSolicitante as jest.Mock).mockResolvedValueOnce({
      sucesso: true,
      dados: mockDadosCoresso,
    });

    render(<CardDadosSolicitante />);

    await waitFor(() => {
      expect(usuarioService.obterDadosSolicitante).toHaveBeenCalled();
      expect(screen.getByText('Roberto Servidor')).toBeInTheDocument();
    });

    expect(screen.getByText('E-mail:')).toBeInTheDocument();
    expect(screen.getByText('roberto@sme.prefeitura.sp.gov.br')).toBeInTheDocument();
    expect(screen.getByText('Tipo do Usuário:')).toBeInTheDocument();
    expect(screen.getByText('Servidor SME')).toBeInTheDocument();

    expect(screen.queryByText('CPF:')).not.toBeInTheDocument();
    expect(screen.queryByText('Telefone:')).not.toBeInTheDocument();
    expect(screen.queryByText('Endereço:')).not.toBeInTheDocument();
  });

  it('não deve preencher dados quando a requisição retornar sucesso false', async () => {
    (usuarioService.obterDadosSolicitante as jest.Mock).mockResolvedValueOnce({
      sucesso: false,
      dados: null,
    });

    render(<CardDadosSolicitante />);

    await waitFor(() => {
      expect(usuarioService.obterDadosSolicitante).toHaveBeenCalled();
    });

    expect(screen.queryByText('Ana Carolina Silva')).not.toBeInTheDocument();
    expect(screen.queryByText('CPF:')).not.toBeInTheDocument();
  });

  it('deve tratar erro na requisição através de tratarCatch', async () => {
    (usuarioService.obterDadosSolicitante as jest.Mock).mockRejectedValueOnce(
      new Error('Erro de rede'),
    );

    render(<CardDadosSolicitante />);

    await waitFor(() => {
      expect(usuarioService.obterDadosSolicitante).toHaveBeenCalled();
    });

    expect(screen.queryByText('Ana Carolina Silva')).not.toBeInTheDocument();
  });
});
