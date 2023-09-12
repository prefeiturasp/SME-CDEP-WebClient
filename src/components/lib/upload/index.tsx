import { InboxOutlined } from '@ant-design/icons';
import type { FormItemProps, UploadFile, UploadProps } from 'antd';
import { Form, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import React, { useState } from 'react';
import armazenamentoService from '~/core/services/armazenamento-service';
import { permiteInserirFormato } from '~/core/utils/functions';

const { Dragger } = Upload;

type UploadArquivosProps = {
  uploadProps?: UploadProps;
  tamanhoMaximoUpload?: number;
  formItemProps?: FormItemProps;
  tiposArquivosPermitidos?: string;
};

const UploadArquivos: React.FC<UploadArquivosProps> = ({
  uploadProps,
  formItemProps,
  tamanhoMaximoUpload = 100,
  tiposArquivosPermitidos = '',
}) => {
  const [fileList, setFileList] = useState<UploadFile<any>[] | undefined>([]);

  const excedeuLimiteMaximo = (arquivo: File) => {
    const tamanhoArquivo = arquivo.size / 1024 / 1024;
    return tamanhoArquivo > tamanhoMaximoUpload;
  };

  const beforeUploadDefault = (arquivo: RcFile) => {
    if (!permiteInserirFormato(arquivo, tiposArquivosPermitidos)) {
      console.log('Formato não permitido');
      return false;
    }

    if (excedeuLimiteMaximo(arquivo)) {
      console.log(`Tamanho máximo ${tamanhoMaximoUpload} MB`);
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
    console.log('🚀 ~ customRequestDefault ~ file:', file);

    armazenamentoService
      .fazerUploadArquivo(file, config)
      .then((resposta) => {
        const codigo = resposta?.data?.codigo || resposta.data;
        onSuccess(file, codigo);
      })
      .catch((e) => onError({ event: e }));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  return (
    <Form.Item name='anexos' label='Anexos' wrapperCol={{ xs: 24 }} {...formItemProps}>
      <Dragger
        name='file'
        fileList={fileList}
        onChange={handleChange}
        action='v1/Armazenamento'
        // accept={tiposArquivosPermitidos}
        beforeUpload={beforeUploadDefault}
        customRequest={customRequestDefault}
        onDrop={(e) => {
          console.log('Dropped files', e.dataTransfer.files);
        }}
        {...uploadProps}
      >
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>Clique ou arraste para fazer o upload do arquivo</p>
        <p className='ant-upload-hint'>Deve permitir apenas imagens com no máximo 5MB cada</p>
      </Dragger>
    </Form.Item>
  );
};

export default UploadArquivos;
