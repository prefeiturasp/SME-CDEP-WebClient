import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/cdep/button/voltar';
import { CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes';
import { useNavigate } from 'react-router';
import { FaPrint } from 'react-icons/fa';
import CardContent from '~/components/lib/card-content';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { InputRfCpfSolicitante } from '~/pages/operacoes/atendimento-solicitacoes/list/components/rf-cpf-solicitante';
import relatoriosService from '~/core/services/relatorios-service';

const { Option } = Select;
const apresentarSomenteDevolucaoEmAtraso = [
  { label: 'Sim', value: true },
  { label: 'Não', value: false },
];

const RelatorioDevolucaoLivros = () => {
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingRelatorio, setLoadingRelatorio] = useState(false);
    const [relatorioBlob, setRelatorioBlob] = useState<Blob | null>(null);
    const [erroModal, setErroModal] = useState<string | null>(null);
    const [canSubmit, setCanSubmit] = useState(true);

    const handleFormChange = () => {
        setCanSubmit(true);
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
            a.download = 'relatorio_devolucao_livros.xls';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    const onFinish = async (values: any) => {
        try {
            setModalVisible(true);
            setLoadingRelatorio(true);
            setErroModal(null);

            const payload = {
                solicitante: values.solicitanteRf,
                somenteEmAtraso: values.somenteEmAtraso,
            };

            const response = await relatoriosService.gerarRelatorioControleDevolucaoLivros(payload);

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

    return (
        <Col>
            <HeaderPage title="Controle de Devoluções de Livros">
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
                        <Col span={8}>
                            <InputRfCpfSolicitante/>
                        </Col>

                        <Col span={8}>
                            <Form.Item label='Nome do solicitante' name='nomeSolicitante'>
                                <Input type='text' placeholder='Nome do solicitante' disabled />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                            name='somenteEmAtraso'
                            label='Apresentar somente devoluções em atraso?'
                            rules={[{ required: true, message: 'Campo obrigatório' }]}
                            >
                            <Select placeholder='Selecione uma opção'>
                                {apresentarSomenteDevolucaoEmAtraso.map((op) => (
                                <Option value={op.value} key={String(op.value)}>
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

export default RelatorioDevolucaoLivros;
