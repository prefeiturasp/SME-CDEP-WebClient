import { Col, Form, Input, Row } from 'antd';
import { FormInstance, useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import SelectTipoAcervo from '~/components/cdep/input/tipo-acervo';
import ButtonSecundary from '~/components/lib/button/secundary';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/data-table';
import HeaderPage from '~/components/lib/header-page';

import {
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_NUMERO_SOLICITACAO } from '~/core/constants/ids/input';
import { URL_API_ACERVO_SOLICITACAO } from '~/core/constants/urls-api';
import { ROUTES } from '~/core/enum/routes';
import SelectTipoSituacao from '~/components/cdep/input/tipo-situacao';
import SelectResponsaveis from '~/components/cdep/input/responsaveis';
import dayjs from 'dayjs';
import { SolicitacaoDTO } from '~/core/dto/solicitacao-dto';

const ListAtendimentos: React.FC = () => {
  const navigate = useNavigate();
  const [form] = useForm();

  const columns: ColumnsType<SolicitacaoDTO> = [    
    {
      title: 'N° da solicitação',
      dataIndex: 'acervoSolicitacaoId',
      align: 'center'
    },
    {
      title: 'Tipo de acervo',
      dataIndex: 'tipoAcervo',
      align: 'center'
    },
    {
      title: 'Data da solicitação',
      dataIndex: 'dataCriacao',
      align: 'center',
      render: (dataCriacao: string) => dayjs(dataCriacao).format('DD/MM/YYYY - HH:mm'),
    },
    {
      title: 'Data da visita',
      dataIndex: 'dataVisita',
      align: 'center',
      render: (dataVisita: string) =>{
        if (dataVisita) {
          return dayjs(dataVisita).format('DD/MM/YYYY - HH:mm');
        } else {
          return;
        }
      },
    },
    {
      title: 'Responsável pelo atendimento',
      dataIndex: 'responsavel',
      align: 'center',
    },
    {
      title: 'Situação do Atendimento',
      dataIndex: 'situacao',
      align: 'center'
    },
  ];

  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  const onClickCancelar = (form: FormInstance) => {
    form.resetFields();
  };
  
  return (
    <Col>
      <HeaderPage title='Atendimento de Solicitações'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar onClick={() => onClickVoltar()} id={CDEP_BUTTON_VOLTAR} />
            </Col>
            <Col>
              <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
              {(form) => (
                <ButtonSecundary
                  block
                  type='default'
                  id={CDEP_BUTTON_CANCELAR}
                  onClick={() => onClickCancelar(form)}
                  style={{ fontWeight: 700 }}
                  disabled={!form.isFieldsTouched()}
                >
                  Cancelar
                </ButtonSecundary>
              )}
            </Form.Item>
            </Col>
          </Row>
        </Col>
      </HeaderPage>
      <CardContent>
        <Form form={form} layout='vertical' autoComplete='off'>
          <Form.Item shouldUpdate>
            {() => (
              <Row gutter={[16, 8]}>
                <Col xs={24} sm={8}>
                  <Form.Item label='N° da solicitação' name='AcervoSolicitacaoId'>
                    <Input type='text' placeholder='N° da solicitação' id={CDEP_INPUT_NUMERO_SOLICITACAO} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <SelectTipoAcervo
                    formItemProps={{ rules: [{ required: true }], name: 'tipoAcervo' }}                    
                  />
                </Col>

                <Col xs={24} sm={8}>
                  <SelectResponsaveis />
                </Col>

                <Col xs={24} sm={8}>
                  <SelectTipoSituacao />  
                </Col>

                <Col span={24}>
                  <DataTable
                    rowKey='acervoSolicitacaoId'
                    filters={form.getFieldsValue()}
                    url={`${URL_API_ACERVO_SOLICITACAO}/atendimento-solicitacoes`}
                    columns={columns}                    
                  />
                </Col>
              </Row>
            )}
          </Form.Item>
        </Form>
      </CardContent>
    </Col>
  );
};

export default ListAtendimentos;