import api, { deletarRegistro } from './api';

const URL_DEFAULT = 'v1/Armazenamento';

const fazerUploadArquivo = (formData: FormData, configuracaoHeader: any) =>
  api.post(URL_DEFAULT, formData, configuracaoHeader);

const obterArquivoParaDownload = (codigoArquivo: string) => {
  return api.get(`${URL_DEFAULT}/${codigoArquivo}`, {
    responseType: 'arraybuffer',
  });
};

const removerArquivos = (codigosArquivo: string[]) =>
  deletarRegistro(URL_DEFAULT, { data: codigosArquivo });

export default {
  removerArquivos,
  fazerUploadArquivo,
  obterArquivoParaDownload,
};
