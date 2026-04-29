/**
 * @jest-environment jsdom
 */

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
  obterRegistro: jest.fn(),
}));

import service from './usuario-service';
import api, { obterRegistro } from './api';

describe('usuario-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve cadastrar usuario externo', async () => {
    (api.post as jest.Mock).mockResolvedValue({});

    const dados = { nome: 'Teste' } as any;

    await service.cadastrarUsuarioExterno(dados);

    expect(api.post).toHaveBeenCalledWith('v1/usuario', { ...dados });
  });

  it('deve obter meus dados', async () => {
    (api.get as jest.Mock).mockResolvedValue({});

    await service.obterMeusDados('login');

    expect(api.get).toHaveBeenCalledWith('v1/usuario/login');
  });

  it('deve validar cpf existente', async () => {
    (api.get as jest.Mock).mockResolvedValue({});

    await service.validaCPFExistente('123');

    expect(api.get).toHaveBeenCalledWith('v1/usuario/123/existe');
  });

  it('deve alterar email', async () => {
    (api.put as jest.Mock).mockResolvedValue({});

    await service.alterarEmail('login', 'email@test.com');

    expect(api.put).toHaveBeenCalledWith('v1/usuario/login/email', {
      email: 'email@test.com',
    });
  });

  it('deve alterar tipo usuario', async () => {
    (api.put as jest.Mock).mockResolvedValue({});

    await service.alterarTipoUsuario('login', 1);

    expect(api.put).toHaveBeenCalledWith('v1/usuario/login/tipo-usuario', {
      tipo: 1,
    });
  });

  it('deve alterar telefone', async () => {
    (api.put as jest.Mock).mockResolvedValue({});

    await service.alterarTelefone('login', '9999');

    expect(api.put).toHaveBeenCalledWith('v1/usuario/login/telefone', {
      telefone: '9999',
    });
  });

  it('deve alterar endereco', async () => {
    (api.put as jest.Mock).mockResolvedValue({});

    const dados = { rua: 'x' } as any;

    await service.alterarEndereco('login', dados);

    expect(api.put).toHaveBeenCalledWith('v1/usuario/login/endereco', {
      ...dados,
    });
  });

  it('deve alterar senha', async () => {
    (api.put as jest.Mock).mockResolvedValue({});

    const dados = { senha: '123' } as any;

    await service.alterarSenha('login', dados);

    expect(api.put).toHaveBeenCalledWith('v1/usuario/login/senha', dados);
  });

  it('deve solicitar recuperacao de senha', async () => {
    (api.post as jest.Mock).mockResolvedValue({});

    await service.solicitarRecuperacaoSenha('login');

    expect(api.post).toHaveBeenCalledWith(
      'v1/usuario/login/solicitar-recuperacao-senha',
    );
  });

  it('deve alterar senha com token', async () => {
    (api.put as jest.Mock).mockResolvedValue({});

    const params = { token: 'abc' } as any;

    await service.alterarSenhaComTokenRecuperacao(params);

    expect(api.put).toHaveBeenCalledWith(
      'v1/usuario/recuperar-senha',
      { ...params },
    );
  });

  it('deve validar token de recuperacao', async () => {
    (api.get as jest.Mock).mockResolvedValue({});

    await service.tokenRecuperacaoSenhaEstaValido('token');

    expect(api.get).toHaveBeenCalledWith(
      'v1/usuario/valida-token-recuperacao-senha/token',
    );
  });

  it('deve obter perfis responsaveis', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({});

    await service.obterPerfisResponsaveis();

    expect(obterRegistro).toHaveBeenCalledWith(
      'v1/usuario/perfis/responsaveis',
    );
  });

  it('deve obter dados solicitante', async () => {
    (api.get as jest.Mock).mockResolvedValue({});

    await service.obterDadosSolicitante();

    expect(api.get).toHaveBeenCalledWith(
      'v1/usuario/dados-solicitante',
    );
  });

  it('deve obter rf cpf', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({});

    await service.obterRfCpf('123');

    expect(obterRegistro).toHaveBeenCalledWith(
      'v1/usuario/123/dados-solicitante',
    );
  });
});