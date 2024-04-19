import { TipoAcervo } from '../enum/tipo-acervo';
import api, { inserirRegistro, obterRegistro } from './api';

const URL_DEFAULT = 'v1/Armazenamento';

const fazerUploadArquivo = (formData: FormData, configuracaoHeader: any) =>
  inserirRegistro(URL_DEFAULT, formData, configuracaoHeader);

const obterArquivoParaDownload = (codigoArquivo: string) => {
  return api.get(`${URL_DEFAULT}/${codigoArquivo}`, {
    responseType: 'arraybuffer',
  });
};

const downloadPorTipoAcervo = (tipoAcervo: TipoAcervo) =>
  obterRegistro(`${URL_DEFAULT}/download/tipo-acervo`, {
    responseType: 'blob',
    params: { tipoAcervo },
  });

export default {
  fazerUploadArquivo,
  obterArquivoParaDownload,
  downloadPorTipoAcervo,
};
