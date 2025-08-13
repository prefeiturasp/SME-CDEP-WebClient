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
import relatorioService from '~/core/services/relatorios-service';
import { DefaultOptionType } from 'antd/es/select';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import SelectCreditoAutoria from '~/components/cdep/input/credito-autoria';

const RelatorioAutorCredito = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingRelatorio, setLoadingRelatorio] = useState(false);
  const [relatorioBlob, setRelatorioBlob] = useState<Blob | null>(null);
  const [erroModal, setErroModal] = useState<string | null>(null);
  const [canSubmit, setCanSubmit] = useState(true);
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const handleFormChange = () => {
    setCanSubmit(true);
  };

  const onFinish = async (values: any) => {
    try {
      setModalVisible(true);
      setLoadingRelatorio(true);
      setErroModal(null);
      const payload = {
        autores: Array.isArray(values.creditoAutorId)
          ? values.creditoAutorId.map((item: any) =>
              typeof item === 'object' ? Number(item.value) : Number(item),
            )
          : [],
        tipoAcervo: values.tipoAcervo,
      };
      const response = await relatorioService.gerarRelatorioControleAcervoPorAutor(payload);

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

      const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
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
      link.download = 'relatorio_autor_credito.xls';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      fecharModal();
    }
  };

  const navigate = useNavigate();
  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

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
      <HeaderPage title='Controle por autor/crédito'>
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
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <SelectCreditoAutoria selectProps={{ mode: 'multiple' }} />
            </Col>

            <Col span={8}>
              <Form.Item label='Tipo de acervo' name='tipoAcervo'>
                <Select
                  showSearch
                  allowClear
                  id={CDEP_SELECT_TIPO_ACERVO}
                  options={options}
                  placeholder='Tipo de acervo'
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

export default RelatorioAutorCredito;
