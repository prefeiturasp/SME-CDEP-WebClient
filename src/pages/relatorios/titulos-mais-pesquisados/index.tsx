import React, { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Form, message, Modal, Row, Select, Spin } from 'antd';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/cdep/button/voltar';
import { CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes';
import { useNavigate } from 'react-router';
import { FaPrint } from 'react-icons/fa';
import CardContent from '~/components/lib/card-content';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import relatoriosService from '~/core/services/relatorios-service';
import { DefaultOptionType } from 'antd/es/select';
import { obterTiposAcervo } from '~/core/services/acervo-service';
import { CDEP_SELECT_TIPO_ACERVO } from '~/core/constants/ids/select';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';

const TitulosMaisPesquisados = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingRelatorio, setLoadingRelatorio] = useState(false);
  const [relatorioBlob, setRelatorioBlob] = useState<Blob | null>(null);
  const [erroModal, setErroModal] = useState<string | null>(null);
  const [canSubmit, setCanSubmit] = useState(false);

  const formatoData = 'DD/MM/YYYY';
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  useEffect(() => {
    obterTipos();
  }, []);

  const obterTipos = async () => {
    const resposta = await obterTiposAcervo();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.nome, value: item.id }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  const handleFormChange = () => {
    const values = form.getFieldsValue();

    if (values.tipoAcervo && values.dataInicio && values.dataFim) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  };

  const navigate = useNavigate();
  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  const fecharModal = () => {
    setModalVisible(false);
    setRelatorioBlob(null);
    setErroModal(null);
  };

  const baixarRelatorio = () => {
    if (relatorioBlob) {
      const url = URL.createObjectURL(relatorioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'titulos_mais_pesquisados.xls';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const onFinish = async (values: any) => {
    try {

      if (values.dataInicio && values.dataFim) {
        const diffYears = values.dataFim.diff(values.dataInicio, 'year', true);
        if (diffYears > 1) {
          message.warning('O intervalo entre as datas não pode ultrapassar 1 ano.');
          return;
        }
        if (values.dataFim.isBefore(values.dataInicio)) {
          values.dataFim;
          message.warning('A data final não pode ser anterior à data inicial.');
          return;
        }
      }

      setModalVisible(true);
      setLoadingRelatorio(true);
      setErroModal(null);

      const payload = {
        dataInicio: values.dataInicio ? values.dataInicio.toDate().toISOString() : null,
        dataFim: values.dataFim ? values.dataFim.toDate().toISOString() : null,
        tipoAcervos: [values.tipoAcervo],
      };

      const response = await relatoriosService.gerarRelatorioTitulosMaisPesquisados(payload);

      if (response.status === 404) {
        setErroModal(
          'Seu relatório não retornou nenhum dado. Por favor, tente novamente mais tarde.',
        );
        return;
      } else if (response.status === 204) {
        setErroModal('Não existem dados para a sua consulta');
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

  return (
    <Col>
      <HeaderPage title='Títulos mais pesquisados'>
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
            somenteEmAtraso: false,
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={13}>
              <Form.Item label='Período'>
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Form.Item name='dataInicio' noStyle>
                      <DatePicker
                        placeholder='Data inicial'
                        format={formatoData}
                        locale={localeDatePicker}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name='dataFim' noStyle>
                      <DatePicker
                        placeholder='Data final'
                        format={formatoData}
                        locale={localeDatePicker}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
              <span style={{ fontSize: 12, color: '#595959' }}>
                O intervalo entre as datas não pode ultrapassar 1 ano.
              </span>
            </Col>

            <Col span={11}>
              <Form.Item label='Tipo de acervo' name='tipoAcervo'>
                <Select
                  showSearch
                  allowClear
                  id={CDEP_SELECT_TIPO_ACERVO}
                  options={options}
                  placeholder='Tipo de acervo'
                  style={{ width: '100%' }}
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

export default TitulosMaisPesquisados;
