import api from './api';

const URL_DEFAULT = 'v1/armazenamento';

const fazerUploadArquivo = (formData: any, configuracaoHeader: any, urlUpload?: any) => {
  let url = `${URL_DEFAULT}`;
  if (urlUpload) {
    url = urlUpload;
  }
  return api.post(url, formData, configuracaoHeader);
};

export default {
  fazerUploadArquivo,
};
