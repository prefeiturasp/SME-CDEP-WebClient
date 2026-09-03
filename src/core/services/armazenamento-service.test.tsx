import armazenamentoService from './armazenamento-service';
import api, { inserirRegistro, obterRegistro } from './api';
import { TipoAcervo } from '../enum/tipo-acervo';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
  inserirRegistro: jest.fn(),
  obterRegistro: jest.fn(),
}));

describe('armazenamento-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fazerUploadArquivo chama inserirRegistro com params corretos', async () => {
    (inserirRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    const formData = new FormData();
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    await armazenamentoService.fazerUploadArquivo(formData, config);

    expect(inserirRegistro).toHaveBeenCalledWith(
      'v1/Armazenamento',
      formData,
      config,
    );
  });

  it('obterArquivoParaDownload chama api.get com responseType arraybuffer', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: {} });

    await armazenamentoService.obterArquivoParaDownload('123');

    expect(api.get).toHaveBeenCalledWith('v1/Armazenamento/123', {
      responseType: 'arraybuffer',
    });
  });

  it('downloadPorTipoAcervo chama obterRegistro com params', async () => {
    (obterRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await armazenamentoService.downloadPorTipoAcervo(TipoAcervo.Fotografico as any);

    expect(obterRegistro).toHaveBeenCalledWith(
      'v1/Armazenamento/download/tipo-acervo',
      {
        responseType: 'blob',
        params: { tipoAcervo: TipoAcervo.Fotografico },
      },
    );
  });
});