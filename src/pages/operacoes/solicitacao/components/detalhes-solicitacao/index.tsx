import { Col, Form, Input, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import SelectResponsaveis from '~/components/cdep/input/responsaveis';
import { SelectSituacaoAtendimento } from '~/components/cdep/input/situacao-atendimento';
import { useForm } from 'antd/es/form/Form';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/cdep/button/voltar';
import { DetalhesSolicitacaoDTO } from '~/core/dto/acervo-detalhes-solicitacao-dto';
import { CDEP_INPUT_NUMERO_SOLICITACAO } from '~/core/constants/ids/input';
import { formatarDataParaDDMMYYYY } from '~/core/utils/functions';

const DEFAULT_VALUES: DetalhesSolicitacaoDTO = {
  id: null,
  usuarioId: null,
  dadosSolicitante: {
    nome: null,
    cpf: null,
    telefone: null,
    endereco: null,
    email: null,
    tipo: null,
  },
  dataSolicitacao: null,
  responsavel: null,
  situacao: null,
  itens: [],
  acervo: null,
}
const DetalhesSolicitacao: React.FC = () => {
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
        dataSolicitacao: formatarDataParaDDMMYYYY(data?.dataSolicitacao),
        dataVisita: formatarDataParaDDMMYYYY(data?.itens?.[0]?.dataVisita),
        responsavel: data?.responsavel,
        situacao: data?.situacao, 
        acervo: `${data?.itens?.[0].codigo} - ${data?.itens?.[0].tipoAcervo}`
      });
    } else {
      setDados(DEFAULT_VALUES);
    }
  }, [setDados]);

  useEffect(() => {
    obterDados();    
  }, []);


  return (
    <Col>
      <Row gutter={[16, 16]}>
        <HeaderPage title='Atendimento de Solicitações'>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar onClick={() => onClickVoltar()} id={CDEP_BUTTON_VOLTAR} />
              </Col>            
            </Row>
          </Col>
        </HeaderPage>        
        <Col xs={24}>
        <Form form={form} layout='vertical' autoComplete='off'  initialValues={dados}>
            <Form.Item shouldUpdate>
              {() => (
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
                    <Form.Item label='Nome do solicitante' name='nome'>
                      <Input
                        type='text'
                        placeholder='Nome do solicitante'
                        disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label='Nome' name='nome'>
                      <Input
                        type='text'
                        placeholder='nome'
                        disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label='Telefone' name='telefone'>
                      <Input
                        type='text'
                        placeholder='telefone'
                        disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label='Email' name='email'>
                      <Input
                        type='text'
                        placeholder='email'
                        disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label='Endereço' name='endereco'>
                      <Input
                        type='text'
                        placeholder='Rua imperatriz, 25'
                        disabled
                      />
                    </Form.Item>
                  </Col>                
                  <Col xs={24} md={8}>                    
                    <Form.Item label='Data da solicitação' name='dataSolicitacao'>
                      <Input
                        type='text'
                        disabled
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      name= 'dataVisita'                      
                      label='Data da Visita'                    
                      >
                      <Input
                        type='text'
                        disabled
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <SelectResponsaveis />
                  </Col>

                  <Col xs={24} md={8}>
                      <SelectSituacaoAtendimento 
                      disabled
                      />
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item label='Acervo' name='acervo'>
                      <Input
                        type='text'
                        placeholder='Titulo do Acervo'
                        disabled
                      />
                    </Form.Item>
                  </Col>  

                </Row>
              )}
            </Form.Item>
          </Form>        
        </Col>
      </Row>
    </Col>
  );
};

export default DetalhesSolicitacao;
