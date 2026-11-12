/**
 * @jest-environment jsdom
 */

jest.mock('./api', () => ({
  __esModule: true,
  obterRegistro: jest.fn(),
}));

jest.mock('../constants/urls-api', () => ({
  URL_API_ACERVO: '/acervo',
}));

import { obterRegistro } from './api';
import {
  obterTiposAcervo,
  pesquisarAcervosAreaPublica,
  obterDetalhamentoPorTipoAcervoECodigoAreaPublica,
  obterTermoDeCompromisso,
  obterCodigoTombo,
  obterTituloAcervo,
} from './acervo-service';

describe('acervo-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve obter tipos de acervo', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await obterTiposAcervo();

    expect(obterRegistro).toHaveBeenCalledWith('/acervo/tipos');
  });

  it('deve pesquisar acervos na area publica', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    const params = { textoLivre: 'teste' };

    await pesquisarAcervosAreaPublica(1, 10, params as any);

    expect(obterRegistro).toHaveBeenCalledWith('/acervo/pesquisar-acervos', {
      params: { numeroPagina: 1, numeroRegistros: 10, ...params },
    });
  });

  it('deve obter detalhamento por tipo e codigo', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await obterDetalhamentoPorTipoAcervoECodigoAreaPublica('123', 1 as any);

    expect(obterRegistro).toHaveBeenCalledWith('/acervo/detalhar-acervo', {
      params: { codigo: '123', tipo: 1 },
    });
  });

  it('deve obter termo de compromisso', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await obterTermoDeCompromisso();

    expect(obterRegistro).toHaveBeenCalledWith('/acervo/termo-compromisso');
  });

  it('deve obter codigo tombo', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await obterCodigoTombo('ABC123');

    expect(obterRegistro).toHaveBeenCalledWith('/acervo/pesquisar', {
      params: { codigoTombo: 'ABC123' },
    });
  });

  it('deve obter titulo do acervo', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await obterTituloAcervo('livro');

    expect(obterRegistro).toHaveBeenCalledWith(
      '/acervo/autocompletar-titulo?termoPesquisado=livro',
    );
  });
});