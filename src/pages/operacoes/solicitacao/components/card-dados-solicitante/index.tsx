import { Card, Col, Divider, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { DadosSolicitanteDTO } from '~/core/dto/dados-solicitante-dto';
import { TipoUsuario } from '~/core/enum/tipo-usuario-enum';
import { tratarCatch, tratarThen } from '~/core/services/api';
import usuarioService from '~/core/services/usuario-service';
import { Colors } from '~/core/styles/colors';

const { Title, Text } = Typography;

const CardDadosSolicitante: React.FC = () => {
  const [dados, setDados] = useState<DadosSolicitanteDTO>();
  const [loading, setLoading] = useState<boolean>(false);

  const ehExterno = dados?.tipo && dados?.tipo > TipoUsuario.CORESSO;

  const obterDados = async () => {
    setLoading(true);

    const resposta = await usuarioService
      .obterDadosSolicitante()
      .then(tratarThen)
      .catch(tratarCatch)
      .finally(() => setLoading(false));

    if (resposta.sucesso) {
      setDados(resposta.dados);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Card
      type='inner'
      style={{ borderColor: Colors.Neutral.LIGHT, borderRadius: 4 }}
      title={
        <Title
          style={{
            color: Colors.SystemSME.CDEP.PRIMARY_DARK,
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 0,
          }}
        >
          Dados do solicitante
        </Title>
      }
      loading={loading}
    >
      <Row align='middle' wrap={false} justify='space-between'>
        <Col xs={12}>
          <Row justify='space-between' wrap={false}>
            <Col>
              <Title level={5}>{dados?.nome}</Title>
              {ehExterno ? (
                <>
                  <Row>
                    <Text strong>CPF: </Text>
                    <Text style={{ marginLeft: 4 }}>{dados?.cpf}</Text>
                  </Row>
                  <Row>
                    <Text strong>Telefone: </Text>
                    <Text style={{ marginLeft: 4 }}>{dados?.telefone}</Text>
                  </Row>
                </>
              ) : (
                <></>
              )}
              <Row>
                <Text strong>E-mail: </Text>
                <Text style={{ marginLeft: 4 }}>{dados?.email}</Text>
              </Row>
              <Row>
                <Text strong>Tipo do Usuário: </Text>
                <Text style={{ marginLeft: 4 }}>{dados?.tipo}</Text>
              </Row>
            </Col>
            {ehExterno ? (
              <Divider
                type='vertical'
                style={{ borderColor: Colors.BACKGROUND_CONTENT, height: 100 }}
              />
            ) : (
              <></>
            )}
          </Row>
        </Col>
        {ehExterno ? (
          <Col xs={12}>
            <Row>
              <Text strong>Endereço:</Text>
              <Text style={{ marginLeft: 4 }}>{dados?.endereco}</Text>
            </Row>
          </Col>
        ) : (
          <></>
        )}
      </Row>
    </Card>
  );
};

export default React.memo(CardDadosSolicitante);
