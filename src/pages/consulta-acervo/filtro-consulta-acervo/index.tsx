import { Card, Col, Input, Row, Select, Space, Typography } from 'antd';
import LimparBuscaButton from '~/components/lib/limpar-busca-button';
import { Colors } from '~/core/styles/colors';

export const FiltroConsultaAcervo = () => {
  return (
    <>
      <Typography style={{ fontSize: 20, fontWeight: 'bold', margin: '16px 0 0 16px' }}>
        Faça sua busca
      </Typography>
      <Card
        style={{
          margin: '0 16px',
          backgroundColor: `${Colors.CDEP_PRIMARY}`,
        }}
      >
        <Row gutter={16} justify='space-between'>
          <Col span={12}>
            <Typography style={{ color: '#fff', fontWeight: 'bold' }}>
              Busca por texto livre
            </Typography>
            <Input placeholder='Busque por título, assunto, autor ou crédito' />
          </Col>
          <Col span={12}>
            <Typography style={{ color: '#fff', fontWeight: 'bold' }}>
              Busca por tipos de acervos
            </Typography>
            <Select placeholder='Tipos de acervos' style={{ width: '100%' }} />
          </Col>
        </Row>
        <Row justify='end' style={{ marginTop: 16 }}>
          <Space size={16}>
            <LimparBuscaButton />
          </Space>
        </Row>
      </Card>
    </>
  );
};
