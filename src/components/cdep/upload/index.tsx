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
    '.jpg,.jpeg,.png,.tiff,.tif',
  );
  const [tamanhoMaxUploadArquivoMB, setTamanhoMaxUploadArquivoMB] = useState<number>(50);
  const [permiteMultiplos, setPermiteMultiplos] = useState<boolean>(true);

  const configUploadTipoAcervo = () => {
    switch (tipoAcervo) {
      case TipoAcervo.DocumentacaoTextual:
        setTiposArquivosPermitidos('.pdf');
        setTamanhoMaxUploadArquivoMB(20);
        break;

      default:
        setPermiteMultiplos(true);
        break;
    }
  };

  useEffect(() => {
    configUploadTipoAcervo();
  }, [tipoAcervo]);

  return (
    <UploadArquivosSME
      form={form}
      formItemProps={formItemProps}
      draggerProps={draggerProps}
      tiposArquivosPermitidos={tiposArquivosPermitidos}
      uploadService={armazenamentoService.fazerUploadArquivo}
      downloadService={armazenamentoService.obterArquivoParaDownload}
      tamanhoMaxUploadPorArquivo={tamanhoMaxUploadArquivoMB}
      permiteMultiplosArquivos={permiteMultiplos}
    />
  );
};

export default UploadArquivosCDEP;
