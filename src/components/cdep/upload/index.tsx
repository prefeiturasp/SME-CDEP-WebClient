import { FormInstance } from 'antd';
import React from 'react';
import UploadArquivosSME from '~/components/lib/upload';
import armazenamentoService from '~/core/services/armazenamento-service';

type UploadArquivosCDEPProps = {
  form: FormInstance;
};
const UploadArquivosCDEP: React.FC<UploadArquivosCDEPProps> = ({ form }) => {
  return (
    <UploadArquivosSME
      multiple
      form={form}
      formItemProps={{
        name: 'arquivos',
        label: 'Arquivos',
      }}
      tiposArquivosPermitidos='.jpg,.jpeg,.png'
      removeService={armazenamentoService.removerArquivos}
      uploadService={armazenamentoService.fazerUploadArquivo}
      downloadService={armazenamentoService.obterArquivoParaDownload}
    />
  );
};

export default UploadArquivosCDEP;
