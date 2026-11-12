import { deletarSuspensao, inserirSuspensao, obterDetalheDia, obterSemanas } from './calendario-eventos-service';
import { deletarRegistro, inserirRegistro, obterRegistro } from './api';
import { URL_API_EVENTO } from '../constants/urls-api';
import { TipoEventoEnum } from '../enum/tipo-evento-enum';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
  inserirRegistro: jest.fn(),
  deletarRegistro: jest.fn(),
}));

describe('calendario-eventos-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obterSemanas', () => {
    it('chama obterRegistro com mes correto', async () => {
      (obterRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

      await obterSemanas(5);

      expect(obterRegistro).toHaveBeenCalledWith(`${URL_API_EVENTO}/calendario/5`);
      expect(obterRegistro).toHaveBeenCalledTimes(1);
    });
  });

  describe('obterDetalheDia', () => {
    it('chama obterRegistro com dia e mes corretos', async () => {
      (obterRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

      await obterDetalheDia(10, 5);

      expect(obterRegistro).toHaveBeenCalledWith(`${URL_API_EVENTO}/detalhes-dia`, {
        params: { dia: 10, mes: 5 },
      });
      expect(obterRegistro).toHaveBeenCalledTimes(1);
    });
  });

  describe('inserirSuspensao', () => {
    it('chama inserirRegistro com params corretos', async () => {
      (inserirRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

      const params = { tipo: TipoEventoEnum.SUSPENSAO, descricao: 'desc', justificativa: 'just' } as any;

      await inserirSuspensao(params);

      expect(inserirRegistro).toHaveBeenCalledWith(URL_API_EVENTO, params);
      expect(inserirRegistro).toHaveBeenCalledTimes(1);
    });
  });

  describe('deletarSuspensao', () => {
    it('chama deletarRegistro com id correto', async () => {
      (deletarRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

      await deletarSuspensao(42);

      expect(deletarRegistro).toHaveBeenCalledWith(`${URL_API_EVENTO}/42`);
      expect(deletarRegistro).toHaveBeenCalledTimes(1);
    });
  });
});
