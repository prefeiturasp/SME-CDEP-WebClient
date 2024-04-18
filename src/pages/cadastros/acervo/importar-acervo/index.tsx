import { Col, Empty, Form, Progress, ProgressProps, Row, Tabs, Typography, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useCallback, useEffect, useState } from 'react';
import { FaDownload, FaUpload } from 'react-icons/fa';
import { LuRefreshCw } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import SelectTipoAcervo from '~/components/cdep/input/tipo-acervo';
import ButtonSecundary from '~/components/lib/button/secundary';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import {
  CDEP_BUTTON_AATUALIZAR_DADOS,
  CDEP_BUTTON_BAIXAR_MODELO,
  CDEP_BUTTON_IMPORTAR_ARQUIVO,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import {
  ACERVO_EXCLUIR_LINHA,
  DESEJA_DESCARTAR_DADOS_PLANILHA_ATUAL_E_CARREGAR_SELECIONADA,
} from '~/core/constants/mensagens';
import { ImportacaoArquivoRetornoDTO } from '~/core/dto/importacao-arquivo-retorno-dto';
import { ImportacaoStatusEnum } from '~/core/enum/importacao-status-enum';
import { ROUTES } from '~/core/enum/routes';
import { TipoAcervo, TipoAcervoDisplay, TipoAcervoPlanilhaModelo } from '~/core/enum/tipo-acervo';
import acervoArteGraficaImportacaoService from '~/core/services/acervo-arte-grafica-importacao-service';
import acervoAudiovisualImportacaoService from '~/core/services/acervo-audiovisual-importacao-service';
import acervoBibliograficoImportacaoService from '~/core/services/acervo-bibliografico-importacao-service';
import acervoDocumentalImportacaoService from '~/core/services/acervo-documental-importacao-service';
import acervoFotograficoImportacaoService from '~/core/services/acervo-fotografico-importacao-service';
import acervoTridimensionalImportacaoService from '~/core/services/acervo-tridimensional-importacao-service';
import { confirmacao } from '~/core/services/alerta-service';
import armazenamentoService from '~/core/services/armazenamento-service';
import { Colors } from '~/core/styles/colors';
import { downloadBlob } from '~/core/utils/functions';
import TableImportacao from './table-importacao';
import TableImportacaoErro from './table-importacao-erro';
import TableImportacaoSucesso from './table-importacao-sucesso';

const ImportarAcervo: React.FC = () => {
  const navigate = useNavigate();
  const [form] = useForm();

  const [dataSourceArquivoImportacao, setDataSourceArquivoImportacao] = useState<
    ImportacaoArquivoRetornoDTO[]
  >([]);

  const tipoAcervo: TipoAcervo = Form.useWatch('tipoAcervo', form);

  const idImportacao = dataSourceArquivoImportacao?.[0]?.id || 0;
  const statusImportacao = dataSourceArquivoImportacao?.[0]?.status || 0;

  const servicePorTipoAcervo = useCallback(() => {
    switch (tipoAcervo) {
      case TipoAcervo.Bibliografico:
        return acervoBibliograficoImportacaoService;
      case TipoAcervo.DocumentacaoHistorica:
        return acervoDocumentalImportacaoService;
      case TipoAcervo.ArtesGraficas:
        return acervoArteGraficaImportacaoService;
      case TipoAcervo.Audiovisual:
        return acervoAudiovisualImportacaoService;
      case TipoAcervo.Fotografico:
        return acervoFotograficoImportacaoService;
      case TipoAcervo.Tridimensional:
        return acervoTridimensionalImportacaoService;

      default:
        return null;
    }
  }, [tipoAcervo]);

  const obterDados = useCallback(async () => {
    const service = servicePorTipoAcervo();

    if (!service) return;

    const resposta = await service.obterImportacaoPendente();

    if (resposta.sucesso && resposta.dados.dataImportacao) {
      setDataSourceArquivoImportacao([resposta.dados]);
    } else {
      setDataSourceArquivoImportacao([]);
    }
  }, [servicePorTipoAcervo]);

  const atualizarLinhaParaSucesso = async (numeroLinha: number) => {
    const service = servicePorTipoAcervo();

    if (!service) return;

    const resposta = await service.atualizarLinhaParaSucesso(idImportacao, numeroLinha);

    if (resposta.sucesso) {
      obterDados();
    }
  };

  const removerLinhaDoArquivo = async (numeroLinha: number) => {
    const service = servicePorTipoAcervo();

    if (!service) return;

    confirmacao({
      content: ACERVO_EXCLUIR_LINHA,
      onOk() {
        service.removerLinhaDoArquivo(idImportacao, numeroLinha).then((resposta) => {
          if (resposta.sucesso) {
            obterDados();
          }
        });
      },
    });
  };

  const customRequest = useCallback(
    async (options: any) => {
      const { onSuccess, file } = options;

      let continuar = true;

      if (statusImportacao && statusImportacao !== ImportacaoStatusEnum.Sucesso) {
        continuar = await new Promise((resolve) => {
          confirmacao({
            content: DESEJA_DESCARTAR_DADOS_PLANILHA_ATUAL_E_CARREGAR_SELECIONADA,
            onOk() {
              resolve(true);
            },
            onCancel() {
              resolve(false);
            },
          });
        });
      }

      if (!continuar) return;

      const service = servicePorTipoAcervo();

      if (!service) return;

      const resposta = await service.importarArquivo(file);

      if (resposta.sucesso) {
        setDataSourceArquivoImportacao([{ ...resposta.dados }]);
        onSuccess();
      } else {
        setDataSourceArquivoImportacao([]);
      }
    },
    [servicePorTipoAcervo, statusImportacao],
  );

  const onClickVoltar = () => navigate(ROUTES.ACERVO);

  const onClickBaixarModelo = () => {
    armazenamentoService.downloadPorTipoAcervo(tipoAcervo).then((resposta) => {
      if (resposta.sucesso) {
        downloadBlob(resposta.dados, TipoAcervoPlanilhaModelo[tipoAcervo]);
      }
    });
  };

  const atualizarDados = () => obterDados();

  useEffect(() => {
    if (tipoAcervo) {
      obterDados();
    } else {
      setDataSourceArquivoImportacao([]);
    }
  }, [tipoAcervo, obterDados]);

  const carregarTabelasImportacao = () => {
    if (tipoAcervo) {
      if (dataSourceArquivoImportacao?.length) {
        let percentProgress;
        let statusProgress: ProgressProps['status'] = undefined;

        switch (statusImportacao) {
          case 1:
            percentProgress = 50;
            statusProgress = 'active';
            break;

          case 2:
            percentProgress = 100;
            statusProgress = 'exception';
            break;

          default:
            percentProgress = 100;
            statusProgress = 'success';
            break;
        }
        return (
          <Row gutter={[16, 24]}>
            <Col span={24}>
              <TableImportacao dataSource={dataSourceArquivoImportacao} />
            </Col>

            {statusImportacao !== 1 ? (
              <Col span={24}>
                <Tabs
                  type='card'
                  defaultActiveKey='1'
                  items={[
                    {
                      key: '1',
                      label: <div style={{ color: Colors.Suporte.Primary.ERROR }}>Erro</div>,
                      children: (
                        <TableImportacaoErro
                          obterDados={obterDados}
                          dataSource={dataSourceArquivoImportacao}
                          atualizarLinhaParaSucesso={atualizarLinhaParaSucesso}
                          removerLinhaDoArquivo={removerLinhaDoArquivo}
                        />
                      ),
                    },
                    {
                      key: '2',
                      label: <div style={{ color: Colors.Suporte.Primary.SUCCESS }}>Sucesso</div>,
                      children: <TableImportacaoSucesso dataSource={dataSourceArquivoImportacao} />,
                    },
                  ]}
                />
              </Col>
            ) : (
              <Col span={24}>
                <Progress status={statusProgress} percent={percentProgress} />
                <Typography>
                  Aguarde enquanto processamos seu arquivo. Clique em &apos;Atualizar Dados&apos;
                  para obter o status mais recente.
                </Typography>
              </Col>
            )}
          </Row>
        );
      }

      return (
        <Empty
          description={`Sem importação pendente para o acervo ${TipoAcervoDisplay[tipoAcervo]}`}
          style={{ color: Colors.Neutral.DARK }}
        />
      );
    }

    return <></>;
  };

  return (
    <Col>
      <HeaderPage title='Importar Acervo'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar onClick={() => onClickVoltar()} id={CDEP_BUTTON_VOLTAR} />
            </Col>
          </Row>
        </Col>
      </HeaderPage>
      <CardContent>
        <Form form={form} layout='vertical' autoComplete='off'>
          <Form.Item shouldUpdate>
            {() => (
              <>
                <Row gutter={[16, 8]} align='middle'>
                  <Col xs={24} sm={12} md={8}>
                    <SelectTipoAcervo />
                  </Col>

                  <Col>
                    <ButtonSecundary
                      disabled={!tipoAcervo}
                      id={CDEP_BUTTON_BAIXAR_MODELO}
                      icon={<FaDownload size={16} />}
                      onClick={() => onClickBaixarModelo()}
                    >
                      Baixar Modelo
                    </ButtonSecundary>
                  </Col>
                  <Col>
                    <Upload name='file' customRequest={customRequest} fileList={[]}>
                      <ButtonSecundary
                        disabled={!tipoAcervo}
                        icon={<FaUpload size={16} />}
                        id={CDEP_BUTTON_IMPORTAR_ARQUIVO}
                      >
                        Importar Arquivo
                      </ButtonSecundary>
                    </Upload>
                  </Col>
                  <Col>
                    <ButtonSecundary
                      disabled={!tipoAcervo}
                      icon={<LuRefreshCw size={16} />}
                      id={CDEP_BUTTON_AATUALIZAR_DADOS}
                      onClick={atualizarDados}
                    >
                      Atualizar Dados
                    </ButtonSecundary>
                  </Col>
                </Row>
              </>
            )}
          </Form.Item>
        </Form>
        {carregarTabelasImportacao()}
      </CardContent>
    </Col>
  );
};

export default ImportarAcervo;
