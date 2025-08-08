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

const { Option } = Select;

const tiposRelatorio = [
  { label: 'Analítico', value: 'analitico' },
  { label: 'Sintético', value: 'sintetico' },
];
const apresentarDevolvidos = [
  { label: 'Sim', value: 'sim' },
  { label: 'Não', value: 'nao' },
];
const situacaoEmprestimo = [
  { label: 'Emprestado', value: 'emprestado' },
  { label: 'Prorrogado', value: 'prorrogado' },
];

export type FiltroSolicitacaoProps = {
  solicitanteRf: string | null;
};

const RelatorioLivrosEmprestados = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingRelatorio, setLoadingRelatorio] = useState(false);
  const [relatorioUrl, setRelatorioUrl] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);

  const tipoRelatorio = Form.useWatch('tipoRelatorio', form);

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    if (values.tipoRelatorio === 'analitico') {
      setCanSubmit(
        !!values.tipoRelatorio &&
          !!values.situacao &&
          values.situacao.length > 0 &&
          !!values.devolvidos,
      );
    } else if (values.tipoRelatorio === 'sintetico') {
      setCanSubmit(!!values.tipoRelatorio);
    } else {
      setCanSubmit(false);
    }
  };

  const onFinish = async () => {
    setModalVisible(true);
    setLoadingRelatorio(true);
    setTimeout(() => {
      setLoadingRelatorio(false);
      setRelatorioUrl('/path/to/relatorio.pdf');
    }, 1500);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setLoadingRelatorio(false);
    setRelatorioUrl('');
  };

  const navigate = useNavigate();
  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  const [filters, setFilters] = useState<FiltroSolicitacaoProps>();
  const obterFiltros = () => {
    setFilters({
      solicitanteRf: form?.getFieldValue('solicitanteRf'),
    });
  };

  return (
    <Col>
      <HeaderPage title='Controle de livros emprestados'>
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
        <Form
          form={form}
          layout='vertical'
          onFinish={onFinish}
          onValuesChange={handleFormChange}
          initialValues={{
            devolvidos: 'nao',
          }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name='tipoRelatorio'
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

            {tipoRelatorio === 'analitico' && (
              <>
                <Col xs={24} md={8}>
                  <InputRfCpfSolicitante obterFiltros={obterFiltros} />
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item label='Nome do solicitante' name='nomeSolicitante'>
                    <Input type='text' placeholder='Nome do solicitante' disabled />
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

            {tipoRelatorio === 'analitico' && (
              <>
                <Col span={8}>
                  <Form.Item
                    name='situacao'
                    label='Situação do empréstimo'
                    rules={[
                      ({ getFieldValue }) => ({
                        required: getFieldValue('tipoRelatorio') === 'analitico',
                        type: 'array',
                        min: 1,
                        message: 'Selecione ao menos uma situação!',
                      }),
                    ]}
                  >
                    <Select placeholder='Selecione a situação' mode='multiple'>
                      {situacaoEmprestimo.map((op) => (
                        <Option value={op.value} key={op.value}>
                          {op.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='devolvidos'
                    label='Apresentar empréstimos devolvidos?'
                    rules={[
                      ({ getFieldValue }) => ({
                        required: getFieldValue('tipoRelatorio') === 'analitico',
                        message: 'Campo obrigatório',
                      }),
                    ]}
                  >
                    <Select placeholder='Selecione uma opção'>
                      {apresentarDevolvidos.map((op) => (
                        <Option value={op.value} key={op.value}>
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
        {loadingRelatorio ? (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <Spin size='large' />
            <div style={{ marginTop: 16, fontWeight: 700 }}>Aguarde um momento!</div>
            <div>Estamos gerando o seu relatório...</div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 16 }}>
            <div
              style={{
                display: 'inline-block',
                color: '#3bb346',
                border: '2px solid #3bb346',
                borderRadius: '50%',
                padding: 6,
                marginBottom: 16,
              }}
            >
              <span className='anticon anticon-check' style={{ fontSize: 32, lineHeight: '32px' }}>
                ✔
              </span>
            </div>
            <div style={{ marginBottom: 8, fontWeight: 700 }}>
              Solicitação de relatório gerada com sucesso!
            </div>
            <div style={{ marginBottom: 16 }}>
              Clique no botão "Baixar Relatório" para obter o seu arquivo.
            </div>
            <Button
              type='primary'
              block
              onClick={() => {
                window.open(relatorioUrl, '_blank');
                fecharModal();
              }}
              style={{ marginBottom: 4 }}
            >
              Baixar relatório
            </Button>
          </div>
        )}
      </Modal>
    </Col>
  );
};

export default RelatorioLivrosEmprestados;
