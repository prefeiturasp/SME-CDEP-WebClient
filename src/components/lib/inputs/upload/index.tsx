import { InboxOutlined } from '@ant-design/icons';
import type { FormItemProps, UploadFile, UploadProps } from 'antd';
import { Form, Upload } from 'antd';
import React, { useState } from 'react';
import { erro } from '~/core/services/alerta-service';
import armazenamentoService from '~/core/services/armazenamento-service';
import { permiteInserirFormato } from '~/core/utils/functions';

const { Dragger } = Upload;

type UploadArquivosProps = {
  uploadProps?: UploadProps;
  formItemProps?: FormItemProps;
};

const UploadArquivos: React.FC<UploadArquivosProps> = ({ uploadProps, formItemProps }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const TAMANHO_MAXIMO_UPLOAD = 100;
  const tiposArquivosPermitidos = '.jpeg,.jpg,.png';

  const excedeuLimiteMaximo = (arquivo: File) => {
    const tamanhoArquivo = arquivo.size / 1024 / 1024;
    return tamanhoArquivo > TAMANHO_MAXIMO_UPLOAD;
  };

  const beforeUploadDefault = (arquivo: File) => {
    if (!permiteInserirFormato(arquivo, tiposArquivosPermitidos)) {
      erro('Formato não permitido');
      return false;
    }

    if (excedeuLimiteMaximo(arquivo)) {
      erro('Tamanho máximo 100 MB');
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

    armazenamentoService
      .fazerUploadArquivo(fmData, config)
      .then((resposta) => {
        const codigo = resposta?.data?.codigo || resposta.data;
        onSuccess(file, codigo);
      })
      .catch((e) => onError({ event: e }));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  return (
    <Form.Item label='Anexos' name='anexos' rules={[{ required: true }]} {...formItemProps}>
      <Dragger
        multiple
        name='file'
        fileList={fileList}
        onChange={handleChange}
        accept={tiposArquivosPermitidos}
        beforeUpload={beforeUploadDefault}
        customRequest={customRequestDefault}
        action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
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
