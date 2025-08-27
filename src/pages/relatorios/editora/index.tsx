import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row, Select, Spin } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import relatoriosService from '~/core/services/relatorios-service';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '~/core/enum/routes';
import { obterEditoraResumido } from '~/core/services/editora-service';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/cdep/button/voltar';
import { CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { FaPrint } from 'react-icons/fa';
import CardContent from '~/components/lib/card-content';
import { CDEP_SELECT_EDITORA } from '~/core/constants/ids/select';
import { CheckCircleOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';

const RelatorioEditora = () => {
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingRelatorio, setLoadingRelatorio] = useState(false);
    const [relatorioBlob, setRelatorioBlob] = useState<Blob | null>(null);
    const [erroModal, setErroModal] = useState<string | null>(null);
    const [options, setOptions] = useState<DefaultOptionType[]>([]);
    const [loadingEditoras, setLoadingEditoras] = useState(false);
  
    const onFinish = async (values: any) => {
        try {
            setModalVisible(true);
            setLoadingRelatorio(true);
            setErroModal(null);

            const payload = {
            editoraId: values.editoraId
            };

            const response = await relatoriosService.gerarRelatorioControleEditora(payload);

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
        } catch (error: any) {
            if (error?.response?.status === 404) {
            setErroModal(
                'Seu relatório não retornou nenhum dado. Por favor, tente novamente mais tarde.',
            );
            } else {
            setErroModal('Ocorreu um erro ao gerar o relatório. Por favor, tente novamente mais tarde.');
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
        link.download = 'relatorio_controle_editora.xls';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        fecharModal();
      }
    };
  
    const navigate = useNavigate();
    const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

    const obterEditoras = async () => {
      try {
        setLoadingEditoras(true);
        const resposta = await obterEditoraResumido();
        const editorasOrdenadas = resposta.dados.sort((a, b) => a.nome.localeCompare(b.nome));

        if (resposta.sucesso) {
            const newOptions = editorasOrdenadas.map((item) => ({ label: item.nome, value: item.id }));
            setOptions(newOptions);
        } else {
            setOptions([]);
        }
      } catch (error) {
        console.error('Erro ao obter editoras:', error);
      } finally {
        setLoadingEditoras(false);
      }
    };

    useEffect(() => {
      obterEditoras();
    }, []);

  return (
    <Col>
      <HeaderPage title='Controle por editora'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar onClick={onClickVoltar} id={CDEP_BUTTON_VOLTAR} />
            </Col>
            <Col>
              <Button
                type='primary'
                onClick={() => form.submit()}
                disabled={loadingRelatorio}
                loading={loadingRelatorio}
              >
                <FaPrint /> Gerar relatório
              </Button>
            </Col>
          </Row>
        </Col>
      </HeaderPage>

      <CardContent>
        <Form form={form} layout='vertical' onFinish={onFinish}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                name='editoraId'
                label='Editora'
                extra='Você pode selecionar mais de uma editora.'
                rules={[{ required: false }]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder='Exemplo: Willian Shakespeare'
                  options={options}
                  loading={loadingEditoras}
                  id={CDEP_SELECT_EDITORA}
                  suffixIcon={<SearchOutlined />}
                  mode='multiple'
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

export default RelatorioEditora;
