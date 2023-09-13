import { InboxOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import { DraggerProps, RcFile, UploadFile } from 'antd/es/upload';
import { HttpStatusCode } from 'axios';
import React, { useState } from 'react';
import { permiteInserirFormato } from '~/core/utils/functions';

const { Dragger } = Upload;

type UploadArquivosProps = {
  multiple?: boolean;
  draggerProps?: DraggerProps;
  tamanhoMaximoUpload?: number;
  tiposArquivosPermitidos?: string;
  dowloadService: (codigosArquivo: string) => any;
  removeService: (codigosArquivo: string[]) => any;
  uploadService: (formData: FormData, configuracaoHeader: any) => any;
};

const UploadArquivosSME: React.FC<UploadArquivosProps> = ({
  multiple,
  draggerProps,
  uploadService,
  removeService,
  dowloadService,
  tamanhoMaximoUpload = 100,
  tiposArquivosPermitidos = '',
}) => {
  const [listaDeArquivos, setListaDeArquivos] = useState<UploadFile<any>[]>([]);

  const excedeuLimiteMaximo = (arquivo: File) => {
    const tamanhoArquivo = arquivo.size / 1024 / 1024;

    return tamanhoArquivo > tamanhoMaximoUpload;
  };

  const beforeUploadDefault = (arquivo: RcFile) => {
    if (!permiteInserirFormato(arquivo, tiposArquivosPermitidos)) {
      message.error('Formato não permitido');
      return false;
    }

    if (excedeuLimiteMaximo(arquivo)) {
      message.error(`Tamanho máximo ${tamanhoMaximoUpload} MB`);
      return false;
    }

    return true;
  };

  const customRequestDefault = (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;

    const fmData = new FormData();

    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event: any) => {
        onProgress({ percent: (event.loaded / event.total) * 100 }, file);
      },
    };

    fmData.append('file', file);

    uploadService(fmData, config)
      .then((resposta: any) => {
        const codigo = resposta?.data?.codigo || resposta.data;
        onSuccess(file, codigo);
      })
      .catch((e: any) => onError({ event: e }));
  };

  const onRemoveDefault = async (arquivo: any) => {
    const filtrarCodigosPraRemover = listaDeArquivos.filter((item) => item.xhr === arquivo.xhr);
    const codigosPraRemover = filtrarCodigosPraRemover.map((item) => item.xhr);

    const resposta = await removeService(codigosPraRemover).catch((e: any) => message.error(e));

    if (resposta && resposta.status === HttpStatusCode.Ok) {
      message.success(`Arquivo ${arquivo.name} excluído com sucesso`);
      return true;
    }
    // return false
    return message.error(`Não foi possivel excluir`);
  };

  const atualizaListaArquivos = (fileList: any, file: any) => {
    const novaLista = fileList.filter((item: any) => item.uid !== file.uid);
    const novoMap = [...novaLista];
    setListaDeArquivos(novoMap);
  };

  const onChangeDefault = ({ file, fileList }: any) => {
    const { status } = file;

    if (excedeuLimiteMaximo(file)) {
      atualizaListaArquivos(fileList, file);
      return;
    }

    if (!permiteInserirFormato(file, tiposArquivosPermitidos)) {
      atualizaListaArquivos(fileList, file);
      return;
    }

    const novoMap = [...fileList]?.filter((f) => f?.status !== 'removed');

    if (status === 'done') {
      message.success(`${file.name} arquivo carregado com sucesso`);
    } else if (status === 'error') {
      atualizaListaArquivos(fileList, file);
      return;
    }

    setListaDeArquivos(novoMap);
  };

  const onDownloadDefault = (arquivo: any) => {
    const codigoArquivo = arquivo.xhr;
    dowloadService(codigoArquivo)
      .then((resposta: any) => {
        // downloadBlob(resposta.data, arquivo.name);
        console.log(resposta.data, arquivo.name);
      })
      .catch((e: any) => message.error(e));
  };

  return (
    <Dragger
      name='file'
      listType='picture'
      fileList={listaDeArquivos}
      showUploadList={{ showDownloadIcon: true }}
      multiple={draggerProps?.multiple || multiple}
      onRemove={draggerProps?.onRemove || onRemoveDefault}
      onChange={draggerProps?.onChange || onChangeDefault}
      onDownload={draggerProps?.onDownload || onDownloadDefault}
      beforeUpload={draggerProps?.beforeUpload || beforeUploadDefault}
      customRequest={draggerProps?.customRequest || customRequestDefault}
      {...draggerProps}
    >
      <p className='ant-upload-drag-icon'>
        <InboxOutlined />
      </p>
      <p className='ant-upload-text'>Clique ou arraste para fazer o upload do arquivo</p>
      <p className='ant-upload-hint'>Deve permitir apenas imagens com no máximo 5MB cada</p>
    </Dragger>
  );
};

export default UploadArquivosSME;
