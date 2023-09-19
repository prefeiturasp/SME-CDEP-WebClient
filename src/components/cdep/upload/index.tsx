import { FormInstance, FormItemProps } from 'antd';
import { DraggerProps } from 'antd/es/upload';
import React from 'react';
import UploadArquivosSME from '~/components/lib/upload';
import armazenamentoService from '~/core/services/armazenamento-service';

type UploadArquivosCDEPProps = {
  form: FormInstance;
  formItemProps: FormItemProps & { name: string };
  draggerProps?: DraggerProps;
};
const UploadArquivosCDEP: React.FC<UploadArquivosCDEPProps> = ({
  form,
  formItemProps,
  draggerProps,
}) => {
  return (
    <UploadArquivosSME
      form={form}
      formItemProps={formItemProps}
      draggerProps={draggerProps}
      tiposArquivosPermitidos='.jpg,.jpeg,.png,.tiff,.tif'
      uploadService={armazenamentoService.fazerUploadArquivo}
      downloadService={armazenamentoService.obterArquivoParaDownload}
      tamanhoMaxUploadPorArquivo={5}
    />
  );
};

export default UploadArquivosCDEP;
