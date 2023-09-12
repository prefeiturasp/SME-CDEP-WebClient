import api from './api';

const URL_DEFAULT = 'v1/Armazenamento';

const fazerUploadArquivo = (formData: FormData, configuracaoHeader: any, urlUpload?: any) => {
  let url = `${URL_DEFAULT}`;
  if (urlUpload) {
    url = urlUpload;
  }

  return api.post(url, formData, configuracaoHeader);
};

const obterArquivoParaDownload = (codigoArquivo: string) => {
  return api.get(`${URL_DEFAULT}/${codigoArquivo}`, {
    responseType: 'arraybuffer',
  });
};

const removerArquivo = (codigoArquivo: string) => {
  return api.delete(`${URL_DEFAULT}/${codigoArquivo}`);
};

const removerArquivos = (codigosArquivo: string) =>
  api.delete(URL_DEFAULT, { data: codigosArquivo });

export default {
  fazerUploadArquivo,
  obterArquivoParaDownload,
  removerArquivo,
  removerArquivos,
};
