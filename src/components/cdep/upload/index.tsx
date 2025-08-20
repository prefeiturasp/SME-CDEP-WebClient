import { FormInstance, FormItemProps } from 'antd';
import { DraggerProps } from 'antd/es/upload';
import React, { useEffect, useState } from 'react';
import UploadArquivosSME from '~/components/lib/upload';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import armazenamentoService from '~/core/services/armazenamento-service';

type UploadArquivosCDEPProps = {
  form: FormInstance;
  formItemProps: FormItemProps & { name: string };
  draggerProps?: DraggerProps;
  tipoAcervo?: TipoAcervo;
};
const UploadArquivosCDEP: React.FC<UploadArquivosCDEPProps> = ({
  form,
  formItemProps,
  draggerProps,
  tipoAcervo,
}) => {
  const [tiposArquivosPermitidos, setTiposArquivosPermitidos] = useState<string>(
    '.jpg,.jpeg,.png,.tiff,.tif,.webp,.pdf',
  );
  const [tamanhoMaxUploadArquivoMB, setTamanhoMaxUploadArquivoMB] = useState<number>(5);

  const configUploadTipoAcervo = () => {
    switch (tipoAcervo) {
      case TipoAcervo.DocumentacaoHistorica:
        setTiposArquivosPermitidos('.pdf');
        setTamanhoMaxUploadArquivoMB(15);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    configUploadTipoAcervo();
  }, []);

  return (
    <UploadArquivosSME
      form={form}
      formItemProps={formItemProps}
      draggerProps={draggerProps}
      tiposArquivosPermitidos={tiposArquivosPermitidos}
      uploadService={armazenamentoService.fazerUploadArquivo}
      downloadService={armazenamentoService.obterArquivoParaDownload}
      tamanhoMaxUploadPorArquivo={tamanhoMaxUploadArquivoMB}
    />
  );
};

export default UploadArquivosCDEP;
