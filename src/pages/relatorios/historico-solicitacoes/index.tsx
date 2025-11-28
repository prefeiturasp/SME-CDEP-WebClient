import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Select, Spin } from 'antd';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { FaPrint } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import { ROUTES } from '~/core/enum/routes';
import { CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { CDEP_SELECT_SOLICITACAO_SITUACOES } from '~/core/constants/ids/select';
import relatorioService from '~/core/services/relatorios-service';
import { DefaultOptionType } from 'antd/es/select';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { InputRfCpfSolicitante } from '~/pages/operacoes/atendimento-solicitacoes/list/components/rf-cpf-solicitante';
import { RangePicker } from '~/components/cdep/range-picker';
import dayjs from 'dayjs';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { SituacaoItemDTO } from '~/core/dto/situacao-item-dto';

const RelatorioHistoricoSolicitacoes = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingRelatorio, setLoadingRelatorio] = useState(false);
  const [relatorioBlob, setRelatorioBlob] = useState<Blob | null>(null);
  const [erroModal, setErroModal] = useState<string | null>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const handleFormChange = () => {
    const values = form.getFieldsValue();

    if (values.periodo?.[0] && values.periodo?.[1]) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      const dataInicio = values.periodo?.[0] ? dayjs(values.periodo[0]).startOf('day') : null;
      const dataFim = values.periodo?.[1] ? dayjs(values.periodo[1]).endOf('day') : null;

      const payload: any = {};

      if (dataInicio) payload.dataInicio = dataInicio.toISOString();
      if (dataFim) payload.dataFim = dataFim.toISOString();
      if (values.solicitanteRf) payload.solicitante = values.solicitanteRf;
      if (values.situacaoItem) payload.situacaoSolicitacao = [Number(values.situacaoItem)];
      // if (values.tipoAcervo) payload.tipoAcervo = [Number(values.tipoAcervo)];

      if (dataFim) {
        if (dataFim.isAfter(dayjs(), 'day')) {
          message.warning('A data final não pode ser maior que hoje.');
          return;
        }
      }

      if (dataInicio) {
        if (dataInicio.isAfter(dayjs(), 'day')) {
          message.warning('A data inicial não pode ser maior que hoje.');
          return;
        }
      }

      if (dataInicio && dataFim) {
        const diffYears = dataFim.diff(dataInicio, 'year', true);
        if (diffYears > 1) {
          message.warning('O intervalo entre as datas deve ser menor que um ano.');
          return;
        }

        if (dataFim.isBefore(dataInicio, 'day')) {
          message.warning('A data final não pode ser anterior à data inicial.');
          return;
        }
      }

      setModalVisible(true);
      setLoadingRelatorio(true);
      setErroModal(null);

      const response = await relatorioService.gerarRelatorioHistoricoSolicitacoes(payload);

      if (response.status === 404) {
        setErroModal(
          'Seu relatório não retornou nenhum dado. Por favor, tente novamente mais tarde.',
        );
        return;
      }
      if (!response.data || response.data.size === 0) {
        setErroModal('Nenhum dado encontrado para os filtros selecionados.');
        return;
      }

      const blob = new Blob([response.data], {
        type: 'application/vnd.ms-excel',
      });

      setRelatorioBlob(blob);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setErroModal(
          'Seu relatório não retornou nenhum dado. Por favor, tente novamente mais tarde ou mude os filtros escolhidos.',
        );
      } else {
        setErroModal(
          'Parece que houve um problema ao solicitar o relatório. Por favor, tente novamente mais tarde.',
        );
      }
      setRelatorioBlob(null);
    } finally {
      setLoadingRelatorio(false);
    }
  };

  const fecharModal = () => {
    setModalVisible(false);
    setRelatorioBlob(null);
    setErroModal(null);
  };

  const baixarRelatorio = () => {
    if (relatorioBlob) {
      const url = window.URL.createObjectURL(relatorioBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'relatorio_historico_solicitacoes.xls';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      fecharModal();
    }
  };

  const navigate = useNavigate();
  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  const obterDados = async () => {
    const resposta = await acervoSolicitacaoService.obterSituacoesAtendimento();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item: SituacaoItemDTO) => ({
        label: item.nome,
        value: item.id,
      }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Col>
      <HeaderPage title='Relatório de Histórico de Solicitações'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar onClick={onClickVoltar} id={CDEP_BUTTON_VOLTAR} />
            </Col>
            <Col>
              <Button
                type='primary'
                onClick={() => form.submit()}
                disabled={!canSubmit || loadingRelatorio}
                loading={loadingRelatorio}
              >
                <FaPrint /> Gerar relatório
              </Button>
            </Col>
          </Row>
        </Col>
      </HeaderPage>

      <CardContent>
        <Form form={form} layout='vertical' onFinish={onFinish} onValuesChange={handleFormChange}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <InputRfCpfSolicitante />
            </Col>

            <Col span={12}>
              <Form.Item label='Nome do solicitante' name='nomeSolicitante'>
                <Input type='text' placeholder='Nome do solicitante' disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              {/* <Form.Item label='Tipo de acervo' name='tipoAcervo'>
                <Select
                  showSearch
                  allowClear
                  id={CDEP_SELECT_TIPO_ACERVO}
                  options={options}
                  placeholder='Tipo de acervo'
                />
              </Form.Item> */}
              <Form.Item label='Situação do item' name='situacaoItem'>
                <Select
                  showSearch
                  allowClear
                  id={CDEP_SELECT_SOLICITACAO_SITUACOES}
                  options={options}
                  placeholder='Situação do atendimento'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item>
                <RangePicker
                  formItemProps={{
                    label: 'Período',
                    name: 'periodo',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </CardContent>

      <Modal
        open={modalVisible}
        closable={!loadingRelatorio}
        footer={null}
        onCancel={fecharModal}
        width={400}
        centered
        maskClosable={false}
      >
        {loadingRelatorio && !erroModal ? (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <Spin size='large' />
            <div style={{ marginTop: 16, fontWeight: 700 }}>Aguarde um momento!</div>
            <div>Estamos gerando o seu relatório...</div>
          </div>
        ) : erroModal ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <span style={{ fontSize: 32 }}>
              <CloseCircleOutlined style={{ color: 'red' }} />
            </span>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Desculpe!</div>
            <div style={{ marginBottom: 24 }}>{erroModal}</div>
            <Button onClick={fecharModal} block>
              Voltar
            </Button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 16 }}>
            <span style={{ fontSize: 32 }}>
              <CheckCircleOutlined style={{ color: 'green' }} />
            </span>
            <div style={{ marginBottom: 8, fontWeight: 700 }}>Relatório gerado com sucesso!</div>
            <div style={{ marginBottom: 16 }}>
              Clique no botão "Baixar Relatório" para obter o seu arquivo.
            </div>
            <Button type='primary' block onClick={baixarRelatorio} disabled={!relatorioBlob}>
              Baixar relatório
            </Button>
          </div>
        )}
      </Modal>
    </Col>
  );
};

export default RelatorioHistoricoSolicitacoes;
