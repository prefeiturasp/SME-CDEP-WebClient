import { InboxOutlined } from '@ant-design/icons';
import { Button, Form, FormInstance, FormItemProps, Upload } from 'antd';
import { DraggerProps, RcFile, UploadFile } from 'antd/es/upload';
import { FaRegEye } from 'react-icons/fa';
import { notification } from '~/components/lib/notification';

import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '~/components/lib/modal';

const { Dragger } = Upload;

enum HttpStatusCode {
  Ok = 200,
}

export const permiteInserirFormato = (arquivo: any, tiposArquivosPermitidos: string) => {
  if (tiposArquivosPermitidos?.trim()) {
    const listaPermitidos = tiposArquivosPermitidos
      .split(',')
      .map((tipo) => tipo?.trim()?.toLowerCase());

    const tamanhoNome = arquivo?.name?.length;

    const permiteTipo = listaPermitidos.find((tipo) => {
      const nomeTipoAtual = arquivo.name.substring(tamanhoNome, tamanhoNome - tipo.length);

      if (nomeTipoAtual) {
        return tipo?.toLowerCase() === nomeTipoAtual?.toLowerCase();
      }

      return false;
    });

    return !!permiteTipo;
  }
  return true;
};

const downloadBlob = (data: any, fileName: string) => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.setAttribute('style', 'display: none');

  const blob = new Blob([data]);
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);

  document.body.removeChild(a);
};

export const ContainerDraggerUpload = styled(Dragger)`
  &.ant-upload-wrapper
    .ant-upload-list
    .ant-upload-list-item
    .ant-upload-list-item-actions
    .ant-upload-list-item-action {
    opacity: 1;
  }

  .ant-upload-list-item {
    position: relative;
  }

  .visualizar-btn {
    position: absolute;
    right: 60px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.6;
  }
`;

type UploadArquivosProps = {
  form: FormInstance;
  draggerProps?: DraggerProps;
  formItemProps: FormItemProps & { name: string };
  tiposArquivosPermitidos?: string;
  tamanhoMaxUploadPorArquivo?: number;
  downloadService: (codigosArquivo: string) => any;
  uploadService: (formData: FormData, configuracaoHeader: any) => any;
  permiteMultiplosArquivos?: boolean;
};

const TAMANHO_PADRAO_MAXIMO_UPLOAD = 100;
const LIMITE_DE_ARQUIVOS_NA_NOTIFICACAO = 3;
const formatarListaDeNomes = (nomes: string[]): string => {
  if (nomes.length <= LIMITE_DE_ARQUIVOS_NA_NOTIFICACAO) {
    return nomes.join(', ');
  }

  const nomesExibidos = nomes.slice(0, LIMITE_DE_ARQUIVOS_NA_NOTIFICACAO).join(', ');
  const quantidadeOmitida = nomes.length - LIMITE_DE_ARQUIVOS_NA_NOTIFICACAO;
  
  return `${nomesExibidos}, ... e mais ${quantidadeOmitida} arquivo(s).`;
};

const UploadArquivosSME: React.FC<UploadArquivosProps> = (props) => {
  const {
    form,
    draggerProps,
    formItemProps,
    uploadService,
    downloadService,
    tiposArquivosPermitidos = '',
    tamanhoMaxUploadPorArquivo = TAMANHO_PADRAO_MAXIMO_UPLOAD,
    permiteMultiplosArquivos = false,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagemSelecionada, setImagemSelecionada] = useState<UploadFile | null>(null);
  const [imagemUrl, setImagemUrl] = useState<string>('');

  if (!formItemProps.name) {
    formItemProps.name = 'arquivos';
  }

  const listaDeArquivos = Form.useWatch(formItemProps.name, form);

  const setNovoValor = (novoMap: any) => {
    if (form && form.setFieldValue) {
      form.setFieldValue(formItemProps.name, novoMap);
    }
  };

  const excedeuLimiteMaximo = (arquivo: File) => {
    const tamanhoArquivo = arquivo.size / 1024 / 1024;

    return tamanhoArquivo > tamanhoMaxUploadPorArquivo;
  };

  const beforeUploadDefault = (arquivo: RcFile) => {
    if (!permiteInserirFormato(arquivo, tiposArquivosPermitidos)) {
      return false;
    }

    if (excedeuLimiteMaximo(arquivo)) {
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
        if (resposta?.status === HttpStatusCode.Ok || resposta?.sucesso) {
          const codigo = resposta?.data?.codigo || resposta?.dados?.codigo || resposta.data;
          const id = resposta?.data?.id || resposta?.dados?.id;
          file.id = id;
          onSuccess(file, codigo);
        } else {
          onError({});
        }
      })
      .catch((e: any) => onError({ event: e }));
  };

  const onRemoveDefault = async (arquivo: UploadFile<any>) => {
    if (arquivo.xhr) {
      notification.success({
        message: 'Sucesso',
        description: `Arquivo ${arquivo.name} excluído com sucesso`,
      });
      return true;
    }
    return false;
  };
  const [errosDeFormato, setErrosDeFormato] = useState<string[]>([]);
  const [errosDeTamanho, setErrosDeTamanho] = useState<string[]>([]);

  const onChangeDefault = ({ file, fileList }: { file: UploadFile, fileList: UploadFile[] }) => {
    const arquivosNovos = fileList.filter(f => !f.status);

    if (arquivosNovos.length === 0) {
      setNovoValor(fileList);
    } else {
      const arquivosValidosParaUpload: UploadFile[] = [];
      const arquivosJaExistentes = fileList.filter(f => f.status);

      const novosErrosDeFormato = new Set<string>();
      const novosErrosDeTamanho = new Set<string>();

      arquivosNovos.forEach((f: UploadFile) => {
        if (!permiteInserirFormato(f, tiposArquivosPermitidos)) {
          novosErrosDeFormato.add(f.name);
        } else if (excedeuLimiteMaximo(f as RcFile)) {
          novosErrosDeTamanho.add(f.name);
        } else {
          arquivosValidosParaUpload.push(f);
        }
      });

      if (novosErrosDeFormato.size > 0) {
        setErrosDeFormato(prev => [...new Set([...prev, ...novosErrosDeFormato])]);
      }
      if (novosErrosDeTamanho.size > 0) {
        setErrosDeTamanho(prev => [...new Set([...prev, ...novosErrosDeTamanho])]);
      }

      const listaFinal = [...arquivosJaExistentes, ...arquivosValidosParaUpload];
      setNovoValor(listaFinal);
    }
    const uploadEmAndamento = fileList.some((f: UploadFile) => f.status === 'uploading');
    if (file.status === 'done' && !uploadEmAndamento) { debugger;
      if (errosDeFormato.length > 0) {
        notification.error({
          message: 'Formato de arquivo não permitido',
          description: `Arquivos ignorados: ${formatarListaDeNomes(errosDeFormato)}`,
        });
        setErrosDeFormato([]);
      }
      if (errosDeTamanho.length > 0) {
        notification.error({
          message: 'Tamanho de arquivo excedido',
          description: `Arquivos ignorados: ${formatarListaDeNomes(errosDeTamanho)}`,
        });
        setErrosDeTamanho([]);
      }
      const arquivosSucesso = fileList.filter(f => f.status === 'done');
      if (arquivosSucesso.length > 0) {
        notification.success({
            message: 'Upload Concluído',
            description: `${arquivosSucesso.length} arquivo(s) foram carregados com sucesso.`,
        });
      }
    }
  };

  const onDownloadDefault = (arquivo: UploadFile<any>) => {
    const codigoArquivo = arquivo.xhr;
    downloadService(codigoArquivo)
      .then((resposta: any) => {
        downloadBlob(resposta.data, arquivo.name);
      })
      .catch(() =>
        notification.error({
          message: 'Erro',
          description: 'Erro ao tentar fazer download',
        }),
      );
  };

  const handleVisualizarImagem = async (arquivo: UploadFile<any>) => {
    setImagemSelecionada(arquivo);
    setIsModalOpen(true);

    try {
      const codigoArquivo = arquivo.xhr;
      const resposta = await downloadService(codigoArquivo);

      const isPdf = arquivo.name?.toLowerCase().endsWith('.pdf');

      const blob = new Blob([resposta.data], { type: isPdf ? 'application/pdf' : 'image/jpeg' });
      const urlImagem = URL.createObjectURL(blob);
      setImagemUrl(urlImagem);
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Erro ao carregar imagem para visualização',
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setImagemSelecionada(null);

    // Limpa a URL do blob para liberar memória
    if (imagemUrl) {
      URL.revokeObjectURL(imagemUrl);
      setImagemUrl('');
    }
  };

  const isImageFile = (fileName: string) => {
    const imageExtensions = ['.tif', '.jpg', '.jpeg', '.png', '.tiff', '.webp', '.pdf'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList || listaDeArquivos;
  };



  const customItemRender = (originNode: React.ReactElement, file: UploadFile) => {
    if (!isImageFile(file.name || '')) {
      return originNode;
    }

    return (
      <div style={{ position: 'relative' }}>
        {originNode}
        <Button
          size="small"
          icon={<FaRegEye />}
          onClick={(e) => {
            e.stopPropagation();
            handleVisualizarImagem(file);
          }}
          title="Visualizar imagem"
          className="visualizar-btn"
          type="text"
        />
      </div>
    );
  };

  return (
    <>
      <Form.Item valuePropName='fileList' getValueFromEvent={normFile} {...formItemProps}>
        <ContainerDraggerUpload
          name='file'
          listType='text'
          fileList={listaDeArquivos}
          multiple={permiteMultiplosArquivos}
          showUploadList={{ showDownloadIcon: true }}
          itemRender={customItemRender}
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
          <p className='ant-upload-text'>{permiteMultiplosArquivos
            ? `Clique ou arraste para fazer o upload dos arquivos`
            : `Clique ou arraste para fazer o upload do arquivo`}</p>
        <p className='ant-upload-hint'>{`Deve permitir apenas arquivos com no máximo ${tamanhoMaxUploadPorArquivo}MB cada`}</p>
        </ContainerDraggerUpload>
      </Form.Item>

      {/* Modal para visualizar imagem */}
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        title="Visualizar Imagem"
        width={800}
        centered
      >
        {imagemSelecionada && (
          <div style={{ textAlign: 'center' }}>
            {imagemUrl ? (
              imagemSelecionada.name?.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={imagemUrl}
                  style={{ width: '100%', height: '70vh', border: 'none' }}
                  title={imagemSelecionada.name}
                />
              ) : (
                <img
                  src={imagemUrl}
                  alt={imagemSelecionada.name || 'Imagem'}
                  style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                />
              )
            ) : (
              <div style={{ padding: '40px', textAlign: 'center' }}>Carregando arquivo...</div>
            )}
            <p style={{ marginTop: 16, color: '#666' }}>{imagemSelecionada.name}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default UploadArquivosSME;
