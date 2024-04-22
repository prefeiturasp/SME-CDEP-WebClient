import { Col, Row } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes';
import BtnEnviarSolicitacoes from './components/btn-enviar-solicitacao';
import CardDadosSolicitante from './components/card-dados-solicitante';
import ListaAcervosSolicitacao from './components/lista-acervos-solicitacao';
import AcervoSolicitacaoContextProvider from './provider';
import BtnCancelarSolicitacoes from './components/btn-cancelar-solicitacao';

const EnviarSolicitacoes: React.FC = () => {
  const navigate = useNavigate();
  const paramsRoute = useParams();

  const solicitacaoId = paramsRoute?.id ? Number(paramsRoute.id) : 0;

  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  return (
    <AcervoSolicitacaoContextProvider>
      <Col>
        <HeaderPage title={solicitacaoId ? `Solicitação - Nº${solicitacaoId}` : 'Nova Solicitação'}>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar onClick={() => onClickVoltar()} id={CDEP_BUTTON_VOLTAR} />
              </Col>
              <Col>
                <BtnCancelarSolicitacoes />
              </Col>
              <Col>
                <BtnEnviarSolicitacoes />
              </Col>
            </Row>
          </Col>
        </HeaderPage>
        <CardContent>
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <CardDadosSolicitante />
            </Col>
            <Col xs={24}>
              <ListaAcervosSolicitacao />
            </Col>
          </Row>
        </CardContent>
      </Col>
    </AcervoSolicitacaoContextProvider>
  );
};

export default EnviarSolicitacoes;
