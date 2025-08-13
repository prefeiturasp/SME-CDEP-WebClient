import React, { useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { FaPrint } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import { ROUTES } from '~/core/enum/routes';
import { CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { InputRfCpfSolicitante } from '../../operacoes/atendimento-solicitacoes/list/components/rf-cpf-solicitante';
import relatorioService from '~/core/services/relatorios-service';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { SelectSituacaoEmprestimoFiltrado } from '~/components/cdep/input/situacao-emprestimo-sem-devolvido';

const { Option } = Select;

const tiposRelatorio = [
  { label: 'Analítico', value: 2 },
  { label: 'Sintético', value: 1 },
];

const apresentarDevolvidos = [
  { label: 'Sim', value: true },
  { label: 'Não', value: false },
];

export type FiltroSolicitacaoProps = {
  solicitanteRf: string | null;
  situacaoEmprestimo: string | null;
};

const RelatorioLivrosEmprestados = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingRelatorio, setLoadingRelatorio] = useState(false);
  const [relatorioBlob, setRelatorioBlob] = useState<Blob | null>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [erroModal, setErroModal] = useState<string | null>(null);

  const tipoRelatorio = Form.useWatch('modelo', form);

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    if (values.modelo === 2) {
      setCanSubmit(!!values.modelo);
    } else if (values.modelo === 1) {
      setCanSubmit(!!values.modelo);
    } else {
      setCanSubmit(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      setModalVisible(true);
      setLoadingRelatorio(true);
      setErroModal(null);

      const payload = {
        solicitante: filters?.solicitanteRf || '',
        tombo: values.tombo || '',
        situacaoEmprestimo: filters?.situacaoEmprestimo || '',
        modelo: values.modelo,
        somenteDevolvidos: values.somenteDevolvidos,
      };
      const response = await relatorioService.gerarRelatorioControleLivrosEmprestados(payload);

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
      link.download = 'relatorio_livros_emprestados.xls';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      fecharModal();
    }
  };

  const navigate = useNavigate();
  const [filters, setFilters] = useState<FiltroSolicitacaoProps>();
  const obterFiltros = () => {
    setFilters({
      solicitanteRf: form?.getFieldValue('solicitanteRf'),
      situacaoEmprestimo: form?.getFieldValue('situacaoEmprestimo'),
    });
  };
  return (
    <Col>
      <HeaderPage title='Controle de livros emprestados'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar onClick={() => navigate(ROUTES.PRINCIPAL)} id={CDEP_BUTTON_VOLTAR} />
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
        <Form
          form={form}
          layout='vertical'
          onFinish={onFinish}
          onValuesChange={handleFormChange}
          initialValues={{ somenteDevolvidos: false }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name='modelo'
                label='Tipo de relatório'
                rules={[{ required: true, message: 'Campo obrigatório' }]}
              >
                <Select placeholder='Selecione o tipo de relatório'>
                  {tiposRelatorio.map((op) => (
                    <Option value={op.value} key={op.value}>
                      {op.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {tipoRelatorio === 2 && (
              <>
                <Col xs={24} md={8}>
                  <InputRfCpfSolicitante obterFiltros={obterFiltros} />
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label='Nome do solicitante' name='nomeSolicitante'>
                    <Input type='text' disabled />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name='tombo' label='Tombo (opcional)'>
                <Input placeholder='Informe o tombo' />
              </Form.Item>
            </Col>

            {tipoRelatorio === 2 && (
              <>
                <Col xs={24} md={8}>
                  <SelectSituacaoEmprestimoFiltrado
                    selectProps={{
                      onChange: obterFiltros,
                      mode: 'multiple',
                    }}
                  />
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='somenteDevolvidos'
                    label='Apresentar empréstimos devolvidos?'
                    rules={[{ required: true, message: 'Campo obrigatório' }]}
                  >
                    <Select placeholder='Selecione uma opção'>
                      {apresentarDevolvidos.map((op) => (
                        <Option value={op.value} key={String(op.value)}>
                          {op.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </>
            )}
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

export default RelatorioLivrosEmprestados;
