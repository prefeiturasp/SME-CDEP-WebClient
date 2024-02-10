import { Button, Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import Table, { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import SelectResponsaveis from '~/components/cdep/input/responsaveis';
import { SelectSituacaoAtendimento } from '~/components/cdep/input/situacao-atendimento';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import {
  CDEP_BUTTON_ASSUMIR_ATENDIMENTO,
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_CANCELAR_ATENDIMENTO,
  CDEP_BUTTON_CONFIRMAR,
  CDEP_BUTTON_FINALIZAR,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_NUMERO_SOLICITACAO } from '~/core/constants/ids/input';
import {
  DetalhesSolicitacaoDTO,
  ItensDetalhesSolicitacaoDTO,
} from '~/core/dto/acervo-detalhes-solicitacao-dto';
import { ROUTES } from '~/core/enum/routes';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { formatarDataPorFormato } from '~/core/utils/functions';

const columns: ColumnsType<ItensDetalhesSolicitacaoDTO> = [
  {
    title: 'N° do tombo/código',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: 'Título',
    dataIndex: 'codigo',
    align: 'center',
  },
  {
    title: 'Data da visita',
    dataIndex: 'dataVisita',
    align: 'center',
    render: (dataVisita: string) => (dataVisita ? dayjs(dataVisita).format('DD/MM/YYYY') : ''),
  },
  {
    title: 'Tipo de atendimento',
    dataIndex: 'situacao',
    align: 'center',
  },
];

export const DetalhesSolicitacao: React.FC = () => {
  const navigate = useNavigate();
  const paramsRoute = useParams();

  const [form] = useForm();

  const solicitacaoId = paramsRoute?.id ? paramsRoute.id : '0';

  const [dados, setDados] = useState<DetalhesSolicitacaoDTO>();

  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  const obterDados = useCallback(async () => {
    const resposta = await acervoSolicitacaoService.obterDetalhesAcervoSolicitacao(solicitacaoId);
    const data = resposta.dados;
    if (resposta.sucesso) {
      setDados(resposta.dados);
      form.setFieldsValue({
        id: data?.id,
        nome: data?.dadosSolicitante?.nome,
        telefone: data?.dadosSolicitante?.telefone,
        email: data?.dadosSolicitante?.email,
        endereco: data?.dadosSolicitante?.endereco,
        dataSolicitacao: formatarDataPorFormato(data?.dataSolicitacao, 'DD/MM/YYYY - HH:mm'),
        responsavel: data?.responsavel,
        situacao: data?.situacao,
      });
    }
  }, [setDados]);

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Col>
      <HeaderPage title='Atendimento de Solicitações'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar onClick={() => onClickVoltar()} id={CDEP_BUTTON_VOLTAR} />
            </Col>
            <Col>
              <Button
                block
                htmlType='submit'
                id={CDEP_BUTTON_CANCELAR}
                style={{ fontWeight: 700 }}
                disabled
              >
                Cancelar
              </Button>
            </Col>
            <Col>
              <Button
                block
                type='primary'
                htmlType='submit'
                id={CDEP_BUTTON_ASSUMIR_ATENDIMENTO}
                style={{ fontWeight: 700 }}
                disabled
              >
                Assumir atendimento
              </Button>
            </Col>
            <Col>
              <Button
                block
                htmlType='submit'
                id={CDEP_BUTTON_CONFIRMAR}
                style={{ fontWeight: 700 }}
                disabled
              >
                Confirmar
              </Button>
            </Col>
            <Col>
              <Button
                block
                htmlType='submit'
                id={CDEP_BUTTON_FINALIZAR}
                style={{ fontWeight: 700 }}
                disabled
              >
                Finalizar
              </Button>
            </Col>
            <Col>
              <Button
                block
                id={CDEP_BUTTON_CANCELAR_ATENDIMENTO}
                style={{ fontWeight: 700 }}
                disabled
              >
                Cancelar atendimento
              </Button>
            </Col>
          </Row>
        </Col>
      </HeaderPage>

      <CardContent>
        <Col xs={24}>
          <Form form={form} layout='vertical' autoComplete='off' initialValues={dados}>
            <Row gutter={[16, 8]}>
              <Col xs={24} md={8}>
                <Form.Item label='N° da solicitação' name='id'>
                  <Input
                    type='text'
                    placeholder='N° da solicitação'
                    id={CDEP_INPUT_NUMERO_SOLICITACAO}
                    disabled
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item label='Nome' name='nome'>
                  <Input type='text' placeholder='nome' disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item label='Telefone' name='telefone'>
                  <Input type='text' placeholder='telefone' disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item label='Email' name='email'>
                  <Input type='text' placeholder='email' disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item label='Endereço' name='endereco'>
                  <Input type='text' placeholder='Endereço' disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item label='Data da solicitação' name='dataSolicitacao'>
                  <Input type='text' disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item name='dataVisita' label='Data da Visita'>
                  <Input type='text' disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <SelectResponsaveis />
              </Col>

              <Col xs={24} md={8}>
                <SelectSituacaoAtendimento selectProps={{ disabled: true }} />
              </Col>
            </Row>
          </Form>
        </Col>
        <Col xs={24}>
          <Table columns={columns} dataSource={dados?.itens} />
        </Col>
      </CardContent>
    </Col>
  );
};
