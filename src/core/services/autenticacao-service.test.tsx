import autenticacaoService, {
  URL_AUTENTICACAO_REVALIDAR,
} from './autenticacao-service';
import api from './api';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    put: jest.fn(),
  },
}));

describe('autenticacao-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('autenticar chama api.post com dados corretos', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: {} });

    const dados = { usuario: 'u', senha: 's' } as any;

    await autenticacaoService.autenticar(dados);

    expect(api.post).toHaveBeenCalledWith('v1/autenticacao', { ...dados });
  });

  it('autenticarRevalidar chama endpoint de revalidacao', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: {} });

    await autenticacaoService.autenticarRevalidar('token');

    expect(api.post).toHaveBeenCalledWith(URL_AUTENTICACAO_REVALIDAR, {
      token: 'token',
    });
  });

  it('alterarPerfilSelecionado chama put com perfilId', async () => {
    (api.put as jest.Mock).mockResolvedValueOnce({ data: {} });

    await autenticacaoService.alterarPerfilSelecionado('123');

    expect(api.put).toHaveBeenCalledWith('v1/autenticacao/perfis/123');
  });
});