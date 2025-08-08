import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row, Select, Spin } from 'antd';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { FaPrint } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import { ROUTES } from '~/core/enum/routes';
import { CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { CDEP_SELECT_TIPO_ACERVO } from '~/core/constants/ids/select';
import { obterTiposAcervo } from '~/core/services/acervo-service';
import { DefaultOptionType } from 'antd/es/select';

const { Option } = Select;

const situacao = [
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inativo', value: 'inativo' },
];

const RelatorioTomboCodigo = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingRelatorio, setLoadingRelatorio] = useState(false);
  const [relatorioUrl, setRelatorioUrl] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    if (values.tipoAcervo && values.situacao) {
      setCanSubmit(true);
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

  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterTipos = async () => {
    const resposta = await obterTiposAcervo();

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.nome, value: item.id }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterTipos();
  }, []);

  return (
    <Col>
      <HeaderPage title='Controle do tombo/código'>
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
                label='Tipo de acervo'
                name='tipoAcervo'
                rules={[{ required: true, message: 'Campo obrigatório' }]}
              >
                <Select
                  showSearch
                  allowClear
                  id={CDEP_SELECT_TIPO_ACERVO}
                  options={options}
                  placeholder='Tipo de acervo'
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='situacao'
                label='Situação do tombo'
                rules={[{ required: true, message: 'Campo obrigatório' }]}
              >
                <Select placeholder='Selecione a situação' mode='multiple'>
                  {situacao.map((op) => (
                    <Option value={op.value} key={op.value}>
                      {op.label}
                    </Option>
                  ))}
                </Select>
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

export default RelatorioTomboCodigo;
